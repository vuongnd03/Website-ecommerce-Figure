using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace APIbackend.Data
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var mail = new MailMessage();
            mail.From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName);
            mail.To.Add(toEmail);
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = false;
            using (var smtp = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port))
            {
                smtp.Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.Password);
                smtp.EnableSsl = true;
                await smtp.SendMailAsync(mail);
            }
        }
    }
}
