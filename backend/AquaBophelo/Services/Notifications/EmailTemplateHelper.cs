using System.Net;

namespace AquaBophelo.Services.Notifications;

public static class EmailTemplateHelper
{
    public static string BuildOtpTemplate(string recipientName, string otpCode, string purpose, int expiryMinutes = 10)
    {
        string title = purpose switch
        {
            "PasswordReset" => "Password Reset Request",
            "DeleteAccount" => "Account Deletion Verification",
            _ => "Email Address Verification"
        };

        string actionDescription = purpose switch
        {
            "PasswordReset" => "Use the 6-digit verification code below to reset your AquaBophelo account password.",
            "DeleteAccount" => "Use the 6-digit verification code below to authorize your permanent account deletion.",
            _ => "Thank you for registering with AquaBophelo. Use the 6-digit verification code below to verify your email address."
        };

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f223d; }}
        .card {{ max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ border-bottom: 3px solid #2e7d32; padding-bottom: 16px; margin-bottom: 24px; }}
        .title {{ color: #152e52; font-size: 20px; font-weight: 700; margin: 0; }}
        .subtitle {{ color: #1d70b8; font-size: 13px; font-weight: 600; margin-top: 4px; }}
        .otp-box {{ background: #eaf4fb; border: 1px solid #bcd6ea; border-radius: 6px; padding: 20px; text-align: center; margin: 24px 0; }}
        .otp-code {{ font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #152e52; margin: 0; font-family: monospace; }}
        .expiry {{ font-size: 12px; color: #64748b; margin-top: 8px; }}
        .footer {{ border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center; }}
    </style>
</head>
<body>
    <div class='card'>
        <div class='header'>
            <h1 class='title'>Sol Plaatje Local Municipality</h1>
            <div class='subtitle'>AquaBophelo Water Portal &bull; {title}</div>
        </div>
        <p>Hello <strong>{HtmlEncode(recipientName)}</strong>,</p>
        <p>{actionDescription}</p>
        <div class='otp-box'>
            <div class='otp-code'>{otpCode}</div>
            <div class='expiry'>This code expires in <strong>{expiryMinutes} minutes</strong> and is single-use.</div>
        </div>
        <p style='font-size: 12px; color: #64748b;'>If you did not request this code, please ignore this message or contact municipal support if you suspect unauthorized access.</p>
        <div class='footer'>
            Sol Plaatje Municipality &bull; Kimberley, Northern Cape, South Africa<br/>
            <em>Elke druppel tel &bull; Metsi ke bophelo</em>
        </div>
    </div>
</body>
</html>";
    }

    private static string HtmlEncode(string value) => WebUtility.HtmlEncode(value ?? string.Empty);
}
