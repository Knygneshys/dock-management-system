namespace JadeWesserPort.Services.Interfaces;

public interface IEmailService
{
    Task SendActivationEmailAsync(string toEmail, string activationToken, string roleName);
    Task SendEmailAsync(string toEmail, string subject, string htmlBody);
}