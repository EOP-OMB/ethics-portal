using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class NotificationTemplateConcurrency : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ConcurrencyToken",
                table: "NotificationTemplate",
                type: "varbinary(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConcurrencyToken",
                table: "NotificationTemplate");
        }
    }
}
