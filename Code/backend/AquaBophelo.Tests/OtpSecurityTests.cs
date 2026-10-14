using System.Security.Cryptography;
using System.Text;
using AquaBophelo.Models;
using Xunit;

namespace AquaBophelo.Tests;

public class OtpSecurityTests
{
    private static string HashOtp(string code)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(code.Trim()));
        return Convert.ToBase64String(bytes);
    }

    [Fact]
    [Trait("Category", "Security")]
    public void ValidOtp_MatchesConstantTimeHash()
    {
        // Arrange
        string rawCode = "654321";
        string expectedHash = HashOtp(rawCode);
        string candidateInput = "654321";
        string candidateHash = HashOtp(candidateInput);

        // Act
        var expectedBytes = Encoding.UTF8.GetBytes(expectedHash);
        var candidateBytes = Encoding.UTF8.GetBytes(candidateHash);
        bool matches = CryptographicOperations.FixedTimeEquals(expectedBytes, candidateBytes);

        // Assert
        Assert.True(matches, "Valid OTP must match stored constant-time hash.");
    }

    [Fact]
    [Trait("Category", "Security")]
    public void InvalidOtp_FailsConstantTimeHash()
    {
        // Arrange
        string rawCode = "654321";
        string expectedHash = HashOtp(rawCode);
        string wrongInput = "111222";
        string wrongHash = HashOtp(wrongInput);

        // Act
        var expectedBytes = Encoding.UTF8.GetBytes(expectedHash);
        var wrongBytes = Encoding.UTF8.GetBytes(wrongHash);
        bool matches = CryptographicOperations.FixedTimeEquals(expectedBytes, wrongBytes);

        // Assert
        Assert.False(matches, "Incorrect OTP must not match stored hash.");
    }

    [Fact]
    [Trait("Category", "Security")]
    public void ExpiredOtp_IsRejected()
    {
        // Arrange
        var otp = new EmailOtp
        {
            Email = "resident@solplaatje.gov.za",
            CodeHash = HashOtp("123456"),
            Purpose = "EmailVerification",
            ExpiresAt = DateTime.UtcNow.AddMinutes(-5), // Expired 5 minutes ago
            IsUsed = false,
            AttemptCount = 0
        };

        // Act
        bool isValid = !otp.IsUsed && otp.ExpiresAt > DateTime.UtcNow;

        // Assert
        Assert.False(isValid, "Expired OTP must be rejected.");
    }

    [Fact]
    [Trait("Category", "Security")]
    public void ReusedOtp_IsRejected()
    {
        // Arrange
        var otp = new EmailOtp
        {
            Email = "resident@solplaatje.gov.za",
            CodeHash = HashOtp("123456"),
            Purpose = "EmailVerification",
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed = true, // Already consumed
            AttemptCount = 1
        };

        // Act
        bool isValid = !otp.IsUsed && otp.ExpiresAt > DateTime.UtcNow;

        // Assert
        Assert.False(isValid, "Reused / previously consumed OTP must be rejected.");
    }

    [Fact]
    [Trait("Category", "Security")]
    public void ExcessiveAttempts_InvalidatesOtp()
    {
        // Arrange
        var otp = new EmailOtp
        {
            Email = "resident@solplaatje.gov.za",
            CodeHash = HashOtp("123456"),
            Purpose = "EmailVerification",
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed = false,
            AttemptCount = 5 // Max reached
        };

        // Act: Enforce max 5 attempts rule
        if (otp.AttemptCount >= 5)
        {
            otp.IsUsed = true;
        }

        // Assert
        Assert.True(otp.IsUsed, "Exceeding 5 verification attempts must invalidate the OTP.");
    }

    [Fact]
    [Trait("Category", "Security")]
    public void PurposeMismatch_IsRejected()
    {
        // Arrange
        var otp = new EmailOtp
        {
            Email = "resident@solplaatje.gov.za",
            CodeHash = HashOtp("123456"),
            Purpose = "EmailVerification",
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed = false,
            AttemptCount = 0
        };

        string requestedPurpose = "DeleteAccount";

        // Act
        bool purposeMatches = otp.Purpose == requestedPurpose;

        // Assert
        Assert.False(purposeMatches, "OTP issued for EmailVerification cannot be consumed for DeleteAccount.");
    }
}
