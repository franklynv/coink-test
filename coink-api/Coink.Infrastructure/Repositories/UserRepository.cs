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

    public async Task<IEnumerable<UserListItem>> GetUsersAsync(string search, int page, int pageSize)
    {
        using var connection = _factory.CreateConnection();

        var parameters = new
        {
            p_search = search,
            p_page = page,
            p_page_size = pageSize
        };

        return await connection.QueryAsync<UserListItem>(
            "SELECT * FROM sp_get_users(@p_search, @p_page, @p_page_size)",
            parameters
        );
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        using var connection = _factory.CreateConnection();

        var result = await connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM sp_get_user_by_id(@p_user_id)",
            new { p_user_id = id }
        );

        return result;
    }

    public async Task UpdateUserAsync(User user)
    {
        using var connection = _factory.CreateConnection();

        var parameters = new
        {
            p_id = user.Id,
            p_name = user.Name,
            p_phone = user.Phone,
            p_address = user.Address,
            p_country_id = user.CountryId,
            p_department_id = user.DepartmentId,
            p_municipality_id = user.MunicipalityId
        };

        await connection.ExecuteAsync(
            "CALL sp_update_user(@p_id, @p_name, @p_phone, @p_address, @p_country_id, @p_department_id, @p_municipality_id)",
            parameters
        );
    }

    public async Task DeleteUserAsync(int id)
    {
        using var connection = _factory.CreateConnection();

        await connection.ExecuteAsync(
            "CALL sp_delete_user(@p_id)",
            new { p_id = id }
        );
    }
}
