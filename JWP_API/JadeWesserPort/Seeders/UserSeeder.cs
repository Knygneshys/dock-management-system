using JadeWesserPort.Data;
using JadeWesserPort.Domain.System;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class UserSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.Users.AnyAsync())
        {
            return;
        }

        var users = GetUsers();

        await _dbContext.Users.AddRangeAsync(users);
        await _dbContext.SaveChangesAsync();
    }

    private static IEnumerable<User> GetUsers()
    {
        var portAuthorityOfficers = GetPortAuthorityOfficers();
        var logisticsOperators = GetLogisticsOperators();
        var shippingAgenRepresentatives = GetShippingAgentRepresentatives();
        var admins = GetAdmins();

        return portAuthorityOfficers.Concat(logisticsOperators).Concat(shippingAgenRepresentatives).Concat(admins);
    }

    private static IEnumerable<User> GetPortAuthorityOfficers()
    {
        const UserRole role = UserRole.PortAuthorityOfficer;
        
        return
        [
            new User()
            {
                Email = "thomas@gmail.com",
                Role = role,
                Auth0Id = "auth0|6912002fd5af298d6ee16eed",
                IsActive = true,
            },
            new User()
            {
                Email = "garry@gmail.com",
                Role = role,
                Auth0Id = "auth0|69120096d5af298d6ee16f70",
                IsActive = true,
            },
            new User()
            {
                Email = "annie@gmail.com",
                Role = role,
                Auth0Id = "auth0|691200b7851a61e532a62007",
                IsActive = true,
            }
        ];
    }

    private static IEnumerable<User> GetLogisticsOperators()
    {
        const UserRole role = UserRole.LogisticsOperator;

        return
        [
            new User()
            {
                Email = "lenny@gmail.com",
                Role = role,
                Auth0Id = "auth0|691200b0d5af298d6ee16f8d",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            },
            new User()
            {
                Email = "alex@gmail.com",
                Role = role,
                Auth0Id = "auth0|691200aa93bcf5cd81a3cc64",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            },
            new User()
            {
                Email = "stasy@gmail.com",
                Role = role,
                Auth0Id = "auth0|6912009c590233821efe194d",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            },
            new User()
            {
                Email = "joao@gmail.com",
                Role = role,
                Auth0Id = "auth0|6959042df776949be3885a05",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            },
        ];
    }

    private static IEnumerable<User> GetShippingAgentRepresentatives()
    {
        var role = UserRole.ShippingAgentRepresentative;

        return
        [
            new User()
            {
                Email = "robbie@gmail.com",
                Role = role,
                Auth0Id = "auth0|691200498782f0a4722e578f",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            },
            new User()
            {
                Email = "alexa@gmail.com",
                Role = role,
                Auth0Id = "auth0|691200a3851a61e532a61fed",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            },
            new User()
            {
                Email = "barbie@gmail.com",
                Role = role,
                Auth0Id = "auth0|691200bdfa104e4185e987d4",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            },
        ];
    }

    private static IEnumerable<User> GetAdmins()
    {
        var role = UserRole.SystemAdmin;
        return
        [
            new User()
            {
                Email = "superadmin@gmail.com",
                Role = role,
                Auth0Id = "auth0|691200c713c57b11140fa0be",
                IsActive = true,
                HasReadPrivacyPolicy = false,
            }
        ];
    }
}