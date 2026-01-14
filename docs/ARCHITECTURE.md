# 🏗️ Documentación de Arquitectura

## Visión General

El sistema sigue los principios de **Clean Architecture** y **Domain-Driven Design (DDD)**, con separación de responsabilidades y código mantenible.

---

## Capas de la Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                   (Coink.Api - Controllers)                  │
│  - Recibe requests HTTP                                      │
│  - Valida entrada básica                                     │
│  - Retorna responses HTTP                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│            (Coink.Application - Services, DTOs)              │
│  - Lógica de negocio                                         │
│  - Validaciones complejas                                    │
│  - Orquestación de operaciones                               │
│  - Transformación de datos (DTOs)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                              │
│              (Coink.Domain - Entities)                       │
│  - Entidades del negocio                                     │
│  - Reglas de dominio                                         │
│  - Sin dependencias externas                                 │
└─────────────────────────────────────────────────────────────┘
                         ▲
                         │
┌────────────────────────┴────────────────────────────────────┐
│                 Infrastructure Layer                         │
│        (Coink.Infrastructure - Repositories, DB)             │
│  - Acceso a datos (Dapper)                                   │
│  - Implementación de repositorios                            │
│  - Conexión a PostgreSQL                                     │
│  - Ejecución de Stored Procedures                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Patrones de Diseño Implementados

### 1. Repository Pattern

Abstrae el acceso a datos y desacopla la lógica de negocio de la infraestructura.

```csharp
// Interface (Application Layer)
public interface IUserRepository
{
    Task CreateUserAsync(User user);
}

// Implementation (Infrastructure Layer)
public class UserRepository : IUserRepository
{
    private readonly DbConnectionFactory _factory;
    
    public async Task CreateUserAsync(User user)
    {
        // Implementación con Dapper y Stored Procedures
    }
}
```

---

### 2. Dependency Injection (IoC)

Inversión de control para desacoplar componentes.

```csharp
// Program.cs
builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();
```

---

### 3. DTO (Data Transfer Object)

Transfiere datos entre capas sin exponer entidades del dominio.

```csharp
public class CreateUserRequest
{
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public int CountryId { get; set; }
    public int DepartmentId { get; set; }
    public int MunicipalityId { get; set; }
}
```

---

### 4. Factory Pattern

Crea objetos de conexión a BD de manera centralizada.

```csharp
public class DbConnectionFactory
{
    private readonly string _connectionString;
    
    public IDbConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }
}
```

---

### 5. Service Layer Pattern

Encapsula lógica de negocio y orquesta operaciones.

```csharp
public class UserService
{
    private readonly IUserRepository _repository;
    
    public async Task CreateUserAsync(CreateUserRequest request)
    {
        // Validaciones de negocio
        // Transformación de DTOs a entidades
        // Llamada al repositorio
    }
}
```

---

## Flujo de Datos

### Creación de Usuario

```
1. Frontend (React)
   ↓ HTTP POST /api/users
   
2. Controller (UsersController)
   ↓ Recibe CreateUserRequest
   
3. Service (UserService)
   ↓ Valida datos de negocio
   ↓ Transforma DTO → Entity
   
4. Repository (UserRepository)
   ↓ Ejecuta Stored Procedure
   
5. Database (PostgreSQL)
   ↓ sp_create_user()
   ↓ Valida integridad referencial
   ↓ INSERT INTO app_user
   
6. Response
   ↑ Success/Error
```

---

## Seguridad

### Validaciones en Múltiples Capas

1. **Frontend:** Validación de formato y campos requeridos
2. **API:** Validación de tipos y estructura
3. **Service:** Validación de reglas de negocio
4. **Stored Procedure:** Validación de integridad referencial

### Prevención de SQL Injection

- Uso de parámetros tipados en Dapper
- Stored Procedures con parámetros
- No concatenación de strings SQL

### CORS

- Configurado para permitir solo orígenes específicos
- Headers de seguridad en Nginx

---

## Tecnologías y Justificación

| Tecnología | Justificación |
|------------|---------------|
| .NET 8 | Framework moderno, alto rendimiento, multiplataforma |
| Dapper | Micro-ORM ligero, control sobre SQL, alto rendimiento |
| PostgreSQL | Base de datos robusta, ACID, stored procedures |
| React | Librería popular, componentes reutilizables |
| TypeScript | Type safety, mejor experiencia de desarrollo |
| Tailwind CSS | Utility-first, responsive, customizable |
| Docker | Portabilidad, consistencia entre entornos |
