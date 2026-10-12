# Municipal Security & POPIA Compliance Guide (SECURITY.md)

AquaBophelo is designed for Sol Plaatje Local Municipality. This document outlines the security architecture, threat model mitigations, and compliance with South Africa's **Protection of Personal Information Act (POPIA)**.

---

## 1. POPIA (Protection of Personal Information Act) Compliance

Under POPIA, municipal systems must ensure transparency, purpose specification, and security safeguards for all personally identifiable information (PII).

### Personal Data Stored in AquaBophelo:
* Full name
* Email address
* Contact telephone number
* Municipal residential area (e.g. Galeshewe, Kimberley Central)
* Water fault report descriptions and uploaded photos

### POPIA Safeguards Implemented:
1. **Lawful Processing & Purpose Specification:** Data is strictly collected for delivering potable water, alerting residents of shortages, and managing fault tickets.
2. **Data Minimization:** Unauthenticated visitors can submit anonymous water fault reports without entering their full name or phone number.
3. **Right to Deactivation / Soft-Delete:** Residents can request account deletion at any time via `DELETE /api/v1/auth/delete-account` using a verified email OTP.
4. **Record Retention & Grace Period:** Soft-deleted accounts enter a 30-day grace period (`ScheduledPermanentDeletionAt`), after which scheduled cleanup jobs scrub personal data while retaining anonymized statistical metrics.
5. **PII Scrubbing in Monitoring:** Sentry telemetry in [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/backend/AquaBophelo/Program.cs) scrubs `Authorization` tokens, `api-key` headers, and user secrets before crash logs leave the server.

---

## 2. Secrets Management & Environment Isolation

No credentials or API secrets are stored in Git repositories.

* **Development Secrets:** Configured via .NET User Secrets:
  ```bash
  dotnet user-secrets set "Jwt:Key" "SuperSecretKey123!..."
  dotnet user-secrets set "Brevo:ApiKey" "xkeysib-..."
  dotnet user-secrets set "R2:SecretAccessKey" "..."
  ```
* **Production Configuration:** Injected through host environment variables (Docker or Azure App Service App Settings).
* **Git Safeguards:** `.gitignore` includes `appsettings.Development.json`, `.env`, `node_modules/`, and build artifacts.

---

## 3. IDOR (Insecure Direct Object Reference) Protection

To prevent malicious users from altering or accessing other residents' records by changing integer IDs in URL paths:

* **Ownership Verification:** Every controller action that mutates or returns user-specific resources (`AlertSubscriptions`, `IssueReports`, `ApplicationUser` profiles) extracts the calling identity directly from the cryptographically verified JWT claims (`ClaimTypes.NameIdentifier`).
* **Example Protection:**
  ```csharp
  // SubscriptionsController.cs
  var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
  var sub = await _context.AlertSubscriptions
      .FirstOrDefaultAsync(s => s.Id == subscriptionId && s.UserId == userId);

  if (sub == null) return NotFound(); // Rejects attempts to delete another user's alert
  ```

---

## 4. File Upload Security (Cloudflare R2)

Fault ticket photos are validated before entering storage:
1. **File Size Capped at 5 MB:** Requests exceeding 5 MB are rejected with `400 Bad Request` on both the client modal and server endpoint.
2. **Strict MIME & Extension Whitelist:** Only `.jpg`, `.jpeg`, `.png`, `.webp`, and `.gif` files are accepted. Executables, scripts, and HTML files are strictly rejected.
3. **Randomized Object Keys:** Uploaded files are renamed using GUIDs (`reports/{guid}_{safeFileName}`), preventing directory traversal and filename collisions.
4. **Short-Lived Presigned URLs:** Presigned PUT URLs expire in 15 minutes.

---

## 5. Rate Limiting & Bot Prevention

* **Endpoint Rate Limiter (`AuthStrictPolicy`):** Limits authentication endpoints (`login`, `register`, `send-otp`, `upload-photo`) to 5 requests per 1-minute window per IP. Exceeding requests receive `429 Too Many Requests`.
* **Cloudflare Turnstile:** Server verifies the Turnstile challenge token against Cloudflare's verification API before processing registrations.

---

## 6. HTTP Security Headers

In [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/backend/AquaBophelo/Program.cs), custom middleware injects standard security headers onto all outgoing responses:

| Header | Value | Purpose |
| :--- | :--- | :--- |
| `X-Content-Type-Options` | `nosniff` | Prevents browser MIME-type sniffing attacks. |
| `X-Frame-Options` | `DENY` | Prevents clickjacking by disabling unauthorized iframe embedding. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Protects sensitive URL queries from leaking to external referrers. |
| `X-Permitted-Cross-Domain-Policies` | `none` | Blocks cross-domain policy files (Flash / Silverlight). |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforces HTTPS in production (`UseHsts()`). |
