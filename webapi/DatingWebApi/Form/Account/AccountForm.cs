using Microsoft.AspNetCore.Mvc;

namespace DatingWebApi.Form.Account
{
    public class AccountFormDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateTime DateOfBirth { get; set; }

        public bool Gender { get; set; }


        public int ShowMe { get; set; }
      
        public List<int> InterestIds { get; set; }
        public List<int> AboutMeIds { get; set; }
        public List<int> ValueIds { get; set; }

        public string Bio { get; set; }

        public string Email { get; set; }
        public int? ShowMeMinAge { get; set; }
        public int? ShowMeMaxAge { get; set; }

        public int? KeywordWeight { get; set; }
        public int? InterestWeight { get; set; }
        public int? AboutMeWeight { get; set; }
        public int? ValueWeight { get; set; }
        public int? AgeWeight { get; set; }

    }


    public class AccountForm
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateTime DateOfBirth { get; set; }

        public bool Gender { get; set; }


        public int ShowMe { get; set; }

        public List<IFormFile>? NewProfileFiles { get; set; }

        public string InterestIds { get; set; }
        public string AboutMeIds { get; set; }
        public string ValueIds { get; set; }

        public string Bio { get; set; }

        public string? Email { get; set; }
        public string? OldPassword { get; set; }

        public string? NewPassword { get; set; }
        public string? ConfirmPassword { get; set; }

        public int ShowMeMinAge { get; set; }
        public int ShowMeMaxAge { get; set; }


        public int KeywordWeight { get; set; }
        public int InterestWeight { get; set; }
        public int AboutMeWeight { get; set; }
        public int ValueWeight { get; set; }
        public int AgeWeight { get; set; }

        
    }

}
