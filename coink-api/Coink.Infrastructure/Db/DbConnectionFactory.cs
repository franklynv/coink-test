using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace Coink.Infrastructure.Db;

public class DbConnectionFactory
{
    private readonly string _connectionString;

    public DbConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("Postgres")!;
    }

    public IDbConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }
}
