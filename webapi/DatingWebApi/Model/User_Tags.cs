using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class User_Interest
    {
        
        public string UserId { get; set; }
        public int InterestId { get; set; }
    }

    public class User_AboutMe
    {
        public string UserId { get; set; }
        public int AboutMeId { get; set; }
    }

    public class User_Value
    {
        public string UserId { get; set; }
        public int ValueId { get; set; }
    }
}
