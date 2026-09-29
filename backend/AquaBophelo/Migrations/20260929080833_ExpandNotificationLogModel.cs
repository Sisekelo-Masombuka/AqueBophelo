using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AquaBophelo.Migrations
{
    /// <inheritdoc />
    public partial class ExpandNotificationLogModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotificationLogs_Alerts_AlertId",
                table: "NotificationLogs");

            migrationBuilder.AlterColumn<int>(
                name: "AlertId",
                table: "NotificationLogs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "NotificationLogs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "NotificationLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "NotificationLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "NotificationLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationLogs_Alerts_AlertId",
                table: "NotificationLogs",
                column: "AlertId",
                principalTable: "Alerts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotificationLogs_Alerts_AlertId",
                table: "NotificationLogs");

            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "NotificationLogs");

            migrationBuilder.DropColumn(
                name: "Message",
                table: "NotificationLogs");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "NotificationLogs");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "NotificationLogs");

            migrationBuilder.AlterColumn<int>(
                name: "AlertId",
                table: "NotificationLogs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationLogs_Alerts_AlertId",
                table: "NotificationLogs",
                column: "AlertId",
                principalTable: "Alerts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
