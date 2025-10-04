using DatingWebApi.Data;
using DatingWebApi.Model;
using Microsoft.AspNetCore.Identity;
using System.Data;

namespace DatingWebApi.Service
{
    public class SeedData
    {
        public static async Task initializeData(ApplicationDbContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var RoleList = new List<string>
                {
                    "Admin", "User"
                };

                foreach (var role in RoleList)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }

            if (!userManager.Users.Any())
            {
                var userList = new List<AppUser>
                {
                    new AppUser{UserName = "Jason", Email="jason@test.com", Gender=true},
                    new AppUser{UserName = "Ada", Email="ada@test.com", Gender=false}
                };

                foreach (var user in userList)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }
        }
    }
}
