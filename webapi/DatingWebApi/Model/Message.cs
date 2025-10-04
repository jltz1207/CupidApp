using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class Message
    {

        [Key]
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public Guid RoomId { get; set; }
        public string Content { get; set; }
        public DateTime Send_TimeStamp { get; set; }
        public DateTime? Read_TimeStamp { get; set; } = null;

    }

    public class GroupedMessage
    {
        public DateTime Date { get; set; }
        public List<Message> Messages { get; set; } 
    }
}
