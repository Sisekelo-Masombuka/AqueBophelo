using System.Threading.Channels;

namespace AquaBophelo.Services.Notifications;

public interface IEmailQueue
{
    void EnqueueEmail(EmailWorkItem item);
    ValueTask<EmailWorkItem> DequeueAsync(CancellationToken cancellationToken);
    int GetDailySentCount();
    void RecordEmailSent();
    void RecordHeartbeat(DateTime? timestamp = null);
    DateTime LastHeartbeatUtc { get; }
    bool IsOperational { get; }
    bool IsWorkerHealthy { get; }
}

public class EmailQueue : IEmailQueue
{
    private readonly Channel<EmailWorkItem> _channel;
    private int _dailySentCount = 0;
    private DateTime _lastResetDate = DateTime.UtcNow.Date;
    private DateTime _lastHeartbeatUtc = DateTime.UtcNow;
    private readonly object _counterLock = new();

    public bool IsOperational => !_channel.Reader.Completion.IsCompleted;
    public DateTime LastHeartbeatUtc => _lastHeartbeatUtc;
    public bool IsWorkerHealthy => IsOperational && (DateTime.UtcNow - _lastHeartbeatUtc) < TimeSpan.FromMinutes(2);

    public void RecordHeartbeat(DateTime? timestamp = null)
    {
        _lastHeartbeatUtc = timestamp ?? DateTime.UtcNow;
    }

    public EmailQueue()
    {
        var options = new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        };
        _channel = Channel.CreateUnbounded<EmailWorkItem>(options);
    }

    public void EnqueueEmail(EmailWorkItem item)
    {
        _channel.Writer.TryWrite(item);
    }

    public ValueTask<EmailWorkItem> DequeueAsync(CancellationToken cancellationToken)
    {
        return _channel.Reader.ReadAsync(cancellationToken);
    }

    public int GetDailySentCount()
    {
        lock (_counterLock)
        {
            CheckAndResetDailyCounter();
            return _dailySentCount;
        }
    }

    public void RecordEmailSent()
    {
        lock (_counterLock)
        {
            CheckAndResetDailyCounter();
            _dailySentCount++;
        }
    }

    private void CheckAndResetDailyCounter()
    {
        if (DateTime.UtcNow.Date > _lastResetDate)
        {
            _dailySentCount = 0;
            _lastResetDate = DateTime.UtcNow.Date;
        }
    }
}
