using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AddEmployeeStatusToTraining : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmployeeStatus",
                table: "Training",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmployeeStatus",
                table: "Training");
        }
    }
}
