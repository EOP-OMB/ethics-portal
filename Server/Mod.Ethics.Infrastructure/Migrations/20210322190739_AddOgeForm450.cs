using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class AddOgeForm450 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OgeForm450",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Year = table.Column<int>(type: "int", nullable: false),
                    ReportingStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EmployeesName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PositionTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Agency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BranchUnitAndAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfAppointment = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Grade = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsSpecialGovernmentEmployee = table.Column<bool>(type: "bit", nullable: false),
                    SgeMailingAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasAssetsOrIncome = table.Column<bool>(type: "bit", nullable: false),
                    HasLiabilities = table.Column<bool>(type: "bit", nullable: false),
                    HasOutsidePositions = table.Column<bool>(type: "bit", nullable: false),
                    HasAgreementsOrArrangements = table.Column<bool>(type: "bit", nullable: false),
                    HasGiftsOrTravelReimbursements = table.Column<bool>(type: "bit", nullable: false),
                    DaysExtended = table.Column<int>(type: "int", nullable: false),
                    CorrelationId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormFlags = table.Column<int>(type: "int", nullable: false),
                    FormStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_OgeForm450", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OgeForm450ExtensionRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DaysRequested = table.Column<int>(type: "int", nullable: false),
                    OgeForm450Id = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_OgeForm450ExtensionRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OgeForm450ExtensionRequest_OgeForm450_OgeForm450Id",
                        column: x => x.OgeForm450Id,
                        principalTable: "OgeForm450",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OgeForm450ReportableInformation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NoLongerHeld = table.Column<bool>(type: "bit", nullable: false),
                    OgeForm450Id = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_OgeForm450ReportableInformation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OgeForm450ReportableInformation_OgeForm450_OgeForm450Id",
                        column: x => x.OgeForm450Id,
                        principalTable: "OgeForm450",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OgeForm450Status",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OgeForm450Id = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OgeForm450Status", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OgeForm450Status_OgeForm450_OgeForm450Id",
                        column: x => x.OgeForm450Id,
                        principalTable: "OgeForm450",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OgeForm450ExtensionRequest_OgeForm450Id",
                table: "OgeForm450ExtensionRequest",
                column: "OgeForm450Id");

            migrationBuilder.CreateIndex(
                name: "IX_OgeForm450ReportableInformation_OgeForm450Id",
                table: "OgeForm450ReportableInformation",
                column: "OgeForm450Id");

            migrationBuilder.CreateIndex(
                name: "IX_OgeForm450Status_OgeForm450Id",
                table: "OgeForm450Status",
                column: "OgeForm450Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OgeForm450ExtensionRequest");

            migrationBuilder.DropTable(
                name: "OgeForm450ReportableInformation");

            migrationBuilder.DropTable(
                name: "OgeForm450Status");

            migrationBuilder.DropTable(
                name: "OgeForm450");
        }
    }
}
