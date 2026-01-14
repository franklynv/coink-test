namespace Coink.Application.DTOs;

public class CreateUserRequest
{
    public string Name { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Address { get; set; } = default!;
    public int CountryId { get; set; }
    public int DepartmentId { get; set; }
    public int MunicipalityId { get; set; }
}

public class UpdateUserRequest
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Address { get; set; } = default!;
    public int CountryId { get; set; }
    public int DepartmentId { get; set; }
    public int MunicipalityId { get; set; }
}

public class GetUsersRequest
{
    public string Search { get; set; } = "";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUsersResponse
{
    public List<UserDto> Users { get; set; } = new();
    public long TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Address { get; set; } = default!;
    public int CountryId { get; set; }
    public string CountryName { get; set; } = default!;
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = default!;
    public int MunicipalityId { get; set; }
    public string MunicipalityName { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}