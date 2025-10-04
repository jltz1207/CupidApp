using Microsoft.AspNetCore.Identity;

namespace DatingWebApi.Model
{
    public class AppUser:IdentityUser
    {
        
        public bool ProfileFilled { get; set; } = false;
        public bool EmailConfirmed { get; set; } = false;
        public DateTime? Date_of_birth { get; set; }
        public bool? Gender { get; set; }
        public string? Name { get; set; }
        public int? ShowMe { get; set; }

        public int? ShowMeMinAge { get; set; }
        public int? ShowMeMaxAge { get; set; }

        public string? Bio { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

    }
}
