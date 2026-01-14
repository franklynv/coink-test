FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Coink.Api/Coink.Api.csproj", "Coink.Api/"]
COPY ["Coink.Application/Coink.Application.csproj", "Coink.Application/"]
COPY ["Coink.Domain/Coink.Domain.csproj", "Coink.Domain/"]
COPY ["Coink.Infrastructure/Coink.Infrastructure.csproj", "Coink.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Coink.Api/Coink.Api.csproj"

# Copy all source code
COPY . .

# Build
WORKDIR "/src/Coink.Api"
RUN dotnet build "Coink.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Coink.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Coink.Api.dll"]
