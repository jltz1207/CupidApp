using DatingWebApi.Dto.Email;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace DatingWebApi.Service.EmailService
{
    public class EmailService : IEmailService
    {
        private IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(EmailDto request)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configuration["Email:Username"]));
                email.To.Add(MailboxAddress.Parse(request.To));
                email.Subject = request.Subject;
                email.Body = new TextPart(TextFormat.Html) { Text = request.Body };

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_configuration["Email:Host"], 465, bool.Parse(_configuration["Email:EnableSSL"]));
                await smtp.AuthenticateAsync(_configuration["Email:Username"], _configuration["Email:Password"]);
                Console.Write(email.ToString());
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

         

        }
    }
}
