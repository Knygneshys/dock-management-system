using JadeWesserPort.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace JadeWesserPort;

public class JWPDbContextFactory : IDesignTimeDbContextFactory<JWPDbContext>
{
    public JWPDbContext CreateDbContext(string[] args)
    {
        var environment = "Development";

        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == "--environment" && i + 1 < args.Length)
            {
                environment = args[i + 1];
                break;
            }
        }

        Console.WriteLine($"Design-Time Factory using {environment}");

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment}.json", true)
            .AddEnvironmentVariables()
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<JWPDbContext>();

        if (environment == "Development")
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlite(connectionString);
        }
        else
        {
            var connectionString = Environment.GetEnvironmentVariable("JWPDB");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("JWPDB environment variable is not set!");
            }
            optionsBuilder.UseNpgsql(connectionString);
        }

        return new JWPDbContext(optionsBuilder.Options);
    }
}