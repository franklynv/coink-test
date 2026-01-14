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

    public async Task<GetUsersResponse> GetUsersAsync(GetUsersRequest request)
    {
        var users = await _repository.GetUsersAsync(request.Search, request.Page, request.PageSize);
        var userList = users.ToList();

        var totalCount = userList.FirstOrDefault()?.TotalCount ?? 0;
        var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

        return new GetUsersResponse
        {
            Users = userList.Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Phone = u.Phone,
                Address = u.Address,
                CountryId = u.CountryId,
                CountryName = u.CountryName,
                DepartmentId = u.DepartmentId,
                DepartmentName = u.DepartmentName,
                MunicipalityId = u.MunicipalityId,
                MunicipalityName = u.MunicipalityName,
                CreatedAt = u.CreatedAt
            }).ToList(),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _repository.GetUserByIdAsync(id);
    }

    public async Task UpdateUserAsync(UpdateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name is required");

        if (string.IsNullOrWhiteSpace(request.Phone))
            throw new ArgumentException("Phone is required");

        if (request.CountryId <= 0 || request.DepartmentId <= 0 || request.MunicipalityId <= 0)
            throw new ArgumentException("Invalid location data");

        var user = new User
        {
            Id = request.Id,
            Name = request.Name,
            Phone = request.Phone,
            Address = request.Address,
            CountryId = request.CountryId,
            DepartmentId = request.DepartmentId,
            MunicipalityId = request.MunicipalityId
        };

        await _repository.UpdateUserAsync(user);
    }

    public async Task DeleteUserAsync(int id)
    {
        await _repository.DeleteUserAsync(id);
    }
}
