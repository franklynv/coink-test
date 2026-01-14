using Coink.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Coink.Api.Controllers;

[ApiController]
[Route("api/locations")]
public class LocationsController : ControllerBase
{
    private readonly LocationService _service;

    public LocationsController(LocationService service)
    {
        _service = service;
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var data = await _service.GetCountriesAsync();
        return Ok(data);
    }

    [HttpGet("departments/{countryId}")]
    public async Task<IActionResult> GetDepartments(int countryId)
    {
        var data = await _service.GetDepartmentsAsync(countryId);
        return Ok(data);
    }

    [HttpGet("municipalities/{departmentId}")]
    public async Task<IActionResult> GetMunicipalities(int departmentId)
    {
        var data = await _service.GetMunicipalitiesAsync(departmentId);
        return Ok(data);
    }
}
