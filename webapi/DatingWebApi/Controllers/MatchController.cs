using DatingWebApi.Data;
using DatingWebApi.Model;
using DatingWebApi.Service.EmailService;
using DatingWebApi.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using DatingWebApi.Dto.Chatroom;
using Org.BouncyCastle.Bcpg;
using DatingWebApi.Form.Account;
using OpenAI_API.Chat;
using OpenAI_API;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using DatingWebApi.Dto.Python;
using Newtonsoft.Json;
using System.Text;

namespace DatingWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly OtherService _otherService;
        private readonly DiscoverController _discoverController;

        private readonly IConfiguration _configuration;
        private readonly ILogger<MatchController> _logger;


        public MatchController(DiscoverController discoverController, OtherService otherService, ILogger<MatchController> logger, IConfiguration configuration, IEmailService emailService, UserManager<AppUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager; 
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
            _otherService = otherService;
            _discoverController = discoverController;

        }


        [HttpPost("genAiResponse")]
        public async Task<IActionResult> genAiResponse(AiGenForm form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                _logger.LogInformation("Email claim not found in user principal.");
                return Unauthorized(); // or handle accordingly
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);

            if (user == null)
            {
                return NotFound();
            }
            var latestMsg = await _context.Messages.Where(x => x.RoomId == form.RoomId).OrderByDescending(y => y.Send_TimeStamp).Take(1).FirstOrDefaultAsync();
            if (latestMsg.SenderId == user.Id)
            {
                return BadRequest("Please wait user reply you first");
            }
            var msgList = await _context.Messages.Where(x => x.RoomId == form.RoomId).OrderByDescending(y => y.Send_TimeStamp).Take(15).OrderBy(x => x.Send_TimeStamp).ToListAsync();

            var chatRecord = "";
            foreach (var msg in msgList)
            {
                var res = "";
                res += msg.SenderId == user.Id ? "User A: " : "User B: ";
                res += msg.Content + '\n';
                chatRecord += res;
            }

            var requiredTone = form.Tone == 0 ? "Friendly" : form.Tone == 1 ? "Serious" : form.Tone == 2 ? "Humorous" : form.Tone == 3 ? "Casual" : "";
            var requiredLength = form.Word == 0 ? "Short" : form.Tone == 1 ? "Medium" : form.Tone == 2 ? "Long" : "";

            //var result = "Current User A has been chatting on a dating app with User B. Based on the conversation context and last message, craft a suitable response for User A " +
            //    "Here is the chat record: \n" + chatRecord +'\n' + $"Required response tone:{requiredTone}\n" + $"Required response length:{requiredLength}";

            var result = "A user has been chatting on a dating app. Based on the conversation context and last message, craft a suitable response without including 'User A:' or any similar labels at the beginning." +
        "\nHere is the chat record: \n" + chatRecord + '\n' +
        $"Required response tone: {requiredTone}\n" +
        $"Required response length: {requiredLength}\n" +
        "Generate the response directly as if the user is continuing the conversation.";


            using (var client = new HttpClient())
            {
                string url = _configuration["Chatbot:Url"] + "/genAiResponse";

                var requestData = new
                {
                    prompt = result
                };
                string jsonData = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(responseBody);
                  
                    await _context.SaveChangesAsync();
                    string answer = data.answer.ToString();

                    return Ok(answer);
                    
                }
                else 
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return BadRequest(responseBody);
                }
            }


        }

        [HttpGet("GetChatRoomDetails")]
        public async Task<IActionResult> GetChatRoomDetails()
        {
            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                _logger.LogInformation("Email claim not found in user principal.");
                return Unauthorized(); // or handle accordingly
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);

            if (user == null)
            {
                return NotFound();
            }

            var MatchList = await _context.Matches.Where(x => x.UserId1 == user.Id || x.UserId2 == user.Id).ToListAsync();
            if (MatchList == null)
            {
                return Ok();
            }
           
            var chatroomList = new List<ChatroomDto>();
            foreach (var Match in MatchList)
            {
                var chatroom = new ChatroomDto();
                chatroom.RoomId = Match.RoomId;
                chatroom.ReceiverId = Match.UserId1 == user.Id ? Match.UserId2 : Match.UserId1;

                var receiver = await _userManager.FindByIdAsync(chatroom.ReceiverId);

                if (receiver == null)
                {
                    return NotFound();
                }

                var profile = await _otherService.getUserProfile(receiver);
                chatroom.Profile = profile;
                try
                {
                    var allMessages = await _context.Messages
                        .Where(x => x.RoomId == Match.RoomId)
                        .OrderBy(x => x.Send_TimeStamp)
                        .ToListAsync();

                    var msgs = allMessages.TakeLast(15).ToList();
                    List<GroupedMessage> groupedMsg = msgs.GroupBy(x => new DateTime(x.Send_TimeStamp.Year, x.Send_TimeStamp.Month, x.Send_TimeStamp.Day))
                                                            .Select(x => new GroupedMessage
                                                            {
                                                                Date = x.Key,
                                                                Messages = x.ToList()

                                                            })
                                                            .ToList();

                    chatroom.GroupedMessages = groupedMsg;

                    chatroom.LastMessage_Timestamp = (msgs == null || !msgs.Any()) ? Match.Timestamp : msgs.Max(x => x.Send_TimeStamp);
                }
                catch (Exception error)
                {
                    throw error;
                }
                chatroomList.Add(chatroom);
            }
            var sortedChatroomList = chatroomList.OrderByDescending(x => x.LastMessage_Timestamp).ToList();

            return Ok(sortedChatroomList);
            //return Chatroom Dtos
        }

    }
}
