using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bearfolio.Api.Data.Migrations
{
    public partial class ProfileFlagsAndItemLinks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Onboarded",
                table: "Profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LinksJson",
                table: "PortfolioItems",
                type: "text",
                nullable: false,
                defaultValue: "[]");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Onboarded", table: "Profiles");
            migrationBuilder.DropColumn(name: "LinksJson", table: "PortfolioItems");
        }
    }
}
