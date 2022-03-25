using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AddedSubstantiveReview : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfSubstantiveReview",
                table: "OgeForm450",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubstantiveReviewer",
                table: "OgeForm450",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateOfSubstantiveReview",
                table: "OgeForm450");

            migrationBuilder.DropColumn(
                name: "SubstantiveReviewer",
                table: "OgeForm450");
        }
    }
}
