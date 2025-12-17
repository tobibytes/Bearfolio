using Bearfolio.Api.Data;

namespace Bearfolio.Api.GraphQL;

public record ProfileInput(
    string Name,
    string Headline,
    string Bio,
    string Location,
    int Year,
    string[] Fields,
    string[] Interests,
    string[] Strengths,
    string AvatarUrl,
    string LinksJson,
    string SkillsJson,
    bool Onboarded);
public record PortfolioItemInput(Guid ProfileId, PortfolioType Type, PortfolioFormat Format, string Title, string Summary, string[] Tags, string ContentJson, string DetailTemplate, string HeroImageUrl, string LinksJson);
public record OpportunityInput(string Title, string Org, string Category, string[] Fields, string[] Tags, string[] DesiredFormats);
public record UploadRequest(string Kind, string FileType, long FileSize);
public record UploadUrlPayload { public string Url { get; set; } = default!; public string Key { get; set; } = default!; }
