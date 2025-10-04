namespace DatingWebApi.Dto.Account
{
    public class UserDto
    {
        public string Id { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool ProfileFilled { get; set; }
        public string Token { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? IconSrc { get; set; }
        public List<Guid>? RoomIds { get; set; }

    }
}
