using Microsoft.EntityFrameworkCore;

namespace Bearfolio.Api.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<PortfolioItem> PortfolioItems => Set<PortfolioItem>();
    public DbSet<Opportunity> Opportunities => Set<Opportunity>();
    public DbSet<Admin> Admins => Set<Admin>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasPostgresExtension("vector");
        b.Entity<User>().HasIndex(x => x.Email).IsUnique();
        b.Entity<PortfolioItem>().Property(x => x.Embedding).HasColumnType("vector(384)");
        b.Entity<PortfolioItem>().HasIndex(x => x.Embedding).HasMethod("ivfflat");
        b.Entity<PortfolioItem>().Property<string>("SearchVector").HasColumnType("tsvector")
            .HasComputedColumnSql("to_tsvector('english', coalesce(\"Title\", '') || ' ' || coalesce(\"Summary\", ''))", stored: true);
        b.Entity<PortfolioItem>().HasIndex("SearchVector").HasMethod("gin");
        b.Entity<PortfolioItem>().HasQueryFilter(x => !x.IsDeleted);
        b.Entity<Profile>().HasQueryFilter(x => !x.IsDeleted);
        b.Entity<Profile>().Property(x => x.Headline).HasMaxLength(280);
        b.Entity<Profile>().Property(x => x.Location).HasMaxLength(160);
        b.Entity<Profile>().Property(x => x.Year).HasDefaultValue(DateTime.UtcNow.Year);
        b.Entity<PortfolioItem>().Property(x => x.LinksJson).HasDefaultValue("[]");
        b.Entity<Opportunity>().HasQueryFilter(x => !x.IsDeleted);
    }
}
