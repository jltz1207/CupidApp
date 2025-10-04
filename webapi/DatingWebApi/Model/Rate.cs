using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class Rate
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int RateCategoryId { get; set; }

        public int Marks { get; set; }

        public string? Reason { get; set; }

        public string UserId { get; set; }
        public DateTime timeStamp { get; set; }


    }
}
