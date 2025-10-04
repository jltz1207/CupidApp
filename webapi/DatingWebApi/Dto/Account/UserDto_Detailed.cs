namespace DatingWebApi.Dto.Account
{
    public class UserDto_Detailed
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; } //not sure
        public int Age { get; set; }
        public bool? Gender { get; set; }
        public string Bio { get; set; }
        public List<string> ProfileFiles { get; set; }

        public List<string> Interests { get; set; }
        public List<string> AboutMes { get; set; }
        public List<string> Values { get; set; }
    }
}
