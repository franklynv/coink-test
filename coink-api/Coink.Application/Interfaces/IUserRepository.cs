using Coink.Domain.Entities;

namespace Coink.Application.Interfaces;

public interface IUserRepository
{
    Task CreateUserAsync(User user);
    Task<IEnumerable<UserListItem>> GetUsersAsync(string search, int page, int pageSize);
    Task<User?> GetUserByIdAsync(int id);
    Task UpdateUserAsync(User user);
    Task DeleteUserAsync(int id);
}
