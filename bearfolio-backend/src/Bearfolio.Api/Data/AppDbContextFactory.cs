using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Bearfolio.Api.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        
        // Use a temporary connection string for design-time migrations
        // This won't be used at runtime, only for generating migration files
        optionsBuilder.UseNpgsql("Host=localhost;Database=bearfolio;Username=postgres;Password=postgres", 
            npg => npg.UseVector());
        
        return new AppDbContext(optionsBuilder.Options);
    }
}