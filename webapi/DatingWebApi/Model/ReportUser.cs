namespace DatingWebApi.Model
{
    public class ReportUser
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Description { get; set; }
    }
}
