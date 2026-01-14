using Coink.Application.Interfaces;
using Coink.Application.Services;
using Coink.Infrastructure.Db;
using Coink.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:80", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Dependency Injection
builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ILocationRepository, LocationRepository>();
builder.Services.AddScoped<LocationService>();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
