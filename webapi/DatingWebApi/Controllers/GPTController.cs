using DatingWebApi.Data;
using DatingWebApi.Dto.Python;
using DatingWebApi.Form.Account;
using DatingWebApi.Form.Bio;
using DatingWebApi.Model;
using DatingWebApi.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Completions;
using OpenAI_API.Models;
using OpenAI_API.Moderation;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using static MailKit.Net.Imap.ImapEvent;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace DatingWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GPTController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly OtherService _otherService;
        private readonly UserManager<AppUser> _userManager;

        public GPTController(UserManager<AppUser> userManager, OtherService otherService, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _otherService = otherService;
            _configuration = configuration;
            _context = context;
        }
        private async Task<string> getBioPromp(ProfileModel model)
        {

            int[] InterestIds = Array.ConvertAll(model.InterestIds.Split(','), int.Parse);
            int[] AboutMeIds = Array.ConvertAll(model.AboutMeIds.Split(','), int.Parse);
            int[] ValueIds = Array.ConvertAll(model.ValueIds.Split(','), int.Parse);


            var userInterests = await _context.Interest_Tags.Where(x => InterestIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userValues = await _context.Value_Tags.Where(x => ValueIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userAboutMes = await _context.AboutMe_Tags.Where(x => AboutMeIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();

            var userInformation_Msg = $"Interests: {string.Join(", ", userInterests)}\n"
                                    + $"Values: {string.Join(", ", userValues)}\n"
                                    + $"About Mes: {string.Join(", ", userAboutMes)}\n";

            var result = "Give me the Bio description directly for dating App without any introductory text or quotation marks? Here is the details for the current User\n" +
                $"Gender:{(model.Gender ? "Female" : "Male")}\n" +
                $"{(string.IsNullOrEmpty(model.LookingFor) ? "" : $"Looking For: {model.LookingFor}")}\n" +
                $"{(string.IsNullOrEmpty(model.OtherDetails) ? "" : $"Other details: {model.OtherDetails}\n")}"
                + userInformation_Msg;

            return result;
        }

        private async Task<string> getInitPromp(string userId) // interest
        {
            var user_InterestIds = await _context.User_Interests.Where(x => x.UserId == userId).Select(x => x.InterestId).ToListAsync();
            var user_ValueIds = await _context.User_Values.Where(x => x.UserId == userId).Select(x => x.ValueId).ToListAsync();
            var user_AboutMeIds = await _context.User_AboutMes.Where(x => x.UserId == userId).Select(x => x.AboutMeId).ToListAsync();

            var userInterests = await _context.Interest_Tags.Where(x => user_InterestIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userValues = await _context.Value_Tags.Where(x => user_ValueIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userAboutMes = await _context.AboutMe_Tags.Where(x => user_AboutMeIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();

            var userInformation_Msg = $"Interests: {string.Join(", ", userInterests)}\n"
                                    + $"Values: {string.Join(", ", userValues)}\n"
                                    + $"About Mes: {string.Join(", ", userAboutMes)}\n";

            var result = "In this conversation, you are a friendly AI assistant for Our dating app: Cupid, " +
            "designed to help users find the best matches based on their hobbies and values. " +
            "Your goal is to ask questions that get deeper to the user's interests, Values, and what they're looking for in a partner. " +
            "Be patient and show genuine interest in the user's responses. and ask them one by one " +
            $"Given: {userInformation_Msg}" +
            "Start with a warm introduction without 'Asistant:' that includes the name of the app, and proceed to get more deeper to the user's interest";
            return result;
        }

        private async Task<string> getPersonalityPromp(string userId) // interest
        {
            var user_AboutMeIds = await _context.User_AboutMes.Where(x => x.UserId == userId).Select(x => x.AboutMeId).ToListAsync();

            var userAboutMes = await _context.AboutMe_Tags.Where(x => user_AboutMeIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();

            var userInformation_Msg = $"About Mes: {string.Join(", ", userAboutMes)}\n";

            var result = "Let's move on to the Personality Section. Please proceed to ask question about the user's Peronality" +
            $"Given: {userInformation_Msg}";

            return result;
        }

        private async Task<string> getHatePersonalityPromp(string userId) // interest
        {
            var result = "Let's move on to the Hate Personality Section. Please proceed to ask question what partner's personalities the user hates most ";
            return result;
        }

        private List<HistoryItem> convertChatMessage(List<GptMessage> gptMessages)
        {
            var result = new List<HistoryItem>();
            foreach (var gptmsg in gptMessages)
            {
                var message = new HistoryItem { role = gptmsg.GptRoleId == 1 ? "system" : gptmsg.GptRoleId == 2 ? "assistant" : "user", content = gptmsg.Content };
                result.Add(message);
            }
            return result;
        }


        [HttpPost("GenerateAiBio")]
        public async Task<IActionResult> GenerateAiBio([FromForm] ProfileModel model)
        {
            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByEmailAsync(emailClaim);
            if (user == null)
            {
                return NotFound();
            }
            var userId = user.Id;

            string OutputResult = "";

            var initPromp = await getBioPromp(model);

            //var messages = new List<ChatMessage>
            //{
            //     new ChatMessage( ChatMessageRole.System, "Give User their Ai-generate Bio directly in your answer"),
            //    new ChatMessage( ChatMessageRole.User, initPromp)
            //};

            var messages = new List<HistoryItem>
            {
                new HistoryItem{role = "system", content = "Give User their Ai-generate Bio directly in your answer"},
                new HistoryItem{role = "user", content = initPromp}

            };

            using (var client = new HttpClient())
            {
                string url = _configuration["Chatbot:Url"] + "/genAiBio";
                var requestData = new
                {
                    history = messages
                };

                string jsonData = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);


                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(responseBody);
                    OutputResult = data.answer.ToString();
                }
                else
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return BadRequest(responseBody);
                }
            }
            return Ok(OutputResult);
        }


        [HttpGet("loadCupidMessages")]
        public async Task<IActionResult> loadCupidMessages()
        {
            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);
            if (user == null)
            {
                return NotFound();
            }
            var userId = user.Id;

            string OutputResult = "";

            var systemPrompts = await _context.GptMessages.Where(x => x.UserId == userId && x.GptRoleId == 1).OrderByDescending(x => x.Send_TimeStamp).ToListAsync();// get prompt


            var resultMsg = new List<GptMessage>();

            if (!systemPrompts.Any())
            {
                var messages = new List<HistoryItem>();

                var initPromp = await getInitPromp(userId);
                messages.Add(new HistoryItem
                {
                    role = "system",
                    content = initPromp
                });
                _context.GptMessages.Add(new GptMessage
                {
                    UserId = userId,
                    Content = initPromp,
                    Send_TimeStamp = _otherService.getHKTime(),
                    GptRoleId = 1,
                    CategoryId = 1
                });

                using (var client = new HttpClient())
                {
                    string url = _configuration["Chatbot:Url"] + "/askCupid";
                    var requestData = new
                    {
                        history = messages
                    };

                    string jsonData = JsonConvert.SerializeObject(requestData);
                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(url, content);


                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        dynamic data = JsonConvert.DeserializeObject(responseBody);
                        OutputResult = data.answer;
                    }
                    else
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        return BadRequest(responseBody);
                    }
                }

                var gptMsg = new GptMessage
                {
                    UserId = userId,
                    Content = OutputResult,
                    Send_TimeStamp = _otherService.getHKTime(),
                    GptRoleId = 2,
                    CategoryId = 1

                };
                _context.GptMessages.Add(gptMsg);
                await _context.SaveChangesAsync();

                resultMsg.Add(gptMsg);
            }
            else
            {
                var msgRecord = await _context.GptMessages.Where(x => x.UserId == userId && x.GptRoleId != 1 && x.CategoryId != 5).OrderBy(x => x.Send_TimeStamp).ToListAsync();
                resultMsg = msgRecord;

            }
            return Ok(resultMsg);

        }

        [AllowAnonymous]
        [HttpPost("sendCupidMessage")]
        public async Task<IActionResult> sendCupidMessage(string query)
        {
            //backend validation

            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }

            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);
            if (user == null)
            {
                return NotFound();
            }
            var userId = user.Id;

            var systemPrompts = await _context.GptMessages.Where(x => x.UserId == userId && x.GptRoleId == 1).OrderByDescending(x => x.Send_TimeStamp).ToListAsync();// get prompt

            if (!systemPrompts.Any())
            {
                return BadRequest();
            }

            //get previous chat record, including prompt
            var msgRecord = await _context.GptMessages.Where(x => x.UserId == userId && x.CategoryId != 5).OrderBy(x => x.Send_TimeStamp).ToListAsync();

            var latestSystemPrompt = systemPrompts.FirstOrDefault();
            var queryMsg = (new GptMessage
            {
                UserId = userId,
                Content = query,
                Send_TimeStamp = _otherService.getHKTime(),
                GptRoleId = 3,
                CategoryId = latestSystemPrompt.CategoryId, // knowing which category currently is
            });

            msgRecord.Add(queryMsg); //add new query
            _context.GptMessages.Add(queryMsg);

            var MsgNum = await _context.GptMessages.Where(x => x.CategoryId == latestSystemPrompt.CategoryId && x.UserId == userId && x.GptRoleId != 1).CountAsync();
            var finalCategory = latestSystemPrompt.CategoryId;
            if (MsgNum > 15) // move forward to next section if >15 //set to 5 , except system prompt
            {
                string newPrompt = "";
                switch (latestSystemPrompt.CategoryId)// 1,2,3
                {
                    case 1:
                        newPrompt = await getPersonalityPromp(userId);
                        break;
                    case 2:
                        newPrompt = await getHatePersonalityPromp(userId);
                        break;
                }
                var newPrompMsg = (new GptMessage
                {
                    UserId = userId,
                    Content = newPrompt,
                    Send_TimeStamp = _otherService.getHKTime(),
                    GptRoleId = 1,
                    CategoryId = latestSystemPrompt.CategoryId + 1,
                });

                finalCategory = latestSystemPrompt.CategoryId + 1;//change cate

                _context.GptMessages.Add(newPrompMsg);
                await _context.SaveChangesAsync();
                msgRecord.Add(newPrompMsg); //add prompt to chata record list 
            }

            var messages = convertChatMessage(msgRecord);
            var OutputResult = "";
            using (var client = new HttpClient())
            {
                string url = _configuration["Chatbot:Url"] + "/askCupid";
                var requestData = new
                {
                    categoryId = finalCategory,
                    userId = userId,
                    history = messages
                };

                string jsonData = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);


                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(responseBody);
                    OutputResult = data.answer;
                    var keywords = data.keywords;
                    var newKey = new List<Keyword>();

                    foreach (string key in keywords)
                    {
                        bool keywordExists = await _context.Keywords.AnyAsync(k => k.UserId == user.Id && k.CategoryId == finalCategory && k.Keywords == key);

                        if (!keywordExists)
                        {
                            newKey.Add(new Keyword { CategoryId = finalCategory, Keywords = key, UserId = user.Id });
                        }
                    }
                    await _context.Keywords.AddRangeAsync(newKey);
                    await _context.SaveChangesAsync();

                }
                else
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return BadRequest(responseBody);
                }
            }




            var gptResponseMsg = new GptMessage
            {
                UserId = userId,
                Content = OutputResult,
                Send_TimeStamp = _otherService.getHKTime(),
                GptRoleId = 2,
                CategoryId = finalCategory
            };
            _context.GptMessages.Add(gptResponseMsg);
            await _context.SaveChangesAsync();

            return Ok(gptResponseMsg);

        }





        [AllowAnonymous]
        [HttpGet("loadAsistMessages")]
        public async Task<IActionResult> loadAsistMessages()
        {
            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);
            if (user == null)
            {
                return NotFound();
            }
            var userId = user.Id;

            //string OutputResult = "";
            //var openai = new OpenAIAPI(_configuration["ChatGPT:Key"]);

            var msgRecord = await _context.GptMessages.Where(x => x.UserId == userId && x.CategoryId == 5).OrderBy(x => x.Send_TimeStamp).ToListAsync();// get prompt


            //get previous chat record

            var resultMsg = new List<GptMessage>();

            if (!msgRecord.Any())
            {
                var firstMsg = new GptMessage
                {
                    UserId = userId,
                    Content = _configuration["AppAsistant:First"],
                    Send_TimeStamp = _otherService.getHKTime(),
                    GptRoleId = 4,
                    CategoryId = 5
                };

                resultMsg.Add(firstMsg);
                await _context.GptMessages.AddAsync(firstMsg);
                await _context.SaveChangesAsync();

            }
            else
            {
                resultMsg = msgRecord;

            }
            return Ok(resultMsg);

        }

        [AllowAnonymous]
        [HttpPost("sendAsistMessage")]
        public async Task<IActionResult> sendAsistMessage(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }

            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);
            if (user == null)
            {
                return NotFound();
            }
            var userId = user.Id;

            //get previous chat record
            var msgRecord = await _context.GptMessages.Where(x => x.UserId == userId && x.CategoryId == 5).OrderBy(x => x.Send_TimeStamp).ToListAsync(); // at least hv first msg saved

            if (!msgRecord.Any())
            {
                return BadRequest();
            }

            var queryMsg = (new GptMessage
            {
                UserId = userId,
                Content = query,
                Send_TimeStamp = _otherService.getHKTime(),
                GptRoleId = 3,
                CategoryId = 5,
            });
            msgRecord.Add(queryMsg); //add new query
            _context.GptMessages.Add(queryMsg);

            //convert to chat msg
            var result = new List<HistoryItem>();

            foreach (var gptmsg in msgRecord)
            {
                var message = new HistoryItem
                {
                    role = gptmsg.GptRoleId == 1 ? "system" : gptmsg.GptRoleId == 2 ? "assistant" : "user",
                    content = gptmsg.Content
                };
                result.Add(message);
            }
            using (var client = new HttpClient())
            {
                string url = _configuration["Chatbot:Url"] + "/askAsistant";

                var requestData = new
                {
                    query = query,
                    folderName = _configuration["Chatbot:AsistDb"],
                    history = result
                };

                string jsonData = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(responseBody);
                    var gptResponseMsg = new GptMessage
                    {
                        UserId = userId,
                        Content = data.answer,
                        Send_TimeStamp = _otherService.getHKTime(),
                        GptRoleId = 4,
                        CategoryId = 5
                    };
                    _context.GptMessages.Add(gptResponseMsg);
                    await _context.SaveChangesAsync();

                    return Ok(gptResponseMsg);
                }
                else
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return BadRequest(responseBody);
                }

            }






        }

        [HttpPost("GenUpdateBio")]
        public async Task<IActionResult> GenUpdateBio(BioForm form)
        {
            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);
            if (user == null)
            {
                return NotFound();
            }
           

            var OutputResult = "";

            var InterestIds = await _context.User_Interests.Where(x=>x.UserId == user.Id).Select(x=>x.InterestId).ToListAsync();
            var ValueIds  = await _context.User_Values.Where(x => x.UserId == user.Id).Select(x => x.ValueId).ToListAsync();
            var AboutMeIds = await _context.User_AboutMes.Where(x => x.UserId == user.Id).Select(x => x.AboutMeId).ToListAsync();




            var userInterests = await _context.Interest_Tags.Where(x => InterestIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userValues = await _context.Value_Tags.Where(x => ValueIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userAboutMes = await _context.AboutMe_Tags.Where(x => AboutMeIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();

            var userInformation_Msg = $"Interests: {string.Join(", ", userInterests)}\n"
                                    + $"Values: {string.Join(", ", userValues)}\n"
                                    + $"About Mes: {string.Join(", ", userAboutMes)}\n";

            var initPromp = "Give me the Bio description directly for dating App without any introductory text or quotation marks? Here is the details for the current User\n" +
                $"Gender:{(user.Gender == true ? "Female" : "Male")}\n" +
                $"{(string.IsNullOrEmpty(form.LookingFor) ? "" : $"Looking For: {form.LookingFor}")}\n" +
                $"{(string.IsNullOrEmpty(form.OtherDetails) ? "" : $"Other details: {form.OtherDetails}\n")}"
                + userInformation_Msg;

            var messages = new List<HistoryItem>
            {
                new HistoryItem{role = "system", content = "Give User their Ai-generate Bio directly in your answer"},
                new HistoryItem{role = "user", content = initPromp}
            };

            using (var client = new HttpClient())
            {
                string url = _configuration["Chatbot:Url"] + "/genAiBio";
                var requestData = new
                {
                    history = messages
                };

                string jsonData = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);


                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(responseBody);
                    OutputResult = data.answer.ToString();
                }
                else
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return BadRequest(responseBody);
                }
            }
            return Ok(OutputResult);
        }
    }
}
