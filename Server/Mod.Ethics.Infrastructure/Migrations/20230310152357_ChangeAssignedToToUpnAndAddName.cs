using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class ChangeAssignedToToUpnAndAddName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssignedTo",
                table: "OgeForm450",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AssignedToUpn",
                table: "OgeForm450",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedTo",
                table: "OgeForm450");

            migrationBuilder.DropColumn(
                name: "AssignedToUpn",
                table: "OgeForm450");
        }
    }
}
