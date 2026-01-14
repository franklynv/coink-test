using Coink.Domain.Entities;

namespace Coink.Application.Interfaces;

public interface ILocationRepository
{
    Task<IEnumerable<Country>> GetCountriesAsync();
    Task<IEnumerable<Department>> GetDepartmentsAsync(int countryId);
    Task<IEnumerable<Municipality>> GetMunicipalitiesAsync(int departmentId);
}
