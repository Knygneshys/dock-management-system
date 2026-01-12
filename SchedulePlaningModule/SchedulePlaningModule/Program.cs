using SchedulePlanning.APIIntermediator;
using SchedulePlanning.Handlers;
using SchedulePlanning.Services;
using SchedulePlanning.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IPlanningService, PlanningService>();
builder.Services.AddScoped<IAlgorithmRunnerService, AlgorithmRunnerService>();
builder.Services.AddScoped<VVNIntermediator>();
builder.Services.AddScoped<StaffIntermediator>();
builder.Services.AddScoped<DockIntermediator>();

var beApiUrlString = builder.Configuration["ExternalApis:JadeWesserPortBaseUrl"] ?? throw new Exception("JadeWesserPortBaseUrl not set!");

builder.Services.AddTransient<ApiKeyDelegatingHandler>();

builder.Services.AddHttpClient<VVNIntermediator>(client =>
    {
        client.BaseAddress = new Uri(beApiUrlString);
        client.Timeout = TimeSpan.FromSeconds(30);
    })
    .AddHttpMessageHandler<ApiKeyDelegatingHandler>();

builder.Services.AddHttpClient<StaffIntermediator>(client =>
{
    client.BaseAddress = new Uri(beApiUrlString);
    client.Timeout = TimeSpan.FromSeconds(30);
})
    .AddHttpMessageHandler<ApiKeyDelegatingHandler>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Planning API v1");
        c.RoutePrefix = string.Empty;
    });
}


app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    await next.Invoke();
});

app.MapControllers();
app.Run();
