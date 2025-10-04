namespace DatingWebApi.Form
{
    public class KeywordForm
    {
        public int CategoryId { get; set; }
        public string Passage { get; set; }
        public string UserId { get; set; }
    }

    public class TestUserForm
    {
        public IFormFile[] ProfileFiles { get; set; }
        public int Sex { get; set; }
    }
}
