namespace DatingWebApi.Model
{
    public class UserLike
    {
        public DateTime? Timestamp { get; set; }
        public string LikeUserId{ get; set; }
        public string LikedUserId{ get; set; }
        
    }
}
