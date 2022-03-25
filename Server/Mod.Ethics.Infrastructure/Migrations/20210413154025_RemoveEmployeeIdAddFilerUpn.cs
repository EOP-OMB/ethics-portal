using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class RemoveEmployeeIdAddFilerUpn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "OgeForm450");

            migrationBuilder.AddColumn<string>(
                name: "FilerUpn",
                table: "OgeForm450",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilerUpn",
                table: "OgeForm450");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId",
                table: "OgeForm450",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
