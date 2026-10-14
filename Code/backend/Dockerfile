# =========================================================================
# Multi-stage Dockerfile for AquaBophelo ASP.NET Core 10 Web API
# =========================================================================

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["AquaBophelo/AquaBophelo.csproj", "AquaBophelo/"]
RUN dotnet restore "AquaBophelo/AquaBophelo.csproj"

# Copy source and publish
COPY AquaBophelo/ AquaBophelo/
WORKDIR "/src/AquaBophelo"
RUN dotnet publish "AquaBophelo.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Create non-root user and set permissions
COPY --from=build /app/publish .
USER $APP_UID

ENTRYPOINT ["dotnet", "AquaBophelo.dll"]
