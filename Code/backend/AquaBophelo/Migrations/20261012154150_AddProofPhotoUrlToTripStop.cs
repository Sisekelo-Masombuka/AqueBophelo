using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AquaBophelo.Migrations
{
    /// <inheritdoc />
    public partial class AddProofPhotoUrlToTripStop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProofPhotoUrl",
                table: "TripStops",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProofPhotoUrl",
                table: "TripStops");
        }
    }
}
