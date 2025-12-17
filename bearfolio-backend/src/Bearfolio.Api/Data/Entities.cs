using Pgvector;
using HotChocolate;

namespace Bearfolio.Api.Data;

public enum PortfolioType { Software, Research, Design, Writing, Business, Engineering, Art, Health, Education, Community }
public enum PortfolioFormat { Paper, Deck, Video, Gallery, Code, Report }
public enum ProfileState { Draft, Public }
public enum ItemState { Draft, Published }

public abstract class Auditable
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
}

public class User : Auditable
{
    public string GoogleId { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Name { get; set; } = default!;
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
}

public class Admin : Auditable
{
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
}

public class Profile : Auditable
{
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public string Headline { get; set; } = string.Empty;
    public string Name { get; set; } = default!;
    public string Bio { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int Year { get; set; } = DateTime.UtcNow.Year;
    public string LinksJson { get; set; } = "{}";
    public string SkillsJson { get; set; } = "[]";
    public string[] Fields { get; set; } = Array.Empty<string>();
    public string[] Interests { get; set; } = Array.Empty<string>();
    public string[] Strengths { get; set; } = Array.Empty<string>();
    public string AvatarUrl { get; set; } = string.Empty;
    public ProfileState State { get; set; } = ProfileState.Draft;
    public bool Onboarded { get; set; }
    public ICollection<PortfolioItem> PortfolioItems { get; set; } = new List<PortfolioItem>();
}

public class PortfolioItem : Auditable
{
    public Guid ProfileId { get; set; }
    public Profile Profile { get; set; } = default!;
    public PortfolioType Type { get; set; }
    public PortfolioFormat Format { get; set; }
    public string Title { get; set; } = default!;
    public string Summary { get; set; } = default!;
    public string[] Tags { get; set; } = Array.Empty<string>();
    public string ContentJson { get; set; } = "{}";
    public string DetailTemplate { get; set; } = "CaseStudy";
    public string HeroImageUrl { get; set; } = string.Empty;
    public ItemState State { get; set; } = ItemState.Draft;
    public string LinksJson { get; set; } = "[]";
    
    [GraphQLIgnore]
    public Vector Embedding { get; set; } = new Vector(new float[384]);
}

public class Opportunity : Auditable
{
    public string Title { get; set; } = default!;
    public string Org { get; set; } = default!;
    public string Category { get; set; } = default!;
    public string[] Fields { get; set; } = Array.Empty<string>();
    public string[] Tags { get; set; } = Array.Empty<string>();
    public string[] DesiredFormats { get; set; } = Array.Empty<string>();
    public string Status { get; set; } = "Draft";
}
