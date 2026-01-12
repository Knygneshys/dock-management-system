using JadeWesserPort.Data;
using JadeWesserPort.Seeders;
using Microsoft.AspNetCore.Mvc;

namespace JadeWesserPort.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController(JWPDbContext _dbContext, IWebHostEnvironment _environment) : ControllerBase
{
    [HttpPost("reset-database")]
    public async Task<IActionResult> ResetDatabase()
    {
        if (_environment.IsProduction())
        {
            return Forbid();
        }

        try
        {
            await _dbContext.Database.EnsureDeletedAsync();
            await _dbContext.Database.EnsureCreatedAsync();

            await new UserSeeder(_dbContext).SeedAsync();
            await new QualificationSeeder(_dbContext).SeedAsync();
            await new CompanySeeder(_dbContext).SeedAsync();
            await new SARSeeder(_dbContext).SeedAsync();
            await new VesselTypeSeeder(_dbContext).SeedAsync();
            await new VesselSeeder(_dbContext).SeedAsync();
            await new StaffMemberSeeder(_dbContext).SeedAsync();
            await new StorageAreaSeeder(_dbContext).SeedAsync();
            await new DockRecordSeeder(_dbContext).SeedAsync();
            await new ResourceSeeder(_dbContext).SeedAsync();
            await new VVNSeeder(_dbContext).SeedAsync();

            return Ok();
        }
        catch (Exception exception)
        {
            return StatusCode(500, new { message = $"Failed to reset database: {exception.Message}" });
        }

    }
}