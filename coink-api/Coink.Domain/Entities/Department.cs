namespace Coink.Domain.Entities;

public class Department
{
    public int Id { get; set; }
    public int CountryId { get; set; }
    public string Name { get; set; } = default!;
}
