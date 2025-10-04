using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Form.Account
{
    public class LoginModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }

    public class RegisterModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string RePassword { get; set; }
    }

    public class Reg_GoogleModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }

      
    }

    public class ProfileModel
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateTime DateOfBirth { get; set; }

        public bool Gender { get; set; }

       
        public int ShowMe { get; set; }

        public IFormFile[] ProfileFiles { get; set; }
       
        public string InterestIds { get; set; }
        public string AboutMeIds { get; set; }
        public string ValueIds { get; set; }

        public string? LookingFor { get; set; }
        public string? OtherDetails { get; set; }

        public string? Bio { get; set; }

        public int ShowMeMinAge { get; set; }
        public int ShowMeMaxAge { get; set; }



        public int KeywordWeight { get; set; }
        public int InterestWeight { get; set; }
        public int AboutMeWeight { get; set; }
        public int ValueWeight { get; set; }
        public int AgeWeight { get; set; }
    }


    public class EmailConfirmModel 
    { 
        [Required]
        public string Id { get; set; }

        [Required]
        public string Token { get; set; }
    }

}
