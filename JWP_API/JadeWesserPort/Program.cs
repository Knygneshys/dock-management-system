using System.Reflection;
using System.Security.Claims;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Seeders;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Services;
using JWPTests.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using JadeWesserPort.Authentication;
using JadeWesserPort.Configuration;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using JadeWesserPort.Intermediators;

var builder = WebApplication.CreateBuilder(args);

var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";
var audience = builder.Configuration["Auth0:Audience"];
var scheduleApiUrlString = builder.Configuration["ExternalApis:ScheduleApiBaseUrl"] ?? throw new Exception("Schedule API URL not set!");
var oemApiBaseUrl = builder.Configuration["ExternalApis:OemApiBaseUrl"] ?? throw new Exception("OEM API URL not set!");;

builder.Services.AddScoped<SchedulersIntermediator>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = domain;
        options.Audience = audience;    
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = ClaimTypes.NameIdentifier
        };
    })
    .AddScheme<AuthenticationSchemeOptions, ApiKeyAuthenticationHandler>("ApiKey", options => { });

builder.Services.AddAuthorization();


if (builder.Environment.IsProduction())
{
    var connectionString = Environment.GetEnvironmentVariable("JWPDB");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("JWPDB environment variable is not set!");
    }
    builder.Services.AddDbContext<JWPDbContext>(
        options => options.UseNpgsql(connectionString));
}
else
{
    builder.Services.AddDbContext<JWPDbContext, JWPDevDbContext>(
        options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
}

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings")
);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDockAvailabilityService, DockAvailabilityService>();
builder.Services.AddScoped<IDockRecordService, DockRecordService>();
builder.Services.AddScoped<IQualificationService, QualificationService>();
builder.Services.AddScoped<IResourceService, ResourceService>();
builder.Services.AddScoped<IShippingAgentRepService, ShippingAgentRepService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<IVesselService, VesselService>();
builder.Services.AddScoped<IVesselTypeService, VesselTypeService>();
builder.Services.AddScoped<IPortLayoutService, PortLayoutService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVVNService, VVNService>();
builder.Services.AddScoped<ISchedulingService, SchedulingService>();
builder.Services.AddScoped<IOperationPlanService, OperationPlanService>();
builder.Services.AddScoped<IPrivacyPolicyServices, PrivacyPolicyServices>();

var config = new TypeAdapterConfig();
config.Scan(Assembly.GetExecutingAssembly()); 
builder.Services.AddSingleton(config);
builder.Services.AddScoped<IMapper, ServiceMapper>();

builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddScoped<IStockItemsRepository, StockItemRepository>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IDockRecordRepository, DockRecordRepository>();
builder.Services.AddScoped<IQualificationRepository, QualificationRepository>();
builder.Services.AddScoped<IResourceRepository, ResourceRepository>();
builder.Services.AddScoped<IShiftRepository, ShiftRepository>();
builder.Services.AddScoped<IShippingAgentRepresentativeRepository, ShippingAgentRepresentativeRepository>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IStorageAreaRepository, StorageAreaRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVesselRepository, VesselRepository>();
builder.Services.AddScoped<IVesselTypeRepository, VesselTypeRepository>();
builder.Services.AddScoped<IVVNRepository, VVNRepository>();
builder.Services.AddScoped<IDockStorageDistanceRepository, DockStorageDistanceRepository>();
builder.Services.AddScoped<IPrivacyPolicyRepository, PrivacyPolicyRepository>();
builder.Services.AddScoped<IDataRectificationRequestRepository, DataRectificationRequestRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "JadeWesser Port API",
        Version = "v1",
        Description = "API for managing port logistics operations"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddHttpClient<SchedulersIntermediator>(client =>
{
    client.BaseAddress = new Uri(scheduleApiUrlString);
});

builder.Services.AddHttpClient<OemIntermediator>(httpClient =>
{
    httpClient.BaseAddress = new Uri(oemApiBaseUrl);
});


if (builder.Environment.IsProduction())
{
    try
    {
        using var scope = builder.Services.BuildServiceProvider().CreateScope();
        var ctx = scope.ServiceProvider.GetRequiredService<JWPDbContext>();
        await ctx.Database.OpenConnectionAsync();
        await ctx.Database.CloseConnectionAsync();
        Console.WriteLine("RDS connection Ok");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"RDS connection failed: {ex.Message}");
        throw;
    }
}

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var services = scope.ServiceProvider;
    var _dbContext = services.GetRequiredService<JWPDbContext>();

    await new UserSeeder(_dbContext).SeedAsync();
    await new QualificationSeeder(_dbContext).SeedAsync();
    await new CompanySeeder(_dbContext).SeedAsync();
    await new SARSeeder(_dbContext).SeedAsync();
    await new VesselTypeSeeder(_dbContext).SeedAsync();
    await new VesselSeeder(_dbContext).SeedAsync();
    await new StaffMemberSeeder(_dbContext).SeedAsync();
    await new StorageAreaSeeder(_dbContext).SeedAsync();
    await new StockItemSeeder(_dbContext).SeedAsync();
    await new DockRecordSeeder(_dbContext).SeedAsync();
    await new ResourceSeeder(_dbContext).SeedAsync();


    await new VVNSeeder(_dbContext).SeedAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "JadeWesser Port API v1");
        c.RoutePrefix = string.Empty;
    });
}
else
{
    app.UseExceptionHandler("/Error");
    //app.UseHttpsRedirection();
    //app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();