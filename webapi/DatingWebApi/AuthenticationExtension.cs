using DatingWebApi.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace DatingWebApi
{
    public static class AuthenticationExtension
    {
        public static IServiceCollection AddAuthServices(this IServiceCollection Services, IConfiguration config)
        {

           

            return Services;
        }
    }
}
