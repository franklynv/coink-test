using Coink.Application.Interfaces;
using Coink.Domain.Entities;
using Coink.Infrastructure.Db;
using Dapper;

namespace Coink.Infrastructure.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly DbConnectionFactory _factory;

    public LocationRepository(DbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<Country>> GetCountriesAsync()
    {
        using var connection = _factory.CreateConnection();
        return await connection.QueryAsync<Country>(
            "SELECT * FROM sp_get_countries()"
        );
    }

    public async Task<IEnumerable<Department>> GetDepartmentsAsync(int countryId)
    {
        using var connection = _factory.CreateConnection();
        return await connection.QueryAsync<Department>(
            "SELECT * FROM sp_get_departments(@p_country_id)",
            new { p_country_id = countryId }
        );
    }

    public async Task<IEnumerable<Municipality>> GetMunicipalitiesAsync(int departmentId)
    {
        using var connection = _factory.CreateConnection();
        return await connection.QueryAsync<Municipality>(
            "SELECT * FROM sp_get_municipalities(@p_department_id)",
            new { p_department_id = departmentId }
        );
    }
}
