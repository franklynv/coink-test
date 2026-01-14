using Coink.Domain.Entities;

namespace Coink.Application.Interfaces;

public interface IUserRepository
{
    Task CreateUserAsync(User user);
}
