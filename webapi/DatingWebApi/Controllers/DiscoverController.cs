using DatingWebApi.Data;
using DatingWebApi.Model;
using DatingWebApi.Service.EmailService;
using DatingWebApi.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DatingWebApi.Dto.Account;
using Microsoft.Extensions.Hosting;
using System.Security.Claims;
using DatingWebApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using Match = DatingWebApi.Model.Match;
using Newtonsoft.Json;
using OpenAI_API.Moderation;
using System.Text;
using System;
using DatingWebApi.Dto.Weight;
using OpenAI_API.Images;
using DatingWebApi.Form.Face;

namespace DatingWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscoverController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly OtherService _otherService;

        private readonly IConfiguration _configuration;
        private readonly ILogger<DiscoverController> _logger;
        private readonly IHubContext<ChatHub> _chatHubContext;

        public DiscoverController(OtherService otherService, ILogger<DiscoverController> logger, IConfiguration configuration, IEmailService emailService, UserManager<AppUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
            _otherService = otherService;

        }




        [HttpGet("getRandomMatches")]
        public async Task<IActionResult> getRandomMatches()
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
           
            var defaultWeight = new WeightDto
            {
                cosine_similarity = 1.0,
                common_interest_tags = 8.0,
                common_about_me_tags = 8.0,
                common_value_tags = 8.0,
                hate_keywords = 8.0,
                age_as_expected =3.0
            };

            //probably not exist, register issue
            var existWeight = await _context.Weights.FirstOrDefaultAsync(x=>x.UserId == user.Id);
            if (existWeight != null)
            {
                switch (existWeight.KeywordWeight) // for all keywords: bio, and cupid
                {
                    case 0:
                        defaultWeight.cosine_similarity *= 0;
                        defaultWeight.hate_keywords *= 0;

                        break;
                    case 1:
                        defaultWeight.cosine_similarity *= 0.5;
                        defaultWeight.hate_keywords *= 0.5;

                        break;
                    case 2:
                        defaultWeight.cosine_similarity *= 1;
                        defaultWeight.hate_keywords *=1;

                        break;
                    case 3:
                        defaultWeight.cosine_similarity *= 1.5;
                        defaultWeight.hate_keywords *= 1.5;
                        break;
                    case 4:
                        defaultWeight.cosine_similarity *= 2;
                        defaultWeight.hate_keywords *= 2;
                        break;
                
                }

                switch (existWeight.InterestWeight)
                {
                    case 0:
                        defaultWeight.common_interest_tags *= 0;
                        break;
                    case 1:
                        defaultWeight.common_interest_tags *= 0.5;
                        break;
                    case 2:
                        defaultWeight.common_interest_tags *= 1;
                        break;
                    case 3:
                        defaultWeight.common_interest_tags *= 1.5;
                        break;
                    case 4:
                        defaultWeight.common_interest_tags *= 2;
                        break;
                  
                }

                switch (existWeight.AboutMeWeight)
                {
                    case 0:
                        defaultWeight.common_about_me_tags *= 0;
                        break;
                    case 1:
                        defaultWeight.common_about_me_tags *= 0.5;
                        break;
                    case 2:
                        defaultWeight.common_about_me_tags *= 1;
                        break;
                    case 3:
                        defaultWeight.common_about_me_tags *= 1.5;
                        break;
                    case 4:
                        defaultWeight.common_about_me_tags *= 2;
                        break;
                   
                }

                switch (existWeight.ValueWeight)
                {
                    case 0:
                        defaultWeight.common_value_tags *= 0;
                        break;
                    case 1:
                        defaultWeight.common_value_tags *= 0.5;
                        break;
                    case 2:
                        defaultWeight.common_value_tags *= 1;
                        break;
                    case 3:
                        defaultWeight.common_value_tags *= 1.5;
                        break;
                    case 4:
                        defaultWeight.common_value_tags *= 2;
                        break;
                    
                }

                switch (existWeight.AgeWeight)
                {
                    case 0:
                        defaultWeight.age_as_expected *= 0;
                        break;
                    case 1:
                        defaultWeight.age_as_expected *= 0.5;
                        break;
                    case 2:
                        defaultWeight.age_as_expected *= 1;
                        break;
                    case 3:
                        defaultWeight.age_as_expected *= 1.5;
                        break;
                    case 4:
                        defaultWeight.age_as_expected *= 2;
                        break;
                 
                }


            }


            // fetch weight, show me: age, sex
            var expectedSex = user.ShowMe == 0 ? "male" : user.ShowMe == 1 ? "female" : null;
            //age
            //weight
            
            //find Ids, Filter: matched, Liked
            var matchedIds1 = await _context.Matches.Where(x=>x.UserId1 == user.Id).Select(x=>x.UserId2).ToListAsync();
            var matchedIds2 = await _context.Matches.Where(x => x.UserId2 == user.Id).Select(x => x.UserId1).ToListAsync();

            var likedIds = await  _context.UserLikes.Where(x=>x.LikeUserId == user.Id ).Select(x => x.LikedUserId).ToListAsync();


            matchedIds1.AddRange(matchedIds2);
            matchedIds1.AddRange(likedIds);
            matchedIds1.Add(user.Id); // not include yourself
            //filter overlapIds first
            var query =  _context.AspNetUsers.Where(x => !matchedIds1.Contains(x.Id) &&x.EmailConfirmed==true && x.ProfileFilled ==true);
            if (user.ShowMe == 0  )
            {
                query = query.Where(x => x.Gender == false);
            }
            else if(user.ShowMe ==1){
                query = query.Where(x => x.Gender == true);
            }
            var otherUserIds = await query.Select(x => x.Id).ToListAsync();
            //send request, for matching 
            using (var client = new HttpClient())
            {
                string url = _configuration["Chatbot:Url"] + "/getMatches";

                var requestData = new
                {
                    userId = user.Id,
                    otherUserIds = otherUserIds,
                    //expectedSex = expectedSex,
                    expectedMinAge = user.ShowMeMinAge,
                    expectedMaxAge = user.ShowMeMaxAge,
                    weight = defaultWeight

                };
                string jsonData = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(responseBody);

                    List<string> sortedId = data.sortedId.ToObject<List<string>>();
                    var resultList = new List<UserDto_Detailed>();

                    var sortedUsers = _context.Users
                        .AsEnumerable()
                        .Where(u => sortedId.Contains(u.Id))
                        .OrderBy(u => sortedId.IndexOf(u.Id))
                        .ToList();

                    foreach (var sorterdUser in sortedUsers)
                    {
                        var result = await _otherService.getUserProfile(sorterdUser);
                        resultList.Add(result);
                    }


                    return Ok(resultList);

                }
                else
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return BadRequest(responseBody);
                }
            }


            //var query = _context.AspNetUsers.ToList();
            //var resultList = new List<UserDto_Detailed>();
            //foreach (var otherUser in query)
            //{
            //    var result = await _otherService.getUserProfile(otherUser);
            //    resultList.Add(result);
            //}




        }

        [HttpPost("handleLike")]
        public async Task<IActionResult> handleLike(string likedUserId)
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


            var likedByOthers = await _context.UserLikes.Where(x => x.LikedUserId == user.Id).Select(x => x.LikeUserId).ToListAsync();
            var isMatch = likedByOthers.Contains(likedUserId) ? true : false;

            DateTime utcNow = DateTime.UtcNow;
            TimeZoneInfo hktZone = TimeZoneInfo.FindSystemTimeZoneById("China Standard Time");
            DateTime hktTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, hktZone);

            await _context.UserLikes.AddAsync(
                    new UserLike
                    {
                        Timestamp = hktTime,
                        LikeUserId = user.Id,
                        LikedUserId = likedUserId,
                    }
                    );
            await _context.SaveChangesAsync();
            Guid roomId = Guid.NewGuid();
            if (isMatch)
            {
                await _context.Matches.AddAsync(
                    new Match
                    {
                        Timestamp = hktTime,
                        UserId1 = user.Id,
                        UserId2 = likedUserId,
                        RoomId = roomId
                    }
                    );
                await _context.SaveChangesAsync();
                //await _chatHubContext.Clients.User(likedUserId).SendAsync($"Matched with {user.Id}");
                //await _chatHubContext.Clients.User(user.Id).SendAsync($"Matched with {likedUserId}");

            }

            return Ok(new { IsMatch = isMatch, RoomId = isMatch ? roomId : (Guid?)null });




        }

        [HttpPost("genFaceMatch")]
        public async Task<IActionResult> genFaceMatch([FromForm] FaceForm model)
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

            //handle photo input
            string newImageBase64File = "";
            if (model.NewImage != null && model.NewImage.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await model.NewImage.CopyToAsync(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();
                    newImageBase64File = Convert.ToBase64String(fileBytes);
                }
            }
            else
            {
                return BadRequest("Uploaded Image is null");
            }

            //Filter liked User
            var likedUserIds = await _context.UserLikes.Where(x=>x.LikeUserId == user.Id).Select(x=>x.LikedUserId).ToListAsync();

            //Filter matched User
            var matchedUserIds1 = await _context.Matches.Where(x => x.UserId1 == user.Id).Select(x=>x.UserId2).ToListAsync();
            var matchedUserIds2 = await _context.Matches.Where(x => x.UserId2 == user.Id).Select(x => x.UserId1).ToListAsync();
            likedUserIds.AddRange(matchedUserIds1);
            likedUserIds.AddRange(matchedUserIds2);

            //Filter otherUsers data
            var query = _context.AspNetUsers.Where(x => x.ProfileFilled && x.EmailConfirmed &&!likedUserIds.Contains(x.Id));
            if (user.ShowMe == 0)
            {
                query = query.Where(x => x.Gender == false);
            }
            else if (user.ShowMe == 1)
            {
                query = query.Where(x => x.Gender == true);
            }

            //handle otherUsers data
            var otherUserIds = await query.Select(x=>x.Id).ToListAsync();
         
            using (var client = new HttpClient())
            {
                string url = _configuration["Chatbot:Url"] + "/genFaceMatch";

                var requestData = new
                {
                    otherUserIds = otherUserIds,
                    newImage_base64 = newImageBase64File
                };
                string jsonData = JsonConvert.SerializeObject(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);
                
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(responseBody);

                    await _context.SaveChangesAsync();
                    string matchedId = data.answer.ToString();
                    var matchedUser = await _context.AspNetUsers.FirstOrDefaultAsync(x=>x.Id == matchedId);
                    var result = await _otherService.getUserProfile(matchedUser);
                    return Ok(result);

                }
                else
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return BadRequest(responseBody);
                }
            }


        }


    }
}
