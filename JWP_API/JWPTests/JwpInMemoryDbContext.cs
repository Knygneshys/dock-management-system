using JadeWesserPort.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace JWPTests;

public static class JwpInMemoryDbContext
{
   public static JWPDbContext GetContext()
   {
      var options = new DbContextOptionsBuilder<JWPDbContext>()
         .UseInMemoryDatabase(Guid.NewGuid().ToString())
         .Options;

      return new JWPDbContext(options);
   }

    public static (JWPDbContext Context, SqliteConnection Connection) GetSqliteInMemoryContext()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<JWPDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new JWPDbContext(options);
        context.Database.EnsureCreated();

        return (context, connection);
    }
}