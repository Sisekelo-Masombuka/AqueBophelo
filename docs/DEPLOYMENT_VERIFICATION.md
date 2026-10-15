# AquaBophelo — Production Deployment & Live Verification Runbook

This runbook provides step-by-step verification commands, curl probes, and validation checklists to confirm that the deployed production system (**https://aquabophelo.app** and **https://api.aquabophelo.app**) is fully functional, secure, and resilient.

## 0. Architecture: CI Testing vs. Live Production Verification

AquaBophelo employs a two-tier verification strategy to prevent false confidence while protecting production data:

1. **Tier 1: Pre-Merge CI Smoke Testing (`.github/workflows/ci.yml`)**
   - Runs automatically on every pull request and push to `main`.
   - Spins up a disposable Microsoft SQL Server 2022 service container.
   - Launches the built API at `http://127.0.0.1:5094` in the runner.
   - Executes `./scripts/deployment-smoke-tests.sh` to prove that the compiled binaries, ASP.NET Core routing, Entity Framework Core migrations, security headers, CORS preflight, and SignalR negotiation function correctly before anything is deployed.

2. **Tier 2: Post-Deployment Production Verification (`.github/workflows/production-verification.yml`)**
   - Triggered after deployment to Azure App Service, Kubernetes, or cloud VPS.
   - Can be triggered manually with **one click** under the **Actions** tab on GitHub:
     - Select **Live Production & Staging Verification** -> Click **Run workflow**.
     - Enter target URL (e.g. `https://api.aquabophelo.app` or `https://<app-name>.azurewebsites.net`).
   - Executes both:
     - `./scripts/deployment-smoke-tests.sh` (Health, readiness, headers, CORS, SignalR, auth gates).
     - `./scripts/verify-e2e-workflows.sh` (Resident dam telemetry, area discovery, alert feed, Brevo OTP dispatch pipeline, and admin analytics summary).
   - **Non-Destructive Guarantee:** Strictly read-only checks; does not create fake accounts, modify database records, or trigger destructive operations on live resident data.

---

## 1. Automated Deployment Smoke Test (CLI Commands)

Run the automated smoke test script immediately after deployment or container restart to execute all checks sequentially:

**PowerShell (Windows / Azure Cloud Shell):**
```powershell
./scripts/deployment-smoke-tests.ps1 -BaseUrl "https://api.aquabophelo.app"
```

**Bash / Linux / macOS / cURL:**
```bash
chmod +x ./scripts/deployment-smoke-tests.sh
./scripts/deployment-smoke-tests.sh "https://api.aquabophelo.app"
```

The script automatically executes:
- [x] Liveness probe (`GET /health/live`)
- [x] Database & Email Queue readiness probe (`GET /health/ready`)
- [x] Controller diagnostics (`GET /api/v1/health`)
- [x] Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)
- [x] CORS preflight headers (`OPTIONS /api/v1/auth/login`)
- [x] SignalR Ping hub negotiation (`POST /hubs/ping/negotiate`)
- [x] SignalR Fleet telemetry auth gate (`POST /hubs/trucks/negotiate` -> 401)
- [x] Security gate: rejection of unauthenticated requests (`GET /api/v1/subscriptions` -> 401)
- [x] Security gate: rejection of unauthenticated fleet modification (`POST /api/v1/trucks` -> 401)
- [x] Security gate: rejection of invalid credentials (`POST /api/v1/auth/login` -> 400/401)

---

## 1. Automated Health & Container Readiness Probes

Run these commands against your production domain (`https://api.aquabophelo.app`) or internal container IP:

### A. Top-Level Liveness Probe
```bash
curl -i https://api.aquabophelo.app/health/live
```
**Expected Response:** HTTP 200 OK
```json
{
  "status": "healthy",
  "timestamp": "2026-10-14T19:30:00Z"
}
```

### B. Database Readiness Probe (Active SQL Connection Check)
```bash
curl -i https://api.aquabophelo.app/health/ready
```
**Expected Response:** HTTP 200 OK
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-10-14T19:30:00Z"
}
```
*(If the database cannot be reached, it returns HTTP 503 Service Unavailable)*

### C. Detailed API Diagnostics
```bash
curl -i https://api.aquabophelo.app/api/v1/health
```
**Expected Response:** HTTP 200 OK with `service: "AquaBophelo API"`, `environment: "Production"`.

---

## 2. Security Headers & TLS Verification

Inspect HTTP headers returned by the production API:
```bash
curl -I https://api.aquabophelo.app/api/v1/health
```
**Required Security Headers Checklist:**
- [x] `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- [x] `X-Content-Type-Options: nosniff`
- [x] `X-Frame-Options: DENY`
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `X-Permitted-Cross-Domain-Policies: none`

---

## 3. Database Schema Migration Verification

1. On initial deployment, ensure `MIGRATE_ON_START=true` is set in your Azure App Service Application Settings.
2. Confirm EF Core migrations applied cleanly via Azure App Service Log Stream:
   ```
   [Information] Applying migration '20261012153000_InitialCreate'
   [Information] Successfully applied database migrations.
   ```
3. To test with reference data on first run: set `SEED_DATABASE=true`.
4. After initial setup, set `SEED_DATABASE=false` in Azure Application Settings.

---

## 4. Brevo Transactional Email & OTP Verification

Verify outgoing citizen email delivery and Brevo API connectivity:
1. Obtain an admin JWT token (see Step 5).
2. Execute the test email dispatch endpoint:
```bash
curl -X POST "https://api.aquabophelo.app/api/v1/health/test-email?toEmail=your-email@aquabophelo.app" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```
**Expected Response:**
```json
{
  "success": true,
  "recipient": "your-email@aquabophelo.app",
  "message": "Email sent via Brevo API!"
}
```
3. Check your inbox to confirm receipt of the branded HTML municipal test email.

---

## 5. Master Administrator Login & Immediate Password Rotation

1. Open `https://aquabophelo.app/login` in your web browser.
2. Enter:
   - **Email:** `admin@aquabophelo.app`
   - **Password:** `<The password configured in ADMIN_INITIAL_PASSWORD>`
   - Complete the Turnstile bot verification check.
3. Upon first sign-in:
   - Navigate to **Profile** (top right avatar / sidebar).
   - Enter your current initial password and set a new, high-entropy administrative password.
   - Click **Update Password**.

---

## 6. Resident Registration & Verification Gate Verification

Test that unverified registrations are strictly barred from obtaining valid sessions:

### Test Case A: Registering Without Verification
```bash
curl -X POST https://api.aquabophelo.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Resident",
    "email": "test.resident@gmail.com",
    "password": "StrongPassword123!",
    "areaName": "Galeshewe",
    "phoneNumber": "0821234567"
  }'
```
**Expected Behavior:**
- HTTP 200 OK returned.
- `token` is empty string (`""`).
- `message`: `"Registration successful. Please verify your email with the 6-digit verification code sent to your inbox before signing in."`
- The account has `EmailConfirmed = false`.

### Test Case B: Attempting Login With Unverified Account
```bash
curl -X POST https://api.aquabophelo.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.resident@gmail.com",
    "password": "StrongPassword123!"
  }'
```
**Expected Behavior:**
- HTTP 400 Bad Request returned.
- `message`: `"Please verify your email address before signing in. Check your inbox for your 6-digit verification code."`

---

## 7. Real-time SignalR WebSocket Tanker Telemetry Handshake

Verify that `/hubs/trucks` requires authentication and broadcasts live GPS coordinates:

### Test Case A: Anonymous Connection Rejected
Connect to `wss://api.aquabophelo.app/hubs/trucks` without an `access_token` query parameter.
**Expected Result:** HTTP 401 Unauthorized (WebSocket handshake failed).

### Test Case B: Authenticated Resident Connection
Connect with `wss://api.aquabophelo.app/hubs/trucks?access_token=<RESIDENT_JWT_TOKEN>`.
**Expected Result:** Handshake succeeds (HTTP 101 Switching Protocols), connection automatically enrolled in `public-fleet` group.

---

## 8. Sentry APM Error Tracking Verification

Test exception monitoring and crash reporting in development/staging:
```bash
curl -X GET https://api.aquabophelo.app/api/v1/health/test-sentry \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```
Log into your Sentry.io dashboard -> **Issues** to confirm the exception was ingested with stack trace, release version, and environment tags.
