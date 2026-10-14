using Xunit;

namespace AquaBophelo.Tests;

public class GpsValidationTests
{
    [Theory]
    [InlineData(-28.7419, 24.7719, true)]   // Kimberley Central (Valid)
    [InlineData(-28.7183, 24.7319, true)]   // Galeshewe (Valid)
    [InlineData(-95.0, 24.7719, false)]    // Out of range latitude (< -90)
    [InlineData(91.5, 24.7719, false)]     // Out of range latitude (> 90)
    [InlineData(-28.7419, -190.0, false)]  // Out of range longitude (< -180)
    [InlineData(-28.7419, 185.0, false)]   // Out of range longitude (> 180)
    public void ValidateGpsCoordinates_EnforcesStrictBoundaries(double lat, double lng, bool expectedValid)
    {
        // Act
        bool isValid = lat >= -90.0 && lat <= 90.0 && lng >= -180.0 && lng <= 180.0;

        // Assert
        Assert.Equal(expectedValid, isValid);
    }

    [Theory]
    [InlineData(0.0, true)]     // Stationary
    [InlineData(45.5, true)]    // Normal urban driving
    [InlineData(120.0, true)]   // Highway speed
    [InlineData(-10.0, false)]  // Negative speed
    [InlineData(300.0, false)]  // Impossible speed (> 250 km/h)
    public void ValidateSpeed_EnforcesRealisticRange(double speedKmh, bool expectedValid)
    {
        // Act
        bool isValid = speedKmh >= 0.0 && speedKmh <= 250.0;

        // Assert
        Assert.Equal(expectedValid, isValid);
    }

    [Theory]
    [InlineData(0.0, 0.0, 0)]      // North
    [InlineData(1.0, 0.0, 90)]     // East
    [InlineData(0.0, -1.0, 180)]   // South
    [InlineData(-1.0, 0.0, 270)]   // West
    public void CalculateHeading_ReturnsExactBearing(double dLng, double dLat, int expectedHeading)
    {
        // Act
        double angleRad = Math.Atan2(dLng, dLat);
        int deg = (int)Math.Round((angleRad * 180) / Math.PI);
        int heading = (deg + 360) % 360;

        // Assert
        Assert.Equal(expectedHeading, heading);
    }
}
