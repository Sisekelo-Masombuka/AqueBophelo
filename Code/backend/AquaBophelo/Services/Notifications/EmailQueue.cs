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

    int ConsecutiveFailureCount { get; }
    DateTime? LastSuccessfulDeliveryUtc { get; }
    DateTime? LastDeliveryFailureUtc { get; }
    string? LastDeliveryFailureReason { get; }
    bool IsDeliveryHealthy { get; }
    void RecordDeliverySuccess();
    void RecordDeliveryFailure(string reason);
    void ResetDeliveryFailures();
}

public class EmailQueue : IEmailQueue
{
    private readonly Channel<EmailWorkItem> _channel;
    private int _dailySentCount = 0;
    private DateTime _lastResetDate = DateTime.UtcNow.Date;
    private DateTime _lastHeartbeatUtc = DateTime.UtcNow;
    private int _consecutiveFailureCount = 0;
    private DateTime? _lastSuccessfulDeliveryUtc;
    private DateTime? _lastDeliveryFailureUtc;
    private string? _lastDeliveryFailureReason;
    private const int MaxConsecutiveFailures = 5;
    private readonly object _counterLock = new();

    public bool IsOperational => !_channel.Reader.Completion.IsCompleted;
    public DateTime LastHeartbeatUtc => _lastHeartbeatUtc;
    public int ConsecutiveFailureCount => _consecutiveFailureCount;
    public DateTime? LastSuccessfulDeliveryUtc => _lastSuccessfulDeliveryUtc;
    public DateTime? LastDeliveryFailureUtc => _lastDeliveryFailureUtc;
    public string? LastDeliveryFailureReason => _lastDeliveryFailureReason;
    public bool IsDeliveryHealthy => _consecutiveFailureCount < MaxConsecutiveFailures;
    public bool IsWorkerHealthy => IsOperational && (DateTime.UtcNow - _lastHeartbeatUtc) < TimeSpan.FromMinutes(2) && IsDeliveryHealthy;

    public void RecordHeartbeat(DateTime? timestamp = null)
    {
        _lastHeartbeatUtc = timestamp ?? DateTime.UtcNow;
    }

    public void RecordDeliverySuccess()
    {
        lock (_counterLock)
        {
            _consecutiveFailureCount = 0;
            _lastSuccessfulDeliveryUtc = DateTime.UtcNow;
            _lastDeliveryFailureReason = null;
        }
    }

    public void RecordDeliveryFailure(string reason)
    {
        lock (_counterLock)
        {
            _consecutiveFailureCount++;
            _lastDeliveryFailureUtc = DateTime.UtcNow;
            _lastDeliveryFailureReason = reason;
        }
    }

    public void ResetDeliveryFailures()
    {
        lock (_counterLock)
        {
            _consecutiveFailureCount = 0;
            _lastDeliveryFailureReason = null;
        }
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
