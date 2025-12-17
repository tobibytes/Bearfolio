using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bearfolio.Api.Data.Migrations
{
    public partial class AddHeadline : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Headline",
                table: "Profiles",
                type: "character varying(280)",
                maxLength: 280,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Headline",
                table: "Profiles");
        }
    }
}
