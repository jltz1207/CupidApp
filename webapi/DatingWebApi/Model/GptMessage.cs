using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class GptMessage
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        public string Content { get; set; }
        public DateTime Send_TimeStamp { get; set; }
        public int GptRoleId { get; set; }
        public int CategoryId { get; set; }
    }

}
