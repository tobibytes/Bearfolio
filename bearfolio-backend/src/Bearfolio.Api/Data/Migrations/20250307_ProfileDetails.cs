using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bearfolio.Api.Data.Migrations
{
    public partial class ProfileDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Profiles",
                type: "character varying(160)",
                maxLength: 160,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "Profiles",
                type: "integer",
                nullable: false,
                defaultValue: 2025);

            migrationBuilder.AddColumn<string>(
                name: "LinksJson",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "SkillsJson",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "[]");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Location", table: "Profiles");
            migrationBuilder.DropColumn(name: "Year", table: "Profiles");
            migrationBuilder.DropColumn(name: "LinksJson", table: "Profiles");
            migrationBuilder.DropColumn(name: "SkillsJson", table: "Profiles");
        }
    }
}
