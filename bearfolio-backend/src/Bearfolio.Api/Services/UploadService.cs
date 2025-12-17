using Amazon.S3;
using Amazon.S3.Model;
using Bearfolio.Api.GraphQL;

namespace Bearfolio.Api.Services;

public class UploadService
{
    private readonly IConfiguration _config;
    private static readonly string[] AllowedTypes = { "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", "video/mp4", "video/webm" };

    public UploadService(IConfiguration config)
    {
        _config = config;
    }

    public Task<UploadUrlPayload> CreateSignedUrlAsync(UploadRequest input)
    {
        Validate(input);
        if (_config.GetValue<bool>("Features:UseMocks"))
        {
            return Task.FromResult(new UploadUrlPayload { Url = "https://example.com/mock-upload", Key = $"mock/{Guid.NewGuid()}" });
        }

        var accessKey = _config["R2:AccessKey"];
        var secretKey = _config["R2:SecretKey"];
        var bucket = _config["R2:Bucket"];
        var accountId = _config["R2:AccountId"];
        if (string.IsNullOrWhiteSpace(accessKey) || string.IsNullOrWhiteSpace(secretKey) || string.IsNullOrWhiteSpace(bucket) || string.IsNullOrWhiteSpace(accountId))
            throw new GraphQLException("uploads not configured");

        var endpoint = $"https://{accountId}.r2.cloudflarestorage.com";
        var key = $"uploads/{Guid.NewGuid()}";
        var s3 = new AmazonS3Client(accessKey, secretKey, new AmazonS3Config { ServiceURL = endpoint, ForcePathStyle = true });
        var req = new GetPreSignedUrlRequest
        {
            BucketName = bucket,
            Key = key,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(10),
            ContentType = input.FileType
        };
        var url = s3.GetPreSignedURL(req);
        return Task.FromResult(new UploadUrlPayload { Url = url, Key = key });
    }

    private static void Validate(UploadRequest input)
    {
        if (!AllowedTypes.Contains(input.FileType)) throw new GraphQLException("not authorized");
        var limit = input.Kind switch
        {
            "profile" => 5 * 1024 * 1024,
            "hero" => 10 * 1024 * 1024,
            "gallery" => 10 * 1024 * 1024,
            "video" => 50 * 1024 * 1024,
            _ => 5 * 1024 * 1024
        };
        if (input.FileSize > limit) throw new GraphQLException("file too large");
    }
}
