using Pgvector;

namespace Bearfolio.Api.Services;

public class EmbeddingService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    public EmbeddingService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _config = config;
    }

    public async Task<Vector> GenerateEmbeddingAsync(string text, CancellationToken ct)
    {
        var apiKey = _config["Embeddings:ApiKey"];
        var endpoint = _config["Embeddings:Endpoint"];
        if (_config.GetValue<bool>("Features:UseMocks") || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(endpoint))
        {
            return new Vector(new float[384]);
        }
        using var req = new HttpRequestMessage(HttpMethod.Post, endpoint);
        req.Headers.Add("Authorization", $"Bearer {apiKey}");
        req.Content = JsonContent.Create(new { input = text });
        var resp = await _http.SendAsync(req, ct);
        resp.EnsureSuccessStatusCode();
        var payload = await resp.Content.ReadFromJsonAsync<EmbeddingResponse>(cancellationToken: ct);
        return new Vector(payload?.Data ?? new float[384]);
    }

    private record EmbeddingResponse(float[] Data);
}
