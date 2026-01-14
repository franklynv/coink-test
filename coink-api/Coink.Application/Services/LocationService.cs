using Coink.Application.Interfaces;
using Coink.Domain.Entities;

namespace Coink.Application.Services;

public class LocationService
{
    private readonly ILocationRepository _repository;

    public LocationService(ILocationRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<Country>> GetCountriesAsync() =>
        _repository.GetCountriesAsync();

    public Task<IEnumerable<Department>> GetDepartmentsAsync(int countryId) =>
        _repository.GetDepartmentsAsync(countryId);

    public Task<IEnumerable<Municipality>> GetMunicipalitiesAsync(int departmentId) =>
        _repository.GetMunicipalitiesAsync(departmentId);
}
