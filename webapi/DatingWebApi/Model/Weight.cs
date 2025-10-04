using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class Weight
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public int KeywordWeight { get; set; }
        public int InterestWeight { get; set; }
        public int AboutMeWeight { get; set; }
        public int ValueWeight { get; set; }
        public int AgeWeight { get; set; }
    }
}
