using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JWPTests.Helpers;
internal static class AuthHelper
{
    public static ControllerContext CreateControllerContextWithUser(string auth0Id = "auth0|admin", string email = "admin@example.com")
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, auth0Id),
            new(ClaimTypes.Email, email)
        };

        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
    }
}
