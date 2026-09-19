using Microsoft.AspNetCore.SignalR;

namespace AquaBophelo.Hubs;

public class PingHub : Hub
{
    public string Ping()
    {
        return $"pong {DateTime.UtcNow:o}";
    }
}
