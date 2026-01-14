using Coink.Application.DTOs;
using Coink.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Coink.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserService _service;

    public UsersController(UserService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateUserRequest request)
    {
        try
        {
            await _service.CreateUserAsync(request);
            return Ok(new { message = "User created successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
