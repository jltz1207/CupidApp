using DatingWebApi.Data;
using DatingWebApi.Model;
using DatingWebApi.Service;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DatingWebApi.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        private readonly OtherService _otherservice;


        public ChatHub(OtherService otherservice, ApplicationDbContext context)
        {
            _context = context;
            _otherservice = otherservice;
        }
        public async Task JoinChat(UserConnection conn)
        {
            await Clients.All.SendAsync("ReceiveMessage", "admin", $"{conn.UserId} joined the Chat");
        }

        public async Task JoinChatRoom(UserConnection conn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.RoomId);
            await Clients.Group(conn.RoomId).SendAsync("ReceiveMessage", "admin", $"{conn.UserId} joined the Chatroom {conn.RoomId}");
        }

        public async Task SendMessage(UserConnection conn, string message, string receiverId, int key)
        {
            DateTime hktTime = _otherservice.getHKTime();

            var msg = new Message
            {
                SenderId = conn.UserId,
                ReceiverId = receiverId,
                RoomId = new Guid(conn.RoomId),
                Content = message,
                Send_TimeStamp = hktTime,
            };


            _context.Messages.Add(msg);

            await _context.SaveChangesAsync();

            await Clients.Group(conn.RoomId).SendAsync("ReceiveMessage", msg.Id, key, conn.UserId, conn.RoomId, message);
        }


        public async Task ReadMessages(UserConnection conn, int[] messageId, DateTime hkt)
        {
            // DateTime hkt = _otherservice.getHKTime();
            foreach (int msgId in messageId)
            {
                var msg = await _context.Messages.FindAsync(msgId);
                msg.Read_TimeStamp = hkt;
            }
            await _context.SaveChangesAsync();

            await Clients.OthersInGroup(conn.RoomId).SendAsync("MessagesRead", messageId, hkt);
        }

        public async Task ReadMessage(UserConnection conn, int messageId, DateTime hkt)
        {
            // DateTime hkt = _otherservice.getHKTime();

            var msg = await _context.Messages.FindAsync(messageId);
            msg.Read_TimeStamp = hkt;

            await _context.SaveChangesAsync();

            await Clients.OthersInGroup(conn.RoomId).SendAsync("MessageRead", messageId, hkt);
        }
    }
}

