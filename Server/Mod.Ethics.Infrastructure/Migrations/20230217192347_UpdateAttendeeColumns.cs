using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class UpdateAttendeeColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRequestAttendee_EventRequest_EventRequestId1",
                table: "EventRequestAttendee");

            migrationBuilder.DropIndex(
                name: "IX_EventRequestAttendee_EventRequestId1",
                table: "EventRequestAttendee");

            migrationBuilder.DropColumn(
                name: "EventRequestId1",
                table: "EventRequestAttendee");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "EventRequestAttendee",
                newName: "EmployeeUpn");

            migrationBuilder.RenameColumn(
                name: "Attendee",
                table: "EventRequestAttendee",
                newName: "EmployeeName");

            migrationBuilder.AlterColumn<int>(
                name: "EventRequestId",
                table: "EventRequestAttendee",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventRequestAttendee_EventRequestId",
                table: "EventRequestAttendee",
                column: "EventRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRequestAttendee_EventRequest_EventRequestId",
                table: "EventRequestAttendee",
                column: "EventRequestId",
                principalTable: "EventRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRequestAttendee_EventRequest_EventRequestId",
                table: "EventRequestAttendee");

            migrationBuilder.DropIndex(
                name: "IX_EventRequestAttendee_EventRequestId",
                table: "EventRequestAttendee");

            migrationBuilder.RenameColumn(
                name: "EmployeeUpn",
                table: "EventRequestAttendee",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "EmployeeName",
                table: "EventRequestAttendee",
                newName: "Attendee");

            migrationBuilder.AlterColumn<string>(
                name: "EventRequestId",
                table: "EventRequestAttendee",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "EventRequestId1",
                table: "EventRequestAttendee",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventRequestAttendee_EventRequestId1",
                table: "EventRequestAttendee",
                column: "EventRequestId1");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRequestAttendee_EventRequest_EventRequestId1",
                table: "EventRequestAttendee",
                column: "EventRequestId1",
                principalTable: "EventRequest",
                principalColumn: "Id");
        }
    }
}
