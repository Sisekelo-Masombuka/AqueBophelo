# AquaBophelo — Production Deployment & Operations Runbook

This guide details the deployment architecture, configuration lifecycle gates, step-by-step deployment procedures, and smoke test verification for **AquaBophelo (Sol Plaatje Local Municipality Water Management System)**.

---

## 1. Architecture Overview

- **Frontend:** React 19 + Vite SPA with Tailwind CSS, Leaflet / SVG Kimberley interactive map, and SignalR real-time WebSocket client. Deployed to static edge hosting (Azure Static Web Apps, Cloudflare Pages, or Vercel).
- **Backend:** ASP.NET Core 10 Web API with EF Core, ASP.NET Core Identity, SignalR Hubs (`/hubs/trucks`), and Rate Limiting. Deployed to Azure App Service (Linux Docker container) or containerized Linux VM.
- **Database:** Azure SQL Database / Microsoft SQL Server 2022 with automatic indexing and TLS encryption.
- **Object Storage:** Cloudflare R2 for citizen fault report photos and driver delivery proof images.
- **Notifications:** Brevo Transactional Email (OTP and alerts) and Firebase Cloud Messaging (Web push).

---

## 2. Database Lifecycle Configuration Gates

AquaBophelo provides explicit environment variables to control database schema migration and data seeding at startup:

### A. `MIGRATE_ON_START`
- **Options:** `true` | `false`
- **Default:** `false` in production, `true` in development.
- **Recommended Production Practice:** In multi-instance or auto-scaling production environments, keep `MIGRATE_ON_START=false`. Run schema migrations as a dedicated step in your CI/CD deployment pipeline or release task:
  ```bash
  dotnet ef database update --project Code/backend/AquaBophelo --connection "$PRODUCTION_SQL_CONNECTION"
  ```
  This prevents database lock contention or race conditions when multiple API replicas start simultaneously.

### B. `SEED_DATABASE`
- **Options:** `true` | `false`
- **Default:** `false` in production, `true` in development.
- **Recommended Production Practice:**
  - Set to `true` **only once** on initial deployment to provision municipal reference areas (Galeshewe, Kimberley Central, Roodepan, etc.) and initial delivery corridors.
  - Set to `false` for steady-state production runtime.

### C. `PURGE_DEMO_DATA`
- **Options:** `false` (Strictly enforced)
- **Safety Gate:** This flag is hard-gated in `DbSeeder.cs` to only run when `app.Environment.IsDevelopment()` is true. It is **permanently disabled in production** to prevent accidental record removal.

---

## 3. Deployment Procedure

### Option A: Azure App Service (Recommended)

1. **Build and Tag Container Images:**
   ```bash
   docker build -f Code/backend/Dockerfile -t aquabophelo-api:latest Code/backend
   docker tag aquabophelo-api:latest myregistry.azurecr.io/aquabophelo-api:latest
   docker push myregistry.azurecr.io/aquabophelo-api:latest
   ```

2. **Run Schema Migration Task (Release Gate):**
   ```bash
   dotnet ef database update --project Code/backend/AquaBophelo
   ```

3. **Deploy Container to App Service:**
   ```bash
   az webapp config container set \
     --name "aquabophelo-api" \
     --resource-group "rg-aquabophelo" \
     --docker-custom-image-name "myregistry.azurecr.io/aquabophelo-api:latest"
   ```

4. **Deploy Frontend SPA:**
   ```bash
   cd Code/frontend
   npm ci
   npm run build
   # Deploy dist/ folder to Azure Static Web Apps or Cloudflare Pages
   ```

### Option B: Local / Staging Docker Compose

1. Copy `.env.example` to `.env` and fill in local passwords:
   ```bash
   cp .env.example .env
   ```
2. Launch stack:
   ```bash
   docker compose -f docker-compose.dev.yml up -d --build
   ```

---

## 4. Post-Deployment Smoke Tests & Verification

Execute these verification checks immediately after deployment:

### 1. API Liveness Probe
```bash
curl -f -s https://api.aquabophelo.app/health/live | grep -q "healthy" && echo "Liveness: PASS" || echo "Liveness: FAIL"
```

### 2. Database Connection Readiness Probe
```bash
curl -f -s https://api.aquabophelo.app/health/ready | grep -q "connected" && echo "Readiness: PASS" || echo "Readiness: FAIL"
```

### 3. Security Headers Check
```bash
curl -I https://api.aquabophelo.app/api/v1/health | grep -E "Strict-Transport-Security|X-Content-Type-Options|X-Frame-Options"
```
*Expected: All 3 headers present.*

### 4. CORS Enforcement Check
```bash
# Verify allowed origin receives Access-Control-Allow-Origin header
curl -I -H "Origin: https://aquabophelo.app" https://api.aquabophelo.app/api/v1/dams | grep -i "Access-Control-Allow-Origin"

# Verify disallowed origin does NOT receive allow header
curl -I -H "Origin: https://malicious-site.com" https://api.aquabophelo.app/api/v1/dams | grep -i "Access-Control-Allow-Origin"
```

### 5. SignalR Hub Handshake Check
Test WebSocket negotiation endpoint for `/hubs/trucks`:
```bash
curl -X POST https://api.aquabophelo.app/hubs/trucks/negotiate?negotiateVersion=1
```
*Expected: HTTP 200 with connectionId and available transports.*

### 6. Citizen Registration & Brevo OTP Flow
1. Navigate to `https://aquabophelo.app/register`.
2. Register with a test citizen email.
3. Confirm an email OTP is received in the inbox (from `alerts@aquabophelo.app`).
4. Enter code and verify registration success.

### 7. Role-Based Access Control (RBAC) Enforcement
Verify that resident credentials cannot invoke administrative endpoints:
```bash
# Resident attempting to create a municipal zone (must return HTTP 403 Forbidden)
curl -i -X POST https://api.aquabophelo.app/api/v1/areas \
  -H "Authorization: Bearer <RESIDENT_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Unauthorized Area"}' | grep -E "403 Forbidden|Access denied"
```

### 8. Incident Reporting & Cloudflare R2 Verification
Submit a test water leak report with an image and confirm that magic-byte validation and R2 object storage succeed:
```bash
curl -i -X POST https://api.aquabophelo.app/api/v1/reports \
  -H "Authorization: Bearer <RESIDENT_JWT>" \
  -F "title=Test Pipe Leak Smoke Test" \
  -F "description=Verification of R2 image upload pipeline" \
  -F "category=Leak" \
  -F "areaId=<VALID_AREA_ID>" \
  -F "image=@test_sample.jpg" | grep -E "201 Created|reportId"
```
