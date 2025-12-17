using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;
using NpgsqlTypes;

#nullable disable

namespace Bearfolio.Api.Data.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder m)
    {
        m.Sql("CREATE EXTENSION IF NOT EXISTS vector;");

        m.CreateTable(
            name: "Users",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                GoogleId = table.Column<string>(type: "text", nullable: false),
                Email = table.Column<string>(type: "text", nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                CreatedBy = table.Column<string>(type: "text", nullable: true),
                UpdatedBy = table.Column<string>(type: "text", nullable: true),
                IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_Users", x => x.Id); });
        m.CreateIndex(name: "IX_Users_Email", table: "Users", column: "Email", unique: true);

        m.CreateTable(
            name: "Profiles",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                Bio = table.Column<string>(type: "text", nullable: false),
                Fields = table.Column<string[]>(type: "text[]", nullable: false),
                Interests = table.Column<string[]>(type: "text[]", nullable: false),
                Strengths = table.Column<string[]>(type: "text[]", nullable: false),
                Location = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false, defaultValue: ""),
                Year = table.Column<int>(type: "integer", nullable: false, defaultValue: 2025),
                LinksJson = table.Column<string>(type: "text", nullable: false, defaultValue: "{}"),
                SkillsJson = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                Headline = table.Column<string>(type: "character varying(280)", maxLength: 280, nullable: false),
                AvatarUrl = table.Column<string>(type: "text", nullable: false),
                State = table.Column<int>(type: "integer", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                CreatedBy = table.Column<string>(type: "text", nullable: true),
                UpdatedBy = table.Column<string>(type: "text", nullable: true),
                IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Profiles", x => x.Id);
                table.ForeignKey("FK_Profiles_Users_UserId", x => x.UserId, "Users", "Id", onDelete: ReferentialAction.Cascade);
            });
        m.CreateIndex(name: "IX_Profiles_UserId", table: "Profiles", column: "UserId");

        m.CreateTable(
            name: "Admins",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                CreatedBy = table.Column<string>(type: "text", nullable: true),
                UpdatedBy = table.Column<string>(type: "text", nullable: true),
                IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Admins", x => x.Id);
                table.ForeignKey("FK_Admins_Users_UserId", x => x.UserId, "Users", "Id", onDelete: ReferentialAction.Cascade);
            });
        m.CreateIndex(name: "IX_Admins_UserId", table: "Admins", column: "UserId");

        m.CreateTable(
            name: "Opportunities",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Title = table.Column<string>(type: "text", nullable: false),
                Org = table.Column<string>(type: "text", nullable: false),
                Category = table.Column<string>(type: "text", nullable: false),
                Fields = table.Column<string[]>(type: "text[]", nullable: false),
                Tags = table.Column<string[]>(type: "text[]", nullable: false),
                DesiredFormats = table.Column<string[]>(type: "text[]", nullable: false),
                Status = table.Column<string>(type: "text", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                CreatedBy = table.Column<string>(type: "text", nullable: true),
                UpdatedBy = table.Column<string>(type: "text", nullable: true),
                IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_Opportunities", x => x.Id); });

        m.CreateTable(
            name: "PortfolioItems",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                ProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                Type = table.Column<int>(type: "integer", nullable: false),
                Format = table.Column<int>(type: "integer", nullable: false),
                Title = table.Column<string>(type: "text", nullable: false),
                Summary = table.Column<string>(type: "text", nullable: false),
                Tags = table.Column<string[]>(type: "text[]", nullable: false),
                ContentJson = table.Column<string>(type: "text", nullable: false),
                DetailTemplate = table.Column<string>(type: "text", nullable: false),
                HeroImageUrl = table.Column<string>(type: "text", nullable: false),
                State = table.Column<int>(type: "integer", nullable: false),
                Embedding = table.Column<Vector>(type: "vector(384)", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                CreatedBy = table.Column<string>(type: "text", nullable: true),
                UpdatedBy = table.Column<string>(type: "text", nullable: true),
                IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                SearchVector = table.Column<NpgsqlTsVector>(name: "SearchVector", type: "tsvector", nullable: false, computedColumnSql: "to_tsvector('english', coalesce(\"Title\", '') || ' ' || coalesce(\"Summary\", ''))", stored: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PortfolioItems", x => x.Id);
                table.ForeignKey("FK_PortfolioItems_Profiles_ProfileId", x => x.ProfileId, "Profiles", "Id", onDelete: ReferentialAction.Cascade);
            });
        m.CreateIndex(name: "IX_PortfolioItems_ProfileId", table: "PortfolioItems", column: "ProfileId");
        m.CreateIndex(name: "IX_PortfolioItems_Embedding", table: "PortfolioItems", column: "Embedding").Annotation("Npgsql:IndexMethod", "ivfflat");
        m.CreateIndex(name: "IX_PortfolioItems_SearchVector", table: "PortfolioItems", column: "SearchVector").Annotation("Npgsql:IndexMethod", "gin");
    }

    protected override void Down(MigrationBuilder m)
    {
        m.DropTable(name: "Admins");
        m.DropTable(name: "Opportunities");
        m.DropTable(name: "PortfolioItems");
        m.DropTable(name: "Profiles");
        m.DropTable(name: "Users");
    }
}
