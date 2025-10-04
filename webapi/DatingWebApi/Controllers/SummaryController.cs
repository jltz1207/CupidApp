using DatingWebApi.Data;
using DatingWebApi.Model;
using DatingWebApi.Service.EmailService;
using DatingWebApi.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DatingWebApi.Form.Rate;
using System.Security.Claims;
using DatingWebApi.Form;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;
using DatingWebApi.Dto.Python;
using System.Globalization;

namespace DatingWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SummaryController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly OtherService _otherService;

        private readonly IConfiguration _configuration;
        private readonly ILogger<SummaryController> _logger;

        public SummaryController(OtherService otherService, ILogger<SummaryController> logger, IConfiguration configuration, IEmailService emailService, UserManager<AppUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
            _otherService = otherService;

        }

        [HttpGet("getInterestList")]
        public async Task<IActionResult> getInterestList()
        {
            var query = _context.Interest_Tags.ToList();
            return Ok(query);
        }

        [HttpGet("getValueList")]
        public async Task<IActionResult> getValueList()
        {
            var query = _context.Value_Tags.ToList();
            return Ok(query);
        }

        [HttpGet("getAboutMeList")]
        public async Task<IActionResult> getAboutMeList()
        {
            var query = _context.AboutMe_Tags.ToList();
            return Ok(query);
        }

        [AllowAnonymous]
        [HttpGet("ChangeProfileUrl")]
        public async Task<IActionResult> ChangeProfileUrl()
        {
            try
            {
                var query = _context.Profile_Users.ToList();

                foreach (var q in query)
                {

                    var newString = @"C:\Users\user\Documents\DatingApp_backend\DatingWebApi\Images" + q.ProfileUrl;

                    // Create a new entity with the modified key property
                    var newProfileUser = new Profile_User
                    {
                        UserId = q.UserId,
                        ProfileUrl = newString,
                    };

                    // Remove the old entity
                    _context.Profile_Users.Remove(q);

                    // Add the new entity
                    _context.Profile_Users.Add(newProfileUser);

                }

                await _context.SaveChangesAsync();

                return Ok(query);
            }
            catch (Exception ex)
            {
                // Log the exception (using your preferred logging framework)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [HttpPost("SubmitTestData")]
        public async Task<IActionResult> SubmitTestData(List<KeywordForm> KeywordForms)
        {
            foreach (var form in KeywordForms)
            {
                using (var client = new HttpClient())
                {
                    string url = _configuration["Chatbot:Url"] + "/getKeywords";
                    var requestData = new
                    {
                        categoryId = form.CategoryId,
                        passage = form.Passage
                    };

                    string jsonData = JsonConvert.SerializeObject(requestData);
                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(url, content);


                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        dynamic data = JsonConvert.DeserializeObject(responseBody);
                        var keywords = data.keywords;
                        var newKey = new List<Keyword>();

                        foreach (string key in keywords)
                        {
                            bool keywordExists = await _context.Keywords.AnyAsync(k => k.UserId == form.UserId && k.CategoryId == form.CategoryId && k.Keywords == key);

                            if (!keywordExists)
                            {
                                newKey.Add(new Keyword { CategoryId = form.CategoryId, Keywords = key, UserId = form.UserId });
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
            }
            return Ok();
        }


        [AllowAnonymous]
        [HttpPost("rateTest")]
        public async Task<IActionResult> RateFunction(List<RateForm> forms, string userId )
        {
            foreach (var form in forms)
            {
                var datetime = DateTime.ParseExact(form.timeStamp, "yyyy-MM-dd HH:mm:ss,fff", CultureInfo.InvariantCulture);
                var rate = new Rate
                {
                    RateCategoryId = form.RateCategoryId,
                    Marks = form.Marks,
                    Reason = form.Reason,
                    UserId = userId,
                    timeStamp = datetime
                };
                _context.Rates.Add(rate);
            }
            await _context.SaveChangesAsync();

            return Ok();
        }



        [HttpPost("RateFunction")]
        public async Task<IActionResult> RateFunction(RateForm form)
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

            Rate rate = new Rate
            {
                RateCategoryId = form.RateCategoryId,
                Marks = form.Marks,
                Reason = form.Reason,
                UserId = user.Id,
                timeStamp = _otherService.getHKTime(),
            };
            await _context.Rates.AddAsync(rate);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("GetAllUserDetails")]
        public async Task<IActionResult> GetAllUserDetails()
        {
            var result = new Dictionary<string, object>();
            var allUsers = await _context.AspNetUsers.Where(x => x.EmailConfirmed && x.ProfileFilled).ToListAsync();
            foreach (var user in allUsers)
            {

                result[user.Id] = await _otherService.returnDetails(user);

            }
            string jsonData = JsonConvert.SerializeObject(result);
            return Ok(jsonData);

        }

        [AllowAnonymous]
        [HttpGet("GetAllUserPhotos")]
        public async Task<IActionResult> GetAllUserPhotos()
        {
            var result = new Dictionary<string, object>();
            var allUsers = await _context.AspNetUsers.Where(x => x.EmailConfirmed && x.ProfileFilled).ToListAsync();
           
            var user_photos_database = new Dictionary<string, List<string>>();
            foreach (var user in allUsers)
            {
                var paths = await _context.Profile_Users.Where(x => x.UserId == user.Id).Select(x => x.ProfileUrl).ToListAsync();
                var contents = new List<string>();
                foreach (var path in paths)
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                    string base64File = Convert.ToBase64String(fileBytes);
                    contents.Add(base64File);
                }
                user_photos_database[user.Id] = contents;
            }
            
            string jsonData = JsonConvert.SerializeObject(user_photos_database);
            return Ok(jsonData);

        }





        [HttpGet("GetUserDetails")]
        public async Task<IActionResult> GetUserDetails(string userId)
        {
            var user = await _context.AspNetUsers.FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            string jsonData = JsonConvert.SerializeObject(await _otherService.returnDetails(user));
            var userDetails = new
            {
                email = user.Email,
                name = user.Name,
                age = user.Date_of_birth.HasValue ? _otherService.CalculateAge(user.Date_of_birth.Value) : 0,
                bio = user.Bio,

                interestTagId = await _context.User_Interests.Where(x => x.UserId == user.Id).Select(x => x.InterestId).ToListAsync(),
                aboutMeTagId = await _context.User_AboutMes.Where(x => x.UserId == user.Id).Select(x => x.AboutMeId).ToListAsync(),
                valueTagId = await _context.User_Values.Where(x => x.UserId == user.Id).Select(x => x.ValueId).ToListAsync(),

                interestKeywords = await _context.Keywords.Where(x => x.UserId == user.Id && x.CategoryId == 1).Select(x => x.Keywords).ToListAsync(),
                personalityKeywords = await _context.Keywords.Where(x => x.UserId == user.Id && x.CategoryId == 2).Select(x => x.Keywords).ToListAsync(),
                hatePersonalityKeywords = await _context.Keywords.Where(x => x.UserId == user.Id && x.CategoryId == 3).Select(x => x.Keywords).ToListAsync(),
            };


            //  string jsonData = JsonConvert.SerializeObject(userDetails);
            return Ok(jsonData);

        }

        


        [AllowAnonymous]
        [HttpGet("addTag")]
        public async Task<IActionResult> addTag()
        {
            //var valueTags = new List<Value_Tag>
            //{
            //};
            //_context.Value_Tags.AddRange(valueTags);
            //await _context.SaveChangesAsync();

            //var interestTags = new List<Interest_Tag>
            //{
            //};

            //_context.Interest_Tags.AddRange(interestTags);
            //_context.SaveChanges();


            var aboutMeTags = new List<AboutMe_Tag>
{
                 new AboutMe_Tag { Name = "Adventurous" },
    new AboutMe_Tag { Name = "Artistic" },
    new AboutMe_Tag { Name = "Bold" },
    new AboutMe_Tag { Name = "Charismatic" },
    new AboutMe_Tag { Name = "Compassionate" },
    new AboutMe_Tag { Name = "Decisive" },
    new AboutMe_Tag { Name = "Diplomatic" },
    new AboutMe_Tag { Name = "Disciplined" },
    new AboutMe_Tag { Name = "Easygoing" },
    new AboutMe_Tag { Name = "Energetic" },
    new AboutMe_Tag { Name = "Enthusiastic" },
    new AboutMe_Tag { Name = "Forgiving" },
    new AboutMe_Tag { Name = "Humorous" },
    new AboutMe_Tag { Name = "Independent" },
    new AboutMe_Tag { Name = "Insightful" },
    new AboutMe_Tag { Name = "Loving" },
    new AboutMe_Tag { Name = "Modest" },
    new AboutMe_Tag { Name = "Open-minded" },
    new AboutMe_Tag { Name = "Optimistic" },
    new AboutMe_Tag { Name = "Outgoing" },
    new AboutMe_Tag { Name = "Perseverant" },
    new AboutMe_Tag { Name = "Polite" },
    new AboutMe_Tag { Name = "Rational" },
    new AboutMe_Tag { Name = "Reflective" },
    new AboutMe_Tag { Name = "Resilient" },
    new AboutMe_Tag { Name = "Romantic" },
    new AboutMe_Tag { Name = "Self-Aware" },
    new AboutMe_Tag { Name = "Self-Disciplined" },
    new AboutMe_Tag { Name = "Trusting" },

};
            _context.AboutMe_Tags.AddRange(aboutMeTags);
            _context.SaveChanges();
            return Ok();

        }

        [AllowAnonymous]
        [HttpPost("generateTestUser")]
        public async Task<IActionResult> generateTestUser([FromForm] TestUserForm form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            foreach (var file in form.ProfileFiles)
            {
                var (firstName, lastName) = _otherService.GenerateRandomName(form.Sex);
                var email = _otherService.GenerateRandomEmail(firstName, lastName);

                DateTime startDate = new DateTime(1989, 1, 1);
                DateTime endDate = new DateTime(2006, 1, 1);
                var birthday = _otherService.GenerateRandomDate(startDate, endDate);

                var age = _otherService.CalculateAge(birthday);

                var user = new AppUser //handle bio after having Id
                {
                    Date_of_birth = birthday,
                    ShowMeMinAge = age,
                    ShowMeMaxAge = age + 5,
                    Gender = form.Sex == 1 ? true : false,
                    ShowMe = form.Sex == 1 ? 0 : 1,
                    Name = $"{firstName} {lastName}",
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    ProfileFilled = true,
                    CreateAt = _otherService.getHKTime(),
                };
                var result = await _userManager.CreateAsync(user, "Pa$$w0rd");

                if (result.Succeeded)
                {
                    var interestIds = _otherService.GenerateRandomIdList(8, 2, 96); // count, min, max
                    var valueIds = _otherService.GenerateRandomIdList(8, 1, 65);
                    var aboutMeIds = _otherService.GenerateRandomIdList(8, 1, 77);

                    foreach (var interestId in interestIds)
                    {
                        await _context.User_Interests.AddAsync(new User_Interest
                        {
                            UserId = user.Id,
                            InterestId = interestId,
                        });
                    }

                    foreach (var aboutMeId in aboutMeIds)
                    {
                        await _context.User_AboutMes.AddAsync(new User_AboutMe
                        {
                            UserId = user.Id,
                            AboutMeId = aboutMeId,
                        });
                    }

                    foreach (var valueId in valueIds)
                    {
                        await _context.User_Values.AddAsync(new User_Value
                        {
                            UserId = user.Id,
                            ValueId = valueId,
                        });
                    }
                    await _context.SaveChangesAsync();

                    try
                    {
                        var profilePath = await _otherService.UploadImage(file, Path.Combine("Profile", user.Id), 0.ToString());
                        await _context.Profile_Users.AddAsync(new Profile_User { UserId = user.Id, ProfileUrl = profilePath });
                    }
                    catch (Exception error) { Console.WriteLine(error); }
                    _context.SaveChanges();


                    //handle Bio
                    var initPromp = await _otherService.getBioPromp(form.Sex, interestIds, aboutMeIds, valueIds, null, null);


                    var messages = new List<HistoryItem>
                    {
                        new HistoryItem{role = "system", content = "Give User their Ai-generate Bio directly in your answer"},
                        new HistoryItem{role = "user", content = initPromp}
                    };
                    string OutputResult = "";
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

                    user.Bio = OutputResult;
                    var result2 = await _userManager.UpdateAsync(user);
                    _context.SaveChanges();
                    if (!result2.Succeeded)
                    {
                        var errors = result2.Errors.Select(e => e.Description).ToList();
                        return BadRequest();
                    }
                }
                else
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(errors);
                }
            }
            return Ok();

        }
    }
}
