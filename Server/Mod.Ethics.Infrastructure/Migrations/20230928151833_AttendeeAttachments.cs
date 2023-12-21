using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AttendeeAttachments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttachmentGuid",
                table: "EventRequestAttendee",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSpeakerAgreementRequired",
                table: "EventRequestAttendee",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AttendeeAttachment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventRequestAttendeeId = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Uid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Size = table.Column<long>(type: "bigint", nullable: false),
                    AttachedToGuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttachmentType = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttendeeAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttendeeAttachment_EventRequestAttendee_EventRequestAttendeeId",
                        column: x => x.EventRequestAttendeeId,
                        principalTable: "EventRequestAttendee",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttendeeAttachment_EventRequestAttendeeId",
                table: "AttendeeAttachment",
                column: "EventRequestAttendeeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttendeeAttachment");

            migrationBuilder.DropColumn(
                name: "AttachmentGuid",
                table: "EventRequestAttendee");

            migrationBuilder.DropColumn(
                name: "IsSpeakerAgreementRequired",
                table: "EventRequestAttendee");
        }
    }
}
