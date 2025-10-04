using DatingWebApi.Dto.Email;

namespace DatingWebApi.Service.EmailService
{
    public interface IEmailService
    {
        Task SendEmailAsync (EmailDto request);
    }
}
