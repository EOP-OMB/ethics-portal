using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AddSettingsColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AnnualDueDate",
                table: "Settings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CcEmail",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentFilingYear",
                table: "Settings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FormVersion",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinimumGiftValue",
                table: "Settings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OGCEmail",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReplacesVersion",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SiteUrl",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalGiftValue",
                table: "Settings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnnualDueDate",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "CcEmail",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "CurrentFilingYear",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "FormVersion",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "MinimumGiftValue",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "OGCEmail",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "ReplacesVersion",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "SiteUrl",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "TotalGiftValue",
                table: "Settings");
        }
    }
}
