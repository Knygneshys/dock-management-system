namespace SchedulePlanning.Handlers;

public class ApiKeyDelegatingHandler : DelegatingHandler
{
    private const string API_KEY_HEADER = "X-Api-Key";
    private readonly string _apiKey;

    public ApiKeyDelegatingHandler(IConfiguration configuration)
    {
        _apiKey = configuration["MainBackendApiKey"] 
                  ?? throw new InvalidOperationException("MainBackendApiKey not configured in appsettings.json");
    }

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, 
        CancellationToken cancellationToken)
    {
        request.Headers.Add(API_KEY_HEADER, _apiKey);
        return await base.SendAsync(request, cancellationToken);
    }
}