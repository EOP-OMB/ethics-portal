using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class OutsidePositions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OutsidePosition",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmployeeUpn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmployeePhone = table.Column<int>(type: "int", nullable: true),
                    EmployeeEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Grade = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnnualSalary = table.Column<int>(type: "int", nullable: true),
                    FilerType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Poc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PocPhone = table.Column<int>(type: "int", nullable: true),
                    PocEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PositionTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PeriodsOfEmployment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhysicalLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsPaid = table.Column<bool>(type: "bit", nullable: true),
                    MethodOfCompensation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TypeOfWork = table.Column<int>(type: "int", nullable: false),
                    Duties = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsLikeOfficialDuties = table.Column<bool>(type: "bit", nullable: true),
                    RelationshipToDuties = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequiresAbsence = table.Column<bool>(type: "bit", nullable: true),
                    InvolveExpense = table.Column<bool>(type: "bit", nullable: true),
                    UseOfFacilities = table.Column<bool>(type: "bit", nullable: true),
                    RequireDutiesContract = table.Column<bool>(type: "bit", nullable: true),
                    RequiresDutiesFederal = table.Column<bool>(type: "bit", nullable: true),
                    InvolveOfficialTitle = table.Column<bool>(type: "bit", nullable: true),
                    InvolveDutiesSales = table.Column<bool>(type: "bit", nullable: true),
                    InvolveOrg = table.Column<bool>(type: "bit", nullable: true),
                    EmployeeSignature = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubmittedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SupervisorName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SupervisorUpn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SupervisorDisapproveReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EthicsOfficial = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EthicsOfficialUpn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EthicsDisapproveReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalRemarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_OutsidePosition", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OutsidePositionStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OutsidePositionId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutsidePositionStatus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OutsidePositionStatus_OutsidePosition_OutsidePositionId",
                        column: x => x.OutsidePositionId,
                        principalTable: "OutsidePosition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OutsidePositionStatus_OutsidePositionId",
                table: "OutsidePositionStatus",
                column: "OutsidePositionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OutsidePositionStatus");

            migrationBuilder.DropTable(
                name: "OutsidePosition");
        }
    }
}
