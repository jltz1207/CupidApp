namespace DatingWebApi.Model
{
    public class Match
    {
        public DateTime Timestamp { get; set; }
        public string UserId1 { get; set; }
        public string UserId2 { get; set; }
        public Guid RoomId { get; set;}
    }
}
