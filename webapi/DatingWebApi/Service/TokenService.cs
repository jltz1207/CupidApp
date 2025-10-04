using DatingWebApi.Model;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DatingWebApi.Service
{
    public static class TokenService
    {

        public async static Task<string> CreateToken(AppUser user, UserManager<AppUser> userManager, IConfiguration _config)
        {
            try
            {
                var role = await userManager.GetRolesAsync(user);
                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),

            };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Audience"],
              claims,
              expires: DateTime.Now.AddDays(15),
              signingCredentials: creds);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async static Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string idToken)
        {
            try
            {
                // This will throw an exception if the token is invalid
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    // Specify the expected audience (Client ID)
                    Audience = new List<string>() { "552266780451-8jisepinrk0l7b0oesifek1lsdn9aou1.apps.googleusercontent.com" }
                };

                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                return payload;
            }
            catch (InvalidJwtException ex)
            {
                // The token is invalid for some reason
                Console.WriteLine("Invalid JWT", ex);
                return null;
            }
            catch (Exception ex)
            {
                // Other errors
                Console.WriteLine("Token validation error", ex);
                return null;
            }
        }
    }
}
