using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class EventRequest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalInformation",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApproximateAttendees",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AssignedToUpn",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AttachmentGuid",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClosedBy",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedDate",
                table: "EventRequest",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClosedReason",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactComponent",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactNumber",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CrowdDescription",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventContactName",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventContactPhone",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EventEndDate",
                table: "EventRequest",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventLocation",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventName",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EventStartDate",
                table: "EventRequest",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FairMarketValue",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GuestsInvited",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuidanceGiven",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HostOther",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IndividualExtendingInvite",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InternationalTravel",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFundraiser",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsHostLobbyist",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsIndividualLobbyist",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOpenToMedia",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOrgLobbyist",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsQAndA",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModeratorsAndPanelists",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrgExtendingInvite",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrgHostingEvent",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrgOther",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresTravel",
                table: "EventRequest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubmittedBy",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Submitter",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TypeOfHost",
                table: "EventRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TypeOfOrg",
                table: "EventRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WhoIsPaying",
                table: "EventRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EventRequestAttachment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventRequestId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_EventRequestAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventRequestAttachment_EventRequest_EventRequestId",
                        column: x => x.EventRequestId,
                        principalTable: "EventRequest",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EventRequestAttendee",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventRequestId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EventRequestId1 = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Attendee = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmployeeType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsGivingRemarks = table.Column<bool>(type: "bit", nullable: false),
                    NameOfSupervisor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReasonForAttending = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRequestAttendee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventRequestAttendee_EventRequest_EventRequestId1",
                        column: x => x.EventRequestId1,
                        principalTable: "EventRequest",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventRequestAttachment_EventRequestId",
                table: "EventRequestAttachment",
                column: "EventRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRequestAttendee_EventRequestId1",
                table: "EventRequestAttendee",
                column: "EventRequestId1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventRequestAttachment");

            migrationBuilder.DropTable(
                name: "EventRequestAttendee");

            migrationBuilder.DropColumn(
                name: "AdditionalInformation",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ApproximateAttendees",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "AssignedToUpn",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "AttachmentGuid",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ClosedBy",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ClosedDate",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ClosedReason",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ContactComponent",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ContactNumber",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "CrowdDescription",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "EventContactName",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "EventContactPhone",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "EventEndDate",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "EventLocation",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "EventName",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "EventStartDate",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "FairMarketValue",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "GuestsInvited",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "GuidanceGiven",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "HostOther",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "IndividualExtendingInvite",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "InternationalTravel",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "IsFundraiser",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "IsHostLobbyist",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "IsIndividualLobbyist",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "IsOpenToMedia",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "IsOrgLobbyist",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "IsQAndA",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "ModeratorsAndPanelists",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "OrgExtendingInvite",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "OrgHostingEvent",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "OrgOther",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "RequiresTravel",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "SubmittedBy",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "Submitter",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "TypeOfHost",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "TypeOfOrg",
                table: "EventRequest");

            migrationBuilder.DropColumn(
                name: "WhoIsPaying",
                table: "EventRequest");
        }
    }
}
