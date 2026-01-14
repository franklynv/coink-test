using Coink.Application.Interfaces;
using Coink.Domain.Entities;
using Coink.Infrastructure.Db;
using Dapper;

namespace Coink.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DbConnectionFactory _factory;

    public UserRepository(DbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task CreateUserAsync(User user)
    {
        using var connection = _factory.CreateConnection();

        var parameters = new
        {
            p_name = user.Name,
            p_phone = user.Phone,
            p_address = user.Address,
            p_country_id = user.CountryId,
            p_department_id = user.DepartmentId,
            p_municipality_id = user.MunicipalityId
        };

        await connection.ExecuteAsync(
            "CALL sp_create_user(@p_name, @p_phone, @p_address, @p_country_id, @p_department_id, @p_municipality_id)",
            parameters
        );
    }
}
