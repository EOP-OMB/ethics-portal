using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AddCapacityToAttendee : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Capacity",
                table: "EventRequestAttendee",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "EventRequestAttendee");
        }
    }
}
