using DatingWebApi.Dto.Account;
using DatingWebApi.Model;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace DatingWebApi.Dto.Chatroom
{
    public class ChatroomDto
    {
        public string ReceiverId { get; set; }
        public Guid RoomId { get; set; }
        public UserDto_Detailed Profile { get; set; }
        public List<GroupedMessage> GroupedMessages { get; set; }
        public DateTime LastMessage_Timestamp { get; set; }

    }
}
