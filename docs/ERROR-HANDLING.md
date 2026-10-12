# Global Error Handling & Resilience (ERROR-HANDLING.md)

This document describes how AquaBophelo captures, sanitizes, and communicates errors across the backend API and frontend React SPA.

---

## 1. Backend: RFC 7807 ProblemDetails Standard

All uncaught backend exceptions are intercepted by `app.UseExceptionHandler()` in [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/backend/AquaBophelo/Program.cs). The application returns standardized `application/problem+json` envelopes and never exposes raw stack traces, database schema details, or server directory paths.

### Standard ProblemDetails Envelope:
```json
{
  "type": "https://httpstatuses.io/400",
  "title": "Bad Request",
  "status": 400,
  "detail": "An account with this email address already exists. Please sign in instead.",
  "instance": "/api/v1/auth/register",
  "timestamp": "2026-10-12T13:20:00Z"
}
```

### HTTP Status Code Mapping:
| HTTP Status | Trigger Condition | Example Detail |
| :--- | :--- | :--- |
| **`400 Bad Request`** | Input validation failure or business rule rejection (`BadHttpRequestException`). | *"Selected image exceeds the 5 MB limit."* |
| **`401 Unauthorized`** | Missing or expired JWT Bearer token (`UnauthorizedAccessException`). | *"You are not authorized to perform this action."* |
| **`403 Forbidden`** | Authenticated user lacks required municipal role. | Handled by ASP.NET Identity policy engine. |
| **`404 Not Found`** | Requested entity ID does not exist (`KeyNotFoundException`). | *"The requested resource was not found."* |
| **`429 Too Many Requests`** | Endpoint rate limiter exceeded (`AuthStrictPolicy`). | *"Too many requests. Please wait a moment before trying again."* |
| **`500 Internal Server Error`** | Unhandled exception or unexpected server crash. | *"An internal server error occurred while processing your request."* |

---

## 2. External Integration Fail-Safes

AquaBophelo integrates with several third-party cloud providers (Cloudflare R2, Brevo Email, Google Firebase). A temporary network glitch in an external service must never crash core business operations:

1. **Cloudflare R2 Storage (`R2StorageService.cs`):**
   * If R2 API credentials are missing in local development secrets, the service returns a safe local mock URL (`/pipe_leak.jpg`), allowing developers to test issue reporting without live cloud credentials.
2. **Brevo Email Delivery (`BrevoEmailSender.cs`):**
   * Email dispatches run asynchronously through the `EmailQueueBackgroundService`. If Brevo encounters an outage or timeout, the queue logs the incident without blocking the resident's HTTP request.
3. **Firebase Cloud Messaging (`AlertEvaluator.cs`):**
   * Push notifications are wrapped in try/catch blocks. If FCM fails, the reservoir dam reading and database alert are still saved successfully.

---

## 3. Frontend Error Handling & Network Failover

### Axios Network Interceptor (`client.js`)
* **Primary URL:** `http://localhost:5094`
* **Fallback URL:** `https://localhost:7154`
* **Automated Fallback:** If the browser experiences a network or certificate error (`ERR_NETWORK`) on HTTPS, the interceptor retries the request against the fallback endpoint.
* **Session Expiration:** If an API endpoint returns `401 Unauthorized` on an authenticated session, the interceptor purges `localStorage` and routes the user to `/login?expired=true`.

### Component Loading & Empty States
* Every data-driven view (`DamsPage.jsx`, `LiveTrucksPage.jsx`, `AlertsPage.jsx`, `AdminOverview.jsx`) implements three visual states:
  1. **Loading Skeleton:** Displays animated placeholders while data is in transit.
  2. **Empty State:** Uses [`EmptyState.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/frontend/src/components/EmptyState.jsx) with helpful instructions when no records are returned.
  3. **Error Banner:** Displays friendly messages with retry buttons if the network request fails.
