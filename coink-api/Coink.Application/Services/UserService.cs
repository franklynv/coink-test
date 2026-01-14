using Coink.Application.DTOs;
using Coink.Application.Interfaces;
using Coink.Domain.Entities;

namespace Coink.Application.Services;

public class UserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task CreateUserAsync(CreateUserRequest request)
    {
        // Validaciones de negocio
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name is required");

        if (string.IsNullOrWhiteSpace(request.Phone))
            throw new ArgumentException("Phone is required");

        if (request.CountryId <= 0 || request.DepartmentId <= 0 || request.MunicipalityId <= 0)
            throw new ArgumentException("Invalid location data");

        var user = new User
        {
            Name = request.Name,
            Phone = request.Phone,
            Address = request.Address,
            CountryId = request.CountryId,
            DepartmentId = request.DepartmentId,
            MunicipalityId = request.MunicipalityId
        };

        await _repository.CreateUserAsync(user);
    }
}
