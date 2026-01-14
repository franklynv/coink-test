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

public class CreateUserResponse
{
    public int Id { get; set; }
}

public class GetUserRequest
{
    public int Id { get; set; }
}