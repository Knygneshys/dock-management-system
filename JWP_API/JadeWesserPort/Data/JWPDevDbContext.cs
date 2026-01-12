using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data;

public class JWPDevDbContext : JWPDbContext
{
    public JWPDevDbContext(DbContextOptions<JWPDevDbContext> options)
    : base(options)
    {
    }
}
