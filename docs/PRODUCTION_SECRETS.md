# AquaBophelo — Production Secrets & Configuration Checklist

This document provides a comprehensive operational guide and security checklist for provisioning production secrets, credentials, and cloud service integrations for **AquaBophelo (Sol Plaatje Local Municipality Water Management System)**.

---

## 1. Production Secrets Matrix & Verification Checklist

| Configuration Key | Service / Subsystem | Required Format / Entropy | Description & Generation Command | Rotation Cycle |
| :--- | :--- | :--- | :--- | :--- |
| **`ConnectionStrings:DefaultConnection`** | Azure SQL / SQL Server | Full connection string with SSL/TLS enabled (`Encrypt=True`) | Production database connection string with least-privilege credentials. Ensure server firewall permits Azure App Service outbound IPs. | 90–180 days |
| **`Jwt:Key`** | ASP.NET Core Identity / JWT | 64+ character random string (256-bit+ HMAC-SHA256) | Token signing key. Generate via: `openssl rand -base64 48` or `[Convert]::ToBase64String((1..48 \| ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))` | 90 days |
| **`Jwt:Issuer`** | JWT Authentication | URI or alphanumeric string | Set to `AquaBopheloAPI` or `https://api.aquabophelo.app`. Must match between API issuing and validation. | Static |
| **`Jwt:Audience`** | JWT Authentication | URI or alphanumeric string | Set to `AquaBopheloClient` or `https://aquabophelo.app`. Must match client identity. | Static |
| **`ADMIN_INITIAL_PASSWORD`** | ASP.NET Core Identity | Strong password (12+ chars, uppercase, lowercase, numbers, symbol) | Password provisioned for `admin@aquabophelo.app` upon initial seeding. Rotated via Control Center profile after setup. | Immediate upon first login |
| **`SEED_DATABASE`** | Database Lifecycle | Boolean (`true` / `false`) | Set to `true` on very first deployment to seed municipal areas and base fleet. Set to `false` for steady-state production runtime. | N/A |
| **`PURGE_DEMO_DATA`** | Seeder Protection | Boolean (`false` in production) | **Never enable in production.** Strictly guarded to development environments only. | Permanently `false` in prod |
| **`Brevo:ApiKey`** | Brevo Transactional Email | Format: `xkeysib-...` (64+ chars) | API key used for citizen email verification OTPs and water outage alerts. Provision in Brevo Dashboard -> SMTP & API Keys. | 90 days |
| **`Brevo:SenderEmail`** | Brevo Transactional Email | Verified email address | Set to `alerts@aquabophelo.app`. Domain DNS SPF/DKIM records must be verified in Brevo. | Static |
| **`R2:AccountId`** | Cloudflare R2 | 32-character hex string | Cloudflare account ID hosting citizen pipe leak and driver proof-of-delivery photos. | Static |
| **`R2:AccessKeyId`** | Cloudflare R2 | 32-character hex S3 key | S3-compatible API token created in Cloudflare R2 API Tokens with Object Read & Write scope. | 180 days |
| **`R2:SecretAccessKey`** | Cloudflare R2 | 64-character hex string | Secret access key corresponding to `R2:AccessKeyId`. | 180 days |
| **`R2:BucketName`** | Cloudflare R2 | Lowercase bucket identifier | Set to `aquabophelo-reports`. | Static |
| **`R2:PublicDomain`** | Cloudflare R2 / Custom Domain | HTTPS URL | Set to `https://media.aquabophelo.app` or R2 public bucket URL. | Static |
| **`Turnstile:SecretKey`** | Cloudflare Turnstile | Format: `0x4AAAAAA...` (Secret key) | Server-side validation secret for CAPTCHA bot protection during citizen registration and login. | On compromise |
| **`Sentry:Dsn`** | Sentry APM | Format: `https://...` (Client DSN) | Application performance monitoring and crash tracking for backend API exceptions. | Static |
| **`Firebase:ServiceAccountPath`** | Firebase Cloud Messaging | Path to JSON key file | File path or secret reference for Google Cloud / Firebase Admin SDK web push notification dispatch. | Annual |

---

## 2. Frontend Production Environment Variables (`Code/frontend/.env.production`)

Create `.env.production` during the build pipeline (or configure environment variables in Vercel / Netlify / Azure Static Web Apps):

```env
# Backend API & WebSocket Endpoint
VITE_API_BASE_URL=https://api.aquabophelo.app
VITE_SIGNALR_URL=https://api.aquabophelo.app/hubs/trucks

# Cloudflare Turnstile (Public Client Site Key)
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAYourTurnstilePublicSiteKey

# Sentry Frontend Crash Reporting
VITE_SENTRY_DSN=https://your-frontend-sentry-dsn@o0.ingest.sentry.io/0

# Firebase Web Push Notification Client Config
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
VITE_FIREBASE_PROJECT_ID=aquabophelo-notifications
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=1:your-sender-id:web:your-app-id
VITE_FIREBASE_VAPID_KEY=your-firebase-web-push-vapid-key
```

---

## 3. Production Deployment Security Steps

### Step 1: Azure App Service Configuration
1. Open the **Azure Portal** -> Select your **App Service** (`aquabophelo-api`).
2. Navigate to **Configuration** -> **Application settings**.
3. Add the settings using the `__` (double underscore) hierarchy syntax for .NET configuration:
   - `ConnectionStrings__DefaultConnection` = `<secure-azure-sql-connection-string>`
   - `Jwt__Key` = `<generated-64-char-secret>`
   - `Jwt__Issuer` = `AquaBopheloAPI`
   - `Jwt__Audience` = `AquaBopheloClient`
   - `ADMIN_EMAIL` = `admin@aquabophelo.app`
   - `ADMIN_INITIAL_PASSWORD` = `<secure-initial-password>`
   - `SEED_DATABASE` = `true` *(set to `false` after initial database provision)*
   - `Brevo__ApiKey` = `<your-brevo-key>`
   - `Brevo__SenderEmail` = `alerts@aquabophelo.app`
   - `R2__AccountId` = `<your-cloudflare-account-id>`
   - `R2__AccessKeyId` = `<your-r2-access-key>`
   - `R2__SecretAccessKey` = `<your-r2-secret-key>`
   - `R2__BucketName` = `aquabophelo-reports`
   - `R2__PublicDomain` = `https://media.aquabophelo.app`
   - `Turnstile__SecretKey` = `<your-turnstile-secret>`
   - `Sentry__Dsn` = `<your-backend-sentry-dsn>`
   - `Cors__AllowedOrigins__0` = `https://aquabophelo.app`
   - `Cors__AllowedOrigins__1` = `https://www.aquabophelo.app`
4. Click **Save** and restart the App Service.

### Step 2: First-Time Initialization & Admin Password Rotation
1. Deploy the API with `SEED_DATABASE=true`.
2. Inspect the startup log via Azure App Service Log Stream to confirm:
   - EF Core migrations applied cleanly.
   - Reference data (municipal areas, reservoirs, trucks) seeded.
   - Master admin `admin@aquabophelo.app` provisioned.
3. Immediately log into `https://aquabophelo.app/login` with `admin@aquabophelo.app`.
4. Go to **Admin Profile** -> **Change Password** and update the administrator password.
5. In Azure Application settings, set `SEED_DATABASE=false` to prevent unnecessary seeding passes on future restarts.

---

## 4. Verification & Testing Checklist

- [ ] **No Hardcoded Passwords:** Verify that no default fallback password is in production code or checked-in repository documentation.
- [ ] **SignalR Authorization:** Verify that unauthenticated WebSocket connections to `/hubs/trucks` receive HTTP 401 Unauthorized.
- [ ] **Email Verification Gate:** Verify that registering an account without OTP verification does NOT issue a JWT token.
- [ ] **No Destructive Seeding:** Verify that running migrations or seeding in production does not delete or purge any existing user records, trips, or tickets.
- [ ] **CORS Security:** Verify that only `https://aquabophelo.app` and `https://www.aquabophelo.app` are allowed by CORS policies.
