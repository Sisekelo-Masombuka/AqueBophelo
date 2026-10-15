using System.Threading.Channels;

namespace AquaBophelo.Services.Notifications;

public interface IEmailQueue
{
    void EnqueueEmail(EmailWorkItem item);
    ValueTask<EmailWorkItem> DequeueAsync(CancellationToken cancellationToken);
    int GetDailySentCount();
    void RecordEmailSent();
    bool IsOperational { get; }
}

public class EmailQueue : IEmailQueue
{
    private readonly Channel<EmailWorkItem> _channel;
    private int _dailySentCount = 0;
    private DateTime _lastResetDate = DateTime.UtcNow.Date;
    private readonly object _counterLock = new();

    public bool IsOperational => !_channel.Reader.Completion.IsCompleted;

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
