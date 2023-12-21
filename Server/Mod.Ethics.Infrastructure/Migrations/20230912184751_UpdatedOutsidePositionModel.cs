using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mod.Ethics.Infrastructure.Migrations
{
    public partial class UpdatedOutsidePositionModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EthicsDisapproveReason",
                table: "OutsidePosition");

            migrationBuilder.DropColumn(
                name: "EthicsOfficial",
                table: "OutsidePosition");

            migrationBuilder.DropColumn(
                name: "EthicsOfficialUpn",
                table: "OutsidePosition");

            migrationBuilder.DropColumn(
                name: "SupervisorDisapproveReason",
                table: "OutsidePosition");

            migrationBuilder.AddColumn<string>(
                name: "Action",
                table: "OutsidePositionStatus",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Action",
                table: "OutsidePositionStatus");

            migrationBuilder.AddColumn<string>(
                name: "EthicsDisapproveReason",
                table: "OutsidePosition",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EthicsOfficial",
                table: "OutsidePosition",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EthicsOfficialUpn",
                table: "OutsidePosition",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupervisorDisapproveReason",
                table: "OutsidePosition",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
