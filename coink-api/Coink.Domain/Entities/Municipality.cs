namespace Coink.Domain.Entities;

public class Municipality
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string Name { get; set; } = default!;
}
