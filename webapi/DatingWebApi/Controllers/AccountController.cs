using AutoMapper;
using DatingWebApi.Data;
using DatingWebApi.Dto.Account;
using DatingWebApi.Dto.Email;
using DatingWebApi.Form.Account;
using DatingWebApi.Model;
using DatingWebApi.Service;
using DatingWebApi.Service.EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace DatingWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly OtherService _otherService;

        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountController> _logger;
        private readonly IMapper _mapper;

        public AccountController( IMapper mapper, OtherService otherService, ILogger<AccountController> logger, IConfiguration configuration, IEmailService emailService, UserManager<AppUser> userManager, ApplicationDbContext context)
        {
            _mapper = mapper;
            _userManager = userManager;
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
            _otherService = otherService;

        }

        [HttpGet("user")]
        public async Task<IActionResult> GetCurrentUser() 
        {
            try
            {

                var emailClaim = User.FindFirstValue(ClaimTypes.Email);
                if (emailClaim == null)
                {
                    _logger.LogInformation("Email claim not found in user principal.");
                    return Unauthorized(); // or handle accordingly
                }
                var user = await _userManager.FindByEmailAsync(emailClaim);

                var profile = _context.Profile_Users.FirstOrDefault(x => x.UserId == user.Id);
                var fileName = profile != null ? String.Format("{0}://{1}{2}/Images/Profile/{3}/{4}", Request.Scheme, Request.Host, Request.PathBase, user.Id, Path.GetFileName(profile.ProfileUrl)) : null;

                //get roomIds to be join
                var roomIds = new List<Guid>();
                var MatchList = await _context.Matches.ToListAsync();

                if (MatchList != null)
                {
                    foreach (var match in MatchList)
                    {
                        if (user.Id.Equals(match.UserId1) || user.Id.Equals(match.UserId2))
                        {
                            roomIds.Add(match.RoomId);
                        }
                    }
                }

                return Ok(new UserDto
                {

                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Token = await TokenService.CreateToken(user, _userManager, _configuration),
                    EmailConfirmed = user.EmailConfirmed,
                    ProfileFilled = user.ProfileFilled,
                    IconSrc = fileName,
                    RoomIds = roomIds
                });
            }
            catch (Exception ex)
            {
                throw ex;
            }



        }

        [HttpPost("Login_Google")]
        [AllowAnonymous]
        public async Task<IActionResult> Login_Google(string cred)
        {

            var payload = await TokenService.VerifyGoogleToken(cred);

            if (payload == null)
            {
                return BadRequest("Invalid Google ID token");
            }
            var user = await _userManager.FindByEmailAsync(payload.Email);


            if (user == null)
            {
                var newUser = new AppUser
                {
                    Email = payload.Email,
                    UserName = payload.Email,
                    EmailConfirmed = true,
                    CreateAt = DateTime.UtcNow,
                };
                var result = await _userManager.CreateAsync(newUser);

                if (result.Succeeded)
                {

                    return Ok(new UserDto
                    {
                        Id = newUser.Id,
                        Email = payload.Email,
                        Name = payload.Name,
                        Token = await TokenService.CreateToken(newUser, _userManager, _configuration),
                        EmailConfirmed = newUser.EmailConfirmed,
                        ProfileFilled = newUser.ProfileFilled,

                    });
                }
                else
                {
                    // Create a list of error messages from the result
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    // Return the error messages as a BadRequest
                    return BadRequest(errors);
                }


            }
            else
            {
                var profile = _context.Profile_Users.FirstOrDefault(x => x.UserId == user.Id);
                var fileName = profile != null ? String.Format("{0}://{1}{2}/Images/Profile/{3}/{4}", Request.Scheme, Request.Host, Request.PathBase, user.Id, Path.GetFileName(profile.ProfileUrl)) : null;

                return Ok(new UserDto
                {
                    Id = user.Id,
                    Token = await TokenService.CreateToken(user, _userManager, _configuration),
                    Email = user.Email,
                    Name = user.Name,
                    EmailConfirmed = user.EmailConfirmed,
                    ProfileFilled = user.ProfileFilled,
                    IconSrc = fileName
                });
            }
        }


        [HttpPost("Login_Normal")]
        [AllowAnonymous]
        public async Task<IActionResult> Login_Normal(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return NotFound("This Email is not exist");
            }
            var result = await _userManager.CheckPasswordAsync(user, model.Password);

            if (!result)
            {
                return BadRequest("The Password is incorrect");
            }
            else
            {
                var profile = _context.Profile_Users.FirstOrDefault(x => x.UserId == user.Id);
                var fileName = profile != null ? String.Format("{0}://{1}{2}/Images/Profile/{3}/{4}", Request.Scheme, Request.Host, Request.PathBase, user.Id, Path.GetFileName(profile.ProfileUrl)) : null;


                return Ok(new UserDto
                {
                    Id = user.Id,
                    Token = await TokenService.CreateToken(user, _userManager, _configuration),
                    Name = user.UserName,
                    Email = user.Email,
                    EmailConfirmed = user.EmailConfirmed,
                    ProfileFilled = user.ProfileFilled,
                    IconSrc = fileName
                });

            }

        }

        [HttpPost("Register_ValidateEmail")]
        [AllowAnonymous]
        public async Task<IActionResult> Register_ValidateEmail(RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (model.Password != model.RePassword)
            {
                return BadRequest("RE-Password inconsistent");
            }

            var existingUser = await _userManager.FindByEmailAsync(model.Email);



            if (existingUser != null)
            {
                return BadRequest("This email is used");
            }

            var user = new AppUser
            {
                UserName = model.Email,
                Email = model.Email,
                CreateAt = _otherService.getHKTime(),

            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                string encodedToken = WebUtility.UrlEncode(token);
                string callbackUrl = $"{_configuration["FrontendSettings:Url"]}/ConfirmEmail?userId={user.Id}&token={encodedToken}";

                var request = new EmailDto
                {
                    To = model.Email,
                    Subject = "Email Verification",
                    Body = "<h1>Please confirm your email address<hi>" +
                    $"<h2>{callbackUrl}</h2>"
                };
                await _emailService.SendEmailAsync(request);

                return Ok(new UserDto
                {
                    Id = user.Id,
                    Token = await TokenService.CreateToken(user, _userManager, _configuration),
                    Name = user.UserName,
                    Email = user.Email,
                    EmailConfirmed = user.EmailConfirmed,
                    ProfileFilled = user.ProfileFilled
                });
            }
            else
            {
                // Create a list of error messages from the result
                var errors = result.Errors.Select(e => e.Description).ToList();
                // Return the error messages as a BadRequest
                return BadRequest(errors);
            }

        }



        [HttpPost("Submit_Profile")]
        public async Task<IActionResult> Submit_Profile([FromForm] ProfileModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(model.Id);
            user.Bio = model.Bio;
            user.Name = model.Name;
            user.Date_of_birth = model.DateOfBirth;
            user.Gender = model.Gender;
            user.ProfileFilled = true;
            user.ShowMe = model.ShowMe;
            user.UpdateAt = DateTime.UtcNow;
            user.ShowMeMinAge = model.ShowMeMinAge;
            user.ShowMeMaxAge = model.ShowMeMaxAge;

            var newWeight = new Weight
            {
                UserId = user.Id,
                KeywordWeight = model.KeywordWeight,
                InterestWeight = model.InterestWeight,
                AboutMeWeight = model.AboutMeWeight,
                ValueWeight = model.ValueWeight,
                AgeWeight = model.AgeWeight,
            };
            await _context.Weights.AddAsync(newWeight);


            int index = 0;
            foreach (var file in model.ProfileFiles)
            {
                try
                {
                    var profilePath = await _otherService.UploadImage(file, Path.Combine("Profile", model.Id), index.ToString());
                    await _context.Profile_Users.AddAsync(new Profile_User { UserId = model.Id, ProfileUrl = profilePath });
                    index++;
                }
                catch (Exception error) { Console.WriteLine(error); }

            }


            int[] InterestIds = Array.ConvertAll(model.InterestIds.Split(','), int.Parse);
            int[] AboutMeIds = Array.ConvertAll(model.AboutMeIds.Split(','), int.Parse);
            int[] ValueIds = Array.ConvertAll(model.ValueIds.Split(','), int.Parse);


            try
            {
                foreach (var interestId in InterestIds)
                {
                    await _context.User_Interests.AddAsync(new User_Interest
                    {
                        UserId = model.Id,
                        InterestId = interestId,
                    });
                }

                foreach (var aboutMeId in AboutMeIds)
                {
                    await _context.User_AboutMes.AddAsync(new User_AboutMe
                    {
                        UserId = model.Id,
                        AboutMeId = aboutMeId,
                    });
                }

                foreach (var valueId in ValueIds)
                {
                    await _context.User_Values.AddAsync(new User_Value
                    {
                        UserId = model.Id,
                        ValueId = valueId,
                    });
                }
            }
            catch (Exception error)
            {

            }

            try
            {
                await _context.SaveChangesAsync();

            }
            catch (Exception error) { Console.WriteLine(error); }

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {

                var details = await _otherService.returnDetails(user);
                using (var client = new HttpClient())
                {
                    string url = _configuration["Chatbot:Url"] + "/updateDetails";

                    var requestData = new
                    {
                        userId = user.Id,
                        userDetails = details
                    };

                    string jsonData = JsonConvert.SerializeObject(requestData);
                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        dynamic data = JsonConvert.DeserializeObject(responseBody);


                        return Ok();
                    }
                    else
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        return BadRequest(responseBody);
                    }

                }
            }
            else
            {
                // Create a list of error messages from the result
                var errors = result.Errors.Select(e => e.Description).ToList();
                // Return the error messages as a BadRequest
                return BadRequest(errors);
            }

        }

        [AllowAnonymous]
        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (result.Succeeded)
            {
                user.EmailConfirmed = true;
                var updateResult = await _userManager.UpdateAsync(user);

                if (updateResult.Succeeded)
                {
                    return Ok();
                }
                return BadRequest(updateResult);
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                // Return the error messages as a BadRequest
                return BadRequest(errors);
            }

        }

        [AllowAnonymous]
        [HttpPost("ConfirmEmailStatus")]
        public async Task<IActionResult> ConfirmEmailStatus(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) { return NotFound(); }

            if (user.EmailConfirmed)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }

        [AllowAnonymous]
        [HttpPost("Delete_User")]
        public async Task<IActionResult> Delete_User(string? email, string? id)
        {
            var user = new AppUser();
            if (String.IsNullOrWhiteSpace(email) && String.IsNullOrWhiteSpace(id))
            {
                return BadRequest();
            }
            else if (String.IsNullOrWhiteSpace(id))
            {
                user = await _userManager.FindByEmailAsync(email);

            }
            else
            {
                user = await _userManager.FindByIdAsync(id);

            }

            if (user == null)
            {
                return NotFound();
            }

            var userId = user.Id;
            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                var userInterest = await _context.User_Interests.Where(x => x.UserId == userId).ToListAsync();
                var userValue = await _context.User_Values.Where(x => x.UserId == userId).ToListAsync();
                var userAboutMe = await _context.User_AboutMes.Where(x => x.UserId == userId).ToListAsync();
                var userProfile = await _context.Profile_Users.Where(x => x.UserId == userId).ToListAsync();

                _context.User_Interests.RemoveRange(userInterest);
                _context.User_Values.RemoveRange(userValue);
                _context.User_AboutMes.RemoveRange(userAboutMe);

                foreach (var profile in userProfile)
                {
                    _otherService.DeleteImage(profile.ProfileUrl);

                }
                _context.Profile_Users.RemoveRange(userProfile);
                await _context.SaveChangesAsync();

                return Ok();
            }
            return BadRequest(result);

        }

        [HttpPost("Resend_ConfirmationEmail")]
        public async Task<IActionResult> Resend_ConfirmationEmail()
        {
            var emailClaims = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaims == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaims);
            if (user == null)
            {
                return NotFound();
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            string encodedToken = WebUtility.UrlEncode(token);
            string callbackUrl = $"{_configuration["FrontendSettings:Url"]}/ConfirmEmail?userId={user.Id}&token={encodedToken}";

            var request = new EmailDto
            {
                To = user.Email,
                Subject = "Email Verification",
                Body = "<h1>Please confirm your email address<hi>" +
                $"<h2>{callbackUrl}</h2>"
            };
            await _emailService.SendEmailAsync(request);
            return Ok();
        }


        [HttpGet("getAccountForm")]
        public async Task<IActionResult> getAccountForm()
        {
            var emailClaims = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaims == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaims);
            if (user == null)
            {
                return NotFound();
            }
            AccountFormDto form = new AccountFormDto();
            _mapper.Map(user, form);

            form.InterestIds = await _context.User_Interests.Where(x => x.UserId == user.Id).Select(x => x.InterestId).ToListAsync();
            form.ValueIds = await _context.User_Values.Where(x => x.UserId == user.Id).Select(x => x.ValueId).ToListAsync();
            form.AboutMeIds = await _context.User_AboutMes.Where(x => x.UserId == user.Id).Select(x => x.AboutMeId).ToListAsync();
            form.DateOfBirth = user.Date_of_birth.HasValue ? user.Date_of_birth.Value : new DateTime();

            var existWeight = await _context.Weights.FirstOrDefaultAsync(x => x.UserId == user.Id);
            if (existWeight != null)
            {
                form.KeywordWeight = existWeight.KeywordWeight;
                form.InterestWeight = existWeight.InterestWeight;
                form.AboutMeWeight = existWeight.AboutMeWeight;
                form.ValueWeight = existWeight.ValueWeight;
                form.AgeWeight = existWeight.AgeWeight;
            }

            return Ok(form);
        }

        [HttpGet("getAccountFormProfile")]
        public async Task<IActionResult> getAllProfileImgs()
        {
            var emailClaims = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaims == null)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByEmailAsync(emailClaims);
            if (user == null)
            {
                return NotFound();
            }

            var paths = await _context.Profile_Users.Where(x => x.UserId == user.Id).Select(x => x.ProfileUrl).ToListAsync();
            try
            {

                var files = new List<object>();

                foreach (var path in paths)
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                    string base64File = Convert.ToBase64String(fileBytes);
                    files.Add(new { FileName = Path.GetFileName(path), Content = base64File });
                }


                return Ok(files);

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpPost("EditAccountForm")]
        public async Task<IActionResult> EditAccountForm([FromForm] AccountForm model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (model.Email != null && model.NewPassword != null && model.ConfirmPassword != null)
            {
                if (model.NewPassword != model.ConfirmPassword)
                {
                    ModelState.AddModelError("confirmPassword", "Confirm password does not match");
                    return BadRequest(ModelState);
                }
                var currentUser = await _userManager.FindByIdAsync(model.Id);
                var existEmail = await _userManager.FindByEmailAsync(model.Email);
                if (currentUser.Email.Trim() != model.Email.Trim() && existEmail != null)
                {
                    ModelState.AddModelError("email", "Email taken");
                    return BadRequest(ModelState);
                }
                string passwordPattern = "^(?=.*\\d)(?=.*[A-Z]).{6,}$";
                bool isPasswordInvalid = !Regex.IsMatch(model.NewPassword, passwordPattern);
                if (isPasswordInvalid)
                {
                    return BadRequest(ModelState);
                }
                var user1 = await _userManager.FindByIdAsync(model.Id);
                user1.Email = model.Email;
                var changePasswordResult = await _userManager.ChangePasswordAsync(user1, model.OldPassword, model.NewPassword);
                if (!changePasswordResult.Succeeded)
                {
                    foreach (var error in changePasswordResult.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    return BadRequest(ModelState);
                }
                var result1 = await _userManager.UpdateAsync(user1);
                if (!result1.Succeeded)
                {
                    foreach (var error in result1.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    return BadRequest(ModelState);
                }
                _context.SaveChanges();
            }

            var user = await _userManager.FindByIdAsync(model.Id);
            
            user.ShowMeMinAge = model.ShowMeMinAge;
            user.ShowMeMaxAge = model.ShowMeMaxAge;
            user.Bio = model.Bio;
            user.Name = model.Name;
            user.Date_of_birth = model.DateOfBirth;
            user.Gender = model.Gender;
            user.ShowMe = model.ShowMe;
            user.UpdateAt = DateTime.UtcNow;

            var existWeight = await _context.Weights.FirstOrDefaultAsync(x=>x.UserId==user.Id);
            
            if(existWeight != null)
            {
                existWeight.KeywordWeight = model.KeywordWeight;
                existWeight.InterestWeight = model.InterestWeight;
                existWeight.AboutMeWeight = model.AboutMeWeight;
                existWeight.ValueWeight = model.ValueWeight;
                existWeight.AgeWeight = model.AgeWeight;
                existWeight.UserId = user.Id;
                _context.Weights.Update(existWeight);
            }
            else
            {
                var newWeight = new Weight
                {
                    UserId = user.Id,
                    KeywordWeight = model.KeywordWeight,
                    InterestWeight = model.InterestWeight,
                    AboutMeWeight = model.AboutMeWeight,
                    ValueWeight = model.ValueWeight,
                    AgeWeight = model.AgeWeight,
                };
                await _context.Weights.AddAsync(newWeight);
            }
            
            int index = 0;
            var existProfiles = await _context.Profile_Users.Where(x => x.UserId == user.Id).ToListAsync();

            _otherService.DeleteImages(existProfiles.Select(x => x.ProfileUrl).ToList());
            _context.Profile_Users.RemoveRange(existProfiles);
            foreach (var file in model.NewProfileFiles)
            {
                try
                {

                    var profilePath = await _otherService.UploadImage(file, Path.Combine("Profile", model.Id), index.ToString());
                    await _context.Profile_Users.AddAsync(new Profile_User { UserId = model.Id, ProfileUrl = profilePath });
                    index++;
                }
                catch (Exception error) { Console.WriteLine(error); }

            }


            var toBeDel_interest = await _context.User_Interests.Where(x => x.UserId == user.Id).ToListAsync();
            var toBeDel_about = await _context.User_AboutMes.Where(x => x.UserId == user.Id).ToListAsync();
            var toBeDel_value = await _context.User_Values.Where(x => x.UserId == user.Id).ToListAsync();
            _context.User_Interests.RemoveRange(toBeDel_interest);
            _context.User_AboutMes.RemoveRange(toBeDel_about);
            _context.User_Values.RemoveRange(toBeDel_value);


            int[] InterestIds = Array.ConvertAll(model.InterestIds.Split(','), int.Parse);
            int[] AboutMeIds = Array.ConvertAll(model.AboutMeIds.Split(','), int.Parse);
            int[] ValueIds = Array.ConvertAll(model.ValueIds.Split(','), int.Parse);


            try
            {

                foreach (var interestId in InterestIds)
                {
                    await _context.User_Interests.AddAsync(new User_Interest
                    {
                        UserId = model.Id,
                        InterestId = interestId,
                    });
                }

                foreach (var aboutMeId in AboutMeIds)
                {
                    await _context.User_AboutMes.AddAsync(new User_AboutMe
                    {
                        UserId = model.Id,
                        AboutMeId = aboutMeId,
                    });
                }

                foreach (var valueId in ValueIds)
                {
                    await _context.User_Values.AddAsync(new User_Value
                    {
                        UserId = model.Id,
                        ValueId = valueId,
                    });
                }
            }
            catch (Exception error)
            {

            }

            try
            {
                await _context.SaveChangesAsync();

            }
            catch (Exception error) { Console.WriteLine(error); }

            var result = await _userManager.UpdateAsync(user);
            _context.SaveChanges();
           
            if (result.Succeeded)
            {
                var contents = await _otherService.getUserProfileBytes(user.Id);
                var details = await _otherService.returnDetails(user);
                using (var client = new HttpClient())
                {
                    string url = _configuration["Chatbot:Url"] + "/updateDetails";

                    var requestData = new
                    {
                        userId = user.Id,
                        userDetails = details,
                        profileByteList = contents,
                    };

                    string jsonData = JsonConvert.SerializeObject(requestData);
                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        dynamic data = JsonConvert.DeserializeObject(responseBody);


                        return Ok();
                    }
                    else
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        return BadRequest(responseBody);
                    }

                }
            }
            else
            {
                // Create a list of error messages from the result
                var errors = result.Errors.Select(e => e.Description).ToList();
                // Return the error messages as a BadRequest
                return BadRequest(errors);
            }
        }
    }

}

