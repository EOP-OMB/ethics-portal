using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class UpdateEthicsForm : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "EthicsForm",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedTime",
                table: "EthicsForm",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "EthicsForm",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedTime",
                table: "EthicsForm",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "EthicsForm",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "EthicsForm",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedTime",
                table: "EthicsForm",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "EthicsForm",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "CreatedTime",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "DeletedTime",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "ModifiedTime",
                table: "EthicsForm");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "EthicsForm");
        }
    }
}
