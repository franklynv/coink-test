namespace Coink.Domain.Entities;

public class Country
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string IsoCode { get; set; } = default!;
}
