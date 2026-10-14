using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AquaBophelo.Migrations
{
    /// <inheritdoc />
    public partial class AddDriverFeaturesModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "TripStops",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryLocation",
                table: "TripStops",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeliveryStartedAt",
                table: "TripStops",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "LitresDelivered",
                table: "TripStops",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "TripStops",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StopStatus",
                table: "TripStops",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "DriverProblems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripId = table.Column<int>(type: "int", nullable: true),
                    StopId = table.Column<int>(type: "int", nullable: true),
                    DriverId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DriverName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleRegistration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReportedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DriverProblems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VehicleInspectionChecks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DriverId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DriverName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TruckId = table.Column<int>(type: "int", nullable: true),
                    VehicleRegistration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrakesOk = table.Column<bool>(type: "bit", nullable: false),
                    TiresOk = table.Column<bool>(type: "bit", nullable: false),
                    WaterSealOk = table.Column<bool>(type: "bit", nullable: false),
                    LightsOk = table.Column<bool>(type: "bit", nullable: false),
                    OverallStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InspectedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleInspectionChecks", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DriverProblems");

            migrationBuilder.DropTable(
                name: "VehicleInspectionChecks");

            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "DeliveryLocation",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "DeliveryStartedAt",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "LitresDelivered",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "StopStatus",
                table: "TripStops");
        }
    }
}
