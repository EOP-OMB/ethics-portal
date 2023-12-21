using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class EthicsTeamAndForms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "EthicsTeam",
                newName: "Name");

            migrationBuilder.AddColumn<byte[]>(
                name: "Content",
                table: "EthicsForm",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "EthicsForm",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "EthicsForm",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FileSize",
                table: "EthicsForm",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FormType",
                table: "EthicsForm",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "EthicsForm",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "FileSize",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "FormType",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "EthicsForm");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "EthicsTeam",
                newName: "Title");
        }
    }
}
