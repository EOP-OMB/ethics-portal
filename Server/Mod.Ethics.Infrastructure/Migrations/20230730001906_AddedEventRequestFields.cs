using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AddedEventRequestFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ReceivedInvitation",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedDate",
                table: "EventRequest",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatIsProvided",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivedInvitation",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "SubmittedDate",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "WhatIsProvided",
                table: "EventRequest");
        }
    }
}
