using System.Net;
using System.Net.Mail;
using JadeWesserPort.Configuration;
using JadeWesserPort.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace JadeWesserPort.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
    {
        _emailSettings = emailSettings.Value;
        _logger = logger;
    }

    public async Task SendActivationEmailAsync(string toEmail, string activationToken, string roleName)
    {
        var activationUrl = $"{_emailSettings.FrontendBaseUrl}/activate?token={activationToken}";
        
        var subject = "Activate Your JadeWeserPort Account";
        var htmlBody = GenerateActivationEmailTemplate(toEmail, activationUrl, roleName);

        await SendEmailAsync(toEmail, subject, htmlBody);
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        try
        {
            using var smtpClient = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
            {
                Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
            
            _logger.LogInformation("Email sent successfully to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            throw;
        }
    }

    private string GenerateActivationEmailTemplate(string email, string activationUrl, string roleName)
    {
        var roleDisplayName = roleName switch
        {
            "PortAuthorityOfficer" => "Port Authority Officer",
            "LogisticsOperator" => "Logistics Operator",
            "ShippingAgentRepresentative" => "Shipping Agent Representative",
            "SystemAdmin" => "System Administrator",
            _ => roleName
        };

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
</head>
<body style=""margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;"">
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #f4f4f4; padding: 20px;"">
        <tr>
            <td align=""center"">
                <table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"">
                    
                    <!-- Header -->
                    <tr>
                        <td style=""background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 40px 30px; text-align: center;"">
                            <h1 style=""color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;"">
                                🚢 JadeWeserPort
                            </h1>
                            <p style=""color: #e3f2fd; margin: 10px 0 0 0; font-size: 14px;"">
                                Port Management System
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style=""padding: 40px 30px;"">
                            <h2 style=""color: #333333; margin: 0 0 20px 0; font-size: 24px;"">
                                Welcome to JadeWeserPort! 👋
                            </h2>
                            
                            <p style=""color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;"">
                                Your account has been created with the role of <strong style=""color: #1976d2;"">{roleDisplayName}</strong>.
                            </p>

                            <p style=""color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;"">
                                To activate your account and complete the registration process, please click the button below:
                            </p>

                            <!-- Activation Button -->
                            <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
                                <tr>
                                    <td align=""center"" style=""padding: 0 0 30px 0;"">
                                        <a href=""{activationUrl}"" 
                                           style=""display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(25, 118, 210, 0.3);"">
                                            Activate Account
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <div style=""background-color: #f5f5f5; border-left: 4px solid #1976d2; padding: 15px; margin: 0 0 30px 0; border-radius: 4px;"">
                                <p style=""color: #666666; font-size: 14px; margin: 0 0 10px 0;"">
                                    If the button doesn't work, copy and paste this link into your browser:
                                </p>
                                <p style=""color: #1976d2; font-size: 14px; margin: 0; word-break: break-all;"">
                                    {activationUrl}
                                </p>
                            </div>

                            <!-- Security Notice -->
                            <div style=""background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 0 0 20px 0; border-radius: 4px;"">
                                <p style=""color: #e65100; font-size: 14px; margin: 0; font-weight: bold;"">
                                    ⚠️ Security Notice
                                </p>
                                <p style=""color: #666666; font-size: 14px; margin: 10px 0 0 0; line-height: 1.5;"">
                                    This activation link will expire in <strong>24 hours</strong>. If you didn't request this account, please ignore this email.
                                </p>
                            </div>

                            <!-- Account Details -->
                            <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""border: 1px solid #e0e0e0; border-radius: 4px;"">
                                <tr>
                                    <td style=""padding: 15px; background-color: #fafafa; border-bottom: 1px solid #e0e0e0;"">
                                        <strong style=""color: #333333; font-size: 14px;"">Account Details:</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style=""padding: 15px;"">
                                        <table width=""100%"" cellpadding=""5"" cellspacing=""0"">
                                            <tr>
                                                <td style=""color: #999999; font-size: 14px; width: 120px;"">Email:</td>
                                                <td style=""color: #333333; font-size: 14px; font-weight: bold;"">{email}</td>
                                            </tr>
                                            <tr>
                                                <td style=""color: #999999; font-size: 14px;"">Role:</td>
                                                <td style=""color: #1976d2; font-size: 14px; font-weight: bold;"">{roleDisplayName}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f5f5f5; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;"">
                            <p style=""color: #999999; font-size: 14px; margin: 0 0 10px 0;"">
                                This is an automated message from JadeWeserPort System.
                            </p>
                            <p style=""color: #999999; font-size: 12px; margin: 0;"">
                                © 2025 JadeWeserPort. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }
}