# Water Level Alert & Notification Pipeline (ALERTS.md)

AquaBophelo automates municipal water monitoring by analyzing reservoir readings and dispatching multi-channel alerts (Email, SignalR, and Web Push). This document details threshold logic, alert deduplication, and the background email pipeline.

---

## 1. Dam Capacity Threshold Bands

When dam level readings are submitted to `POST /api/v1/dams/{id}/readings`, [`AlertEvaluator.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/backend/AquaBophelo/Services/AlertEvaluator.cs) calculates the capacity percentage and categorizes the reservoir:

| Capacity Band | Level Percentage | Alert Type | Severity | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Healthy** | $\ge 50.0\%$ | `None` | `None` | Reservoir operations normal. No automated alerts triggered. |
| **Watch** | $30.0\% - 49.9\%$ | `DamWatch` | `Info` | Water levels dropping below half capacity. Public monitoring advised. |
| **Warning** | $15.0\% - 29.9\%$ | `DamLow` | `Warning` | Storage low. Voluntary water restriction notices sent to residents. |
| **Critical** | $< 15.0\%$ | `DamCritical` | `Critical` | Emergency drought level. Level 4 restrictions enforced; Tanker dispatches prioritized. |

---

## 2. State-Transition Deduplication Rule

To prevent spamming residents with dozens of duplicate emails when multiple readings are logged within the same band:

> **Core Rule:** An automated alert and notification are **only** dispatched when the dam's capacity **transitions between bands** (e.g., `Healthy` $\to$ `Watch`, `Watch` $\to$ `Warning`, or `Warning` $\to$ `Critical`).

```csharp
// AlertEvaluator.cs logic
if (previousStateCategory == currentStateCategory)
{
    _logger.LogInformation("Dam level remains in '{State}' band. Skipping duplicate alert dispatch.", currentStateCategory);
    return; // No duplicate emails dispatched
}
```

* **Transition Example:** If Riverton Weir drops from 52% to 48%, it moves from `Healthy` to `Watch` $\to$ Alert created & dispatched.
* **Repetition Example:** If the next 5 hourly readings are 47.8%, 47.5%, 47.2%, 47.0%, the state remains `Watch` $\to$ Readings are saved, but duplicate emails are suppressed.

---

## 3. Asynchronous Email Queue Pipeline

To keep HTTP requests sub-second and resilient against email provider latency or outages:

```mermaid
flowchart LR
    A[Dam Reading Logged] --> B[AlertEvaluator]
    B --> C[Alert Created in DB]
    C --> D[IEmailQueue.EnqueueAsync]
    D --> E[EmailQueue MemoryChannel]
    E --> F[EmailQueueBackgroundService]
    F --> G{Sent Today >= 300?}
    G -- Yes & Non-Critical -->> H[Skip to preserve quota]
    G -- No or Critical -->> I[Brevo API POST /v3/smtp/email]
```

### Key Queue Characteristics:
1. **Decoupled:** Dam reading API requests return immediately (`200 OK`) without waiting for Brevo network latency.
2. **Channel-based:** Uses .NET `System.Threading.Channels.Channel<EmailWorkItem>` with unbounded queue capacity.
3. **Resilient Loop:** Background service catches individual send errors, logs them to Sentry/Serilog, and continues processing subsequent items.

---

## 4. Brevo Daily Quota & Cost Protection

AquaBophelo operates on Brevo's free tier with a 300-email/day limit. [`EmailQueueBackgroundService.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/backend/AquaBophelo/Services/Notifications/EmailQueueBackgroundService.cs) protects this budget:

* **Daily Limit:** 300 emails per UTC calendar day.
* **Warning Threshold:** At 250 emails, a warning log is generated.
* **Triage Mode:** Once 300 emails are sent in a single day, the worker **only** delivers `Priority == "Critical"` messages. Standard informational digests are safely deferred or skipped.

---

## 5. Web Push Notification Channel (FCM)

For `Critical` (Red) alerts:
* In addition to email dispatches, [`AlertEvaluator.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/backend/AquaBophelo/Services/AlertEvaluator.cs) triggers `FirebasePushNotificationService.SendPushNotificationToAllAsync(...)`.
* Dispatches background push notifications directly to subscribed devices using Google Firebase Cloud Messaging (FCM).
* External push errors are wrapped in non-fatal try/catch handlers, ensuring that an FCM network timeout never fails dam reading persistence.
