using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AquaBophelo.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TruckLocations_TripId",
                table: "TruckLocations");

            migrationBuilder.DropIndex(
                name: "IX_TruckLocations_TruckId",
                table: "TruckLocations");

            migrationBuilder.DropIndex(
                name: "IX_NotificationLogs_UserId",
                table: "NotificationLogs");

            migrationBuilder.DropIndex(
                name: "IX_DamReadings_DamId",
                table: "DamReadings");

            migrationBuilder.DropIndex(
                name: "IX_Alerts_AreaId",
                table: "Alerts");

            migrationBuilder.DropIndex(
                name: "IX_Alerts_DamId",
                table: "Alerts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "IssueReports",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "IssueReports",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Purpose",
                table: "EmailOtps",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "EmailOtps",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_TruckLocations_TripId_RecordedAt",
                table: "TruckLocations",
                columns: new[] { "TripId", "RecordedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_TruckLocations_TruckId_RecordedAt",
                table: "TruckLocations",
                columns: new[] { "TruckId", "RecordedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationLogs_UserId_SentAt",
                table: "NotificationLogs",
                columns: new[] { "UserId", "SentAt" });

            migrationBuilder.CreateIndex(
                name: "IX_IssueReports_Status_CreatedAt",
                table: "IssueReports",
                columns: new[] { "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_IssueReports_UserId_CreatedAt",
                table: "IssueReports",
                columns: new[] { "UserId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_EmailOtps_Email_Purpose_CreatedAt",
                table: "EmailOtps",
                columns: new[] { "Email", "Purpose", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_DamReadings_DamId_RecordedAt",
                table: "DamReadings",
                columns: new[] { "DamId", "RecordedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Category_TimestampUtc",
                table: "AuditLogs",
                columns: new[] { "Category", "TimestampUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_AreaId_CreatedAt",
                table: "Alerts",
                columns: new[] { "AreaId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_DamId_CreatedAt",
                table: "Alerts",
                columns: new[] { "DamId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TruckLocations_TripId_RecordedAt",
                table: "TruckLocations");

            migrationBuilder.DropIndex(
                name: "IX_TruckLocations_TruckId_RecordedAt",
                table: "TruckLocations");

            migrationBuilder.DropIndex(
                name: "IX_NotificationLogs_UserId_SentAt",
                table: "NotificationLogs");

            migrationBuilder.DropIndex(
                name: "IX_IssueReports_Status_CreatedAt",
                table: "IssueReports");

            migrationBuilder.DropIndex(
                name: "IX_IssueReports_UserId_CreatedAt",
                table: "IssueReports");

            migrationBuilder.DropIndex(
                name: "IX_EmailOtps_Email_Purpose_CreatedAt",
                table: "EmailOtps");

            migrationBuilder.DropIndex(
                name: "IX_DamReadings_DamId_RecordedAt",
                table: "DamReadings");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_Category_TimestampUtc",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_Alerts_AreaId_CreatedAt",
                table: "Alerts");

            migrationBuilder.DropIndex(
                name: "IX_Alerts_DamId_CreatedAt",
                table: "Alerts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "IssueReports",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "IssueReports",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Purpose",
                table: "EmailOtps",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "EmailOtps",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_TruckLocations_TripId",
                table: "TruckLocations",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_TruckLocations_TruckId",
                table: "TruckLocations",
                column: "TruckId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationLogs_UserId",
                table: "NotificationLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DamReadings_DamId",
                table: "DamReadings",
                column: "DamId");

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_AreaId",
                table: "Alerts",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_DamId",
                table: "Alerts",
                column: "DamId");
        }
    }
}
