using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class EthicsTeam : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "EthicsTeam",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedTime",
                table: "EthicsTeam",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "EthicsTeam",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedTime",
                table: "EthicsTeam",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "EthicsTeam",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "EthicsTeam",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedTime",
                table: "EthicsTeam",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "EthicsTeam",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "EthicsTeam",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "EthicsTeam",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "EthicsTeam",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "CreatedTime",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "DeletedTime",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "ModifiedTime",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "EthicsTeam");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "EthicsTeam");
        }
    }
}
