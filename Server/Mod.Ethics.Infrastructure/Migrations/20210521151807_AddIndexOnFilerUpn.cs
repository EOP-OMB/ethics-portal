using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AddIndexOnFilerUpn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_OgeForm450_FilerUpn",
                table: "OgeForm450",
                column: "FilerUpn");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OgeForm450_FilerUpn",
                table: "OgeForm450");
        }
    }
}
