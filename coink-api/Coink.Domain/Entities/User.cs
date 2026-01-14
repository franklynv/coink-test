namespace Coink.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Address { get; set; } = default!;
    public int CountryId { get; set; }
    public int DepartmentId { get; set; }
    public int MunicipalityId { get; set; }
    public int RowStatus { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UserListItem
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
    public long TotalCount { get; set; }
}
