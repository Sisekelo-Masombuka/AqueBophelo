# AquaBophelo — Project Documentation

> Water Monitoring and Truck Tracking Web System for Sol Plaatje Municipality (Kimberley, Northern Cape, South Africa)
> Project code: PROJECT(20262FNPRT630) · Final-year capstone · Phase 4 (Implementation & Presentation) due **1 October 2026**

---

## 0. How to use this document (read first, AI agent)

This file is the single source of truth for the project. Read it fully before writing any code.

**Legend used throughout:**
- **[CONFIRMED]** – decided by the team / already built.
- **[PROPOSED]** – a sensible default written to fill a gap. Follow it unless the developer says otherwise, and flag when you deviate.
- **[OPEN]** – undecided. Ask the developer before building on it.

**Working rules for the agent:**
1. **Teach while building.** The backend developer (Cuba) wants to understand the *why* and *how* of every step. Explain the concept first (middleware, DI, EF Core migrations, JWT, SignalR groups, etc.), then show the implementation. Use short real-world analogies. Never dump large amounts of unexplained code.
2. **One small step at a time.** Build in vertical slices (model → DbContext → migration → controller → test in Scalar), and confirm each step works before moving on.
3. **Match the existing code style.** Controllers-based Web API, no top-level statements, no Docker, Visual Studio 2022 on Windows.
4. **Respect the South African context.** Mobile-first, low data usage, mixed and older devices, unreliable connectivity, local SMS providers.
5. **Never invent requirements.** If something is marked [OPEN], ask.
6. **Keep secrets out of source control.** Use user-secrets locally and environment variables / Azure App Settings in production.
7. **Know where you are.** This is a monorepo (see §3.2). Backend commands (`dotnet ...`, EF Core migrations) run from `backend/AquaBophelo/`. Frontend commands (`npm ...`) run from `frontend/`. Never create backend files in `frontend/` or the reverse, and never commit `bin/`, `obj/` or `node_modules/`.

---

## 1. Project summary

AquaBophelo is a full-stack web system that helps a South African municipality **monitor water supply (dam levels)** and **track water tankers (trucks) in real time**, while keeping residents informed through dashboards and SMS/email alerts.

Two core capabilities:

1. **Water monitoring** – record and visualise dam levels over time, raise alerts when levels cross thresholds.
2. **Truck tracking** – drivers broadcast live GPS positions while delivering water; residents and admins see trucks moving on a map with live updates.

Three user roles: **Resident**, **Driver**, **Admin**.

**Why it exists:** water scarcity and unreliable supply are real, recurring problems for municipalities. Residents want to know *how much water there is* and *where the water truck is*. Municipal staff need a single operational view.

---

## 2. Context and constraints

| Area | Detail |
|---|---|
| Client | Sol Plaatje Municipality, Kimberley, Northern Cape [CONFIRMED] |
| Type | Final-year capstone (Diploma in ICT, Sol Plaatje University) |
| Deadline | Phase 4 – Implementation & Presentation: **1 October 2026** |
| Team | 4 developers (see §3) |
| Dev environment | Windows, Visual Studio 2022 Community, GitHub |
| Users' reality | Data costs matter, many mid/low-end Android phones, patchy connectivity |
| Backend rationale | ASP.NET Core chosen deliberately over Node/Express because .NET dominates South African enterprise and municipal IT |
| HCI grounding | Nielsen's 10 Usability Heuristics guide UI decisions |

---

## 3. Team, repository and folder structure

### 3.1 Team

| Member | Role |
|---|---|
| Cuba (Sisekelo Masombuka) | Backend developer (ASP.NET Core, EF Core, SQL, auth, SignalR, integrations) |
| Nosipho Mbatha | Backend developer (moved from frontend; works alongside Cuba) |
| Nomcebo Nkosi | Frontend developer |
| Jabulile Shabalala | Frontend developer |

The team is **2 backend + 2 frontend**.

GitHub repository: `github.com/Sisekelo-Masombuka/AqueBophelo` (the repo name is spelled *Aque*; the local folder and C# project are spelled *Aqua*. The folder name doesn't need to match the repo name.)

Design decisions are made collaboratively as a group.

### 3.2 Agreed project location and target layout [CONFIRMED location / PROPOSED layout]

**Project location on the backend developer's machine (Windows):**

```
C:\Users\Sisekelo Masombuka\source\repos\AquaBophelo
```

This folder becomes the **repo root** (one Git repository, one GitHub repo) holding the backend, the frontend and the docs side by side (a "monorepo"). The front-end has its own dedicated folder, `frontend/`, so the React app never mixes with the ASP.NET Core project.

```
AquaBophelo/                              ← repo root (Git + GitHub)
├── README.md
├── .gitignore                            (dotnet + node; see §3.4)
│
├── docs/
│   ├── AquaBophelo_Project_Documentation.md   ← this file
│   └── er-diagram.png                         ← the ER diagram from the documentation phase
│
├── backend/                              ← Cuba's territory (ASP.NET Core)
│   ├── AquaBophelo.slnx                  ← solution file
│   └── AquaBophelo/                      ← the Web API project
│       ├── AquaBophelo.csproj
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── AquaBophelo.http
│       ├── Properties/
│       ├── Controllers/
│       ├── Models/                       (next step: Dam.cs)
│       ├── Data/  Dtos/  Services/  Hubs/  BackgroundServices/  Middleware/
│       └── (see §9.1 for the full backend tree)
│
└── frontend/                             ← the frontend team's territory (React)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.development                  (VITE_API_BASE_URL=https://localhost:<api-port>)
    ├── public/
    └── src/                              (see §10.1 for the full frontend tree)
```

Why nested `backend/AquaBophelo/` instead of putting the project straight in `backend/`? A .NET project compiles every `.cs` file beneath its own folder. If a second project (for example, tests) is ever added next to it, the two would collide. Giving each project its own folder avoids that from day one.

**Current state on disk (from the screenshot).** Everything is *flat* in the repo-root folder: `Controllers/`, `Properties/`, `appsettings.json`, `appsettings.Development.json`, `AquaBophelo.csproj`, `AquaBophelo.csproj.user`, `AquaBophelo.http`, `AquaBophelo.slnx`, `Program.cs`, and `WeatherForecast.cs`, plus build output in `bin/` and `obj/`. `WeatherForecast.cs` (and probably a `WeatherForecastController.cs` in `Controllers/`) is leftover from the project template. Delete both once the first real controller works. No `.gitignore` is visible, so add one before the first commit.

### 3.3 One-time restructure (about 10 minutes) [PROPOSED]

Do this **before** the frontend team pushes anything, and tell them first if they've already cloned the repo.

1. **Close Visual Studio.**
2. In File Explorer, inside `...\repos\AquaBophelo`, create these folders: `backend`, `frontend`, `docs`, and inside `backend` create another folder called `AquaBophelo`.
3. Move `AquaBophelo.slnx` into `backend\`.
4. Move everything else (`Controllers`, `Properties`, `appsettings.json`, `appsettings.Development.json`, `AquaBophelo.csproj`, `AquaBophelo.http`, `Program.cs`, `WeatherForecast.cs`) into `backend\AquaBophelo\`.
5. **Delete** `bin/`, `obj/` and `AquaBophelo.csproj.user`. They are regenerated automatically on the next build.
6. Open `backend\AquaBophelo.slnx` in Notepad. It is a few lines of XML. Change the project path so it points at the new location: `AquaBophelo/AquaBophelo.csproj`.
7. Open the `.slnx` in Visual Studio 2022 → **Build** → **Run**. Confirm the Scalar page loads and the GET still returns 200 OK.
8. Create the frontend from the repo root:
   ```
   npm create vite@latest frontend -- --template react
   cd frontend
   npm install
   ```
   Then the frontend team installs and configures Tailwind CSS, Leaflet, Chart.js and the SignalR client (`@microsoft/signalr`) inside `frontend/`.
9. Save this document into `docs/`, add `README.md` and `.gitignore`, then commit and push.

If the folder is already a Git repository, Git detects the moves as renames and history is kept.

### 3.4 Repository conventions [PROPOSED]

- **`.gitignore` at the repo root** must exclude: `bin/`, `obj/`, `.vs/`, `*.user`, `node_modules/`, `dist/`, `.env*.local`, and any file containing secrets. Never commit `appsettings.Production.json` with real keys.
- **Ownership by folder:** `backend/` belongs to Cuba and Nosipho; `frontend/` belongs to Nomcebo and Jabulile. Cross-folder changes go through a pull request.
- **Branches:** `main` is always demo-able. Work on short-lived branches such as `backend/dam-model` or `frontend/live-map`, merged via pull request.
- **The API contract is OpenAPI / Scalar.** The frontend team builds against the endpoints listed in §9.6 and the live Scalar page. If the backend changes a route or DTO, say so in the group chat right away.
- **Running locally:** two terminals. One runs the API (port taken from `backend/AquaBophelo/Properties/launchSettings.json`), the other runs `npm run dev` in `frontend/` (Vite default `http://localhost:5173`). The API's CORS policy must allow the frontend origin (§9.5).
- **Paths with spaces:** the Windows user folder contains a space (`Sisekelo Masombuka`), so wrap paths in quotes in any terminal command.
- **Working with Antigravity:** open the **repo root** (`AquaBophelo/`) as the workspace so the agent can see `docs/`, `backend/` and `frontend/` together, and tell it to read `docs/AquaBophelo_Project_Documentation.md` first.

### 3.5 Working agreement for a 2 + 2 team [PROPOSED]

**Two backend developers: avoid stepping on each other.**
- **Split by module, not by layer.** Suggested: Cuba takes the foundation (auth, users, dams and readings, alerts); Nosipho takes the fleet side (trucks, routes, trips, the SignalR `TruckHub`). Swap as you like, but agree who owns what before starting.
- **EF Core migrations are the #1 conflict risk.** Every migration updates a shared snapshot file (`AppDbContextModelSnapshot.cs`), and two people generating migrations in parallel will conflict. Rules: pull `main` before adding a migration; tell the other backend dev when you add one; merge migration PRs quickly; if a conflict happens, delete your unmerged migration, pull, and re-create it.
- **Shared hotspots:** `Program.cs` and `AppDbContext.cs` are touched by everyone. Keep edits to them small and merge them fast.
- **Each dev has their own local database** (LocalDB). The schema is shared through migrations and the sample data through code-based seeding. Database files are never committed.

**Two frontend developers.**
- Suggested split by role area: one takes **Public + Resident** pages, the other takes **Driver + Admin** pages. Agree the shared pieces (layouts, sidebar, status badge, API client, design tokens from §11) first so both build on the same base.
- Build against the endpoint list in §9.6 and the live Scalar page. Until an endpoint exists, use a small mock so nobody is blocked.

---

## 4. Users and roles [CONFIRMED roles / PROPOSED capabilities]

### 4.1 Resident
- Register / log in.
- View current dam levels, trends and status colour.
- View active water trucks on a map and their live positions.
- See delivery schedules / routes for their area.
- Subscribe to SMS / email alerts for their area.
- View alert history.
- (Optional) Report a water issue (no supply, leak).

### 4.2 Driver
- Log in on a phone.
- See the assigned truck and today's route / stops.
- Start and end a trip.
- Broadcast live GPS while a trip is active.
- Mark stops as completed.

### 4.3 Admin (municipal staff)
- Full dashboard: dams, trucks, drivers, routes, alerts.
- CRUD for dams, readings, trucks, drivers, areas, routes.
- Assign drivers to trucks and trucks to routes.
- Create and send alerts / announcements (SMS + email).
- Manage users and roles.
- View reports and history.

---

## 5. Functional requirements

### 5.1 Water monitoring module
- FR-W1: Admin can register dams (name, location, capacity, area served).
- FR-W2: Admin can record dam readings (level %, volume, timestamp).
- FR-W3: Dashboard shows current level per dam with status colour.
- FR-W4: Historical trend charts (7 / 30 / 90 days) via Chart.js.
- FR-W5: Threshold rules generate alerts automatically (see §9.7).
- FR-W6: [OPEN] Source of readings — manual entry, CSV import, public data feed, or a simulator for the demo. Recommended for the capstone: manual entry **plus** a seeded/simulated data generator so the demo always has live-looking data.

### 5.2 Truck tracking module
- FR-T1: Admin manages trucks (registration, capacity, status).
- FR-T2: Admin assigns a driver to a truck and creates routes with stops.
- FR-T3: Driver starts a trip; the device sends GPS updates to the server.
- FR-T4: Server stores the latest position and broadcasts it to subscribers in real time (SignalR).
- FR-T5: Residents and admins see trucks on a Leaflet map with live movement.
- FR-T6: Stop completion updates route progress.
- FR-T7: Trip history is stored for admin review.

### 5.3 Notifications and alerts
- FR-N1: Residents subscribe to alerts by channel (SMS / email) and area.
- FR-N2: Admin can broadcast a manual alert.
- FR-N3: System raises automatic alerts on low dam levels and on truck events (trip started, arriving soon) [PROPOSED].
- FR-N4: Every send attempt is logged.

### 5.4 Authentication and authorization
- FR-A1: Register / login / logout, JWT-based.
- FR-A2: Role-based access control (Resident, Driver, Admin).
- FR-A3: Role-based navigation on the frontend.
- FR-A4: Password reset by email [PROPOSED].

---

## 6. Non-functional requirements

- **Mobile-first, responsive.** Most residents and all drivers will use phones.
- **Low data usage.** Small payloads, paginated lists, throttled GPS updates (every 5–10 s), lazy-loaded map tiles and charts, gzip/brotli compression.
- **Resilience.** UI must handle dropped connections (SignalR automatic reconnect, clear "reconnecting" state, cached last-known values).
- **Security.** HTTPS, JWT, role policies, input validation, no secrets in the repo, rate limiting on auth and SMS endpoints.
- **Usability.** Follow Nielsen's heuristics: visibility of system status, error prevention, recognition over recall, consistency, and so on.
- **Accessibility.** Colour is never the only status indicator (add icons and labels); adequate contrast on the dark theme.
- **Maintainability.** Layered code, DTOs, dependency injection, consistent naming.
- **Performance target [PROPOSED].** Dashboard loads in under 3 seconds on a mid-range phone over 4G.

---

## 7. Technology stack [CONFIRMED]

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Maps | Leaflet.js |
| Charts | Chart.js |
| Backend | ASP.NET Core Web API (C#), controllers-based |
| ORM | Entity Framework Core |
| Database | SQL Server (local dev) / Azure SQL (production) |
| Auth | ASP.NET Core Identity + JWT, role-based |
| Real-time | SignalR |
| API docs | OpenAPI + **Scalar** (Scalar.AspNetCore) |
| SMS | Twilio **or** Clickatell / BulkSMS (final choice [OPEN]; put behind an interface) |
| Email | SendGrid |
| Frontend hosting | Vercel or Netlify |
| Backend hosting | Azure App Service + Azure SQL (free student tier) |
| IDE / OS | Visual Studio 2022 Community, Windows |
| Source control | GitHub |

Notes:
- No Docker. No top-level statements (classic `Program` class style). Controllers enabled. OpenAPI enabled.
- Target framework: confirm in the `.csproj` (likely `net9.0`, since built-in OpenAPI + Scalar is in use).

---

## 8. System architecture

```
┌──────────────────────────┐        HTTPS / JSON + WebSockets
│  React + Tailwind SPA    │◄──────────────────────────────────┐
│  (Vercel / Netlify)      │                                    │
│  Leaflet · Chart.js      │                                    │
│  SignalR client          │                                    │
└────────────┬─────────────┘                                    │
             │ REST (JWT bearer)        SignalR hub (/hubs/trucks)
             ▼                                                  │
┌───────────────────────────────────────────────────────────────┴───┐
│                 ASP.NET Core Web API  (Azure App Service)         │
│                                                                   │
│  Controllers ─► Services ─► EF Core DbContext ─► SQL Server/Azure │
│       │              │                                            │
│       │              ├─► INotificationService ─► Twilio/BulkSMS   │
│       │              │                         └► SendGrid        │
│       │              └─► AlertEvaluator (BackgroundService)       │
│       └─► Identity + JWT                                          │
│  TruckHub (SignalR) ─► groups per truck / per area                │
└───────────────────────────────────────────────────────────────────┘
```

**Request flow examples**
- *Dashboard load:* SPA → `GET /api/v1/dams` → controller → service → EF Core → DTO list → JSON.
- *Live truck:* Driver phone → `TruckHub.SendLocation(...)` → server saves latest position → broadcasts `LocationUpdated` to the truck's group → resident map marker moves.
- *Low-dam alert:* new reading saved → `AlertEvaluator` compares with thresholds → creates `Alert` → `INotificationService` sends SMS/email to subscribed residents → log rows written.

---

## 9. Backend specification

### 9.1 Suggested solution structure [PROPOSED]

This tree lives inside `backend/AquaBophelo/` (see §3.2).

```
backend/AquaBophelo/
├── Controllers/
│   ├── AuthController.cs
│   ├── DamsController.cs
│   ├── DamReadingsController.cs
│   ├── TrucksController.cs
│   ├── RoutesController.cs
│   ├── TripsController.cs
│   ├── AlertsController.cs
│   ├── SubscriptionsController.cs
│   ├── AreasController.cs
│   └── UsersController.cs          (admin)
├── Data/
│   ├── AppDbContext.cs
│   ├── Migrations/
│   └── Seed/                        (roles, admin user, sample dams/trucks)
├── Models/                          (EF entities — start with Dam.cs)
├── Dtos/                            (request/response shapes, one folder per feature)
├── Services/
│   ├── Interfaces/
│   ├── DamService.cs, TruckService.cs, AlertService.cs, ...
│   └── Notifications/               (INotificationService, SmsSender, EmailSender)
├── Hubs/
│   └── TruckHub.cs
├── BackgroundServices/
│   ├── AlertEvaluator.cs
│   └── DamReadingSimulator.cs       (demo/dev only)
├── Middleware/                      (global exception handler)
├── Program.cs
└── appsettings.json
```

### 9.2 Current backend status [CONFIRMED]
- ASP.NET Core Web API project created (controllers on, OpenAPI on, no Docker, no top-level statements).
- `Program.cs` configured and understood.
- `Scalar.AspNetCore` installed and wired in.
- Live `GET` tested successfully (200 OK).
- Files currently sit flat in `C:\Users\Sisekelo Masombuka\source\repos\AquaBophelo`, with template leftovers (`WeatherForecast.cs`). They move into `backend/AquaBophelo/` per §3.3.
- **Next step:** create the `Models` folder and write the first model, `Dam.cs`, based on the existing ER diagram from the documentation phase.

### 9.3 Conventions [PROPOSED]
- Route prefix `api/v1/...`, plural nouns, lowercase.
- Controllers stay thin. Business logic in services.
- Never return EF entities directly; use DTOs.
- `async`/`await` everywhere with `CancellationToken` where sensible.
- All timestamps in UTC (`DateTime.UtcNow`), converted to SAST (UTC+2) in the UI.
- Consistent error shape (`ProblemDetails`), global exception middleware.
- Validation with data annotations (or FluentValidation if the team wants it).
- Pagination on list endpoints: `?page=1&pageSize=20`.

### 9.4 Data model (draft) [PROPOSED — reconcile with the team's ER diagram]

> **[OPEN] The ER diagram from the documentation phase is the authority.** Paste it below or share it with the agent, and replace anything here that differs.

| Entity | Key fields | Relationships |
|---|---|---|
| `ApplicationUser` (Identity) | Id, FullName, Email, PhoneNumber, AreaId?, CreatedAt | Has one role; belongs to an `Area` |
| `Area` | Id, Name, (optional centre lat/lng) | Has many users, dams served, routes |
| `Dam` | Id, Name, Latitude, Longitude, CapacityMegaLitres, AreaId?, IsActive | Has many `DamReading` |
| `DamReading` | Id, DamId, LevelPercent, VolumeMegaLitres, RecordedAt, Source | Belongs to `Dam` |
| `Truck` | Id, RegistrationNumber, CapacityLitres, Status (Available / OnTrip / Maintenance), DriverId? | Has many trips, locations |
| `TruckRoute` | Id, Name, AreaId | Has many `RouteStop` |
| `RouteStop` | Id, RouteId, Name, Latitude, Longitude, Sequence | Belongs to `TruckRoute` |
| `Trip` | Id, TruckId, DriverId, RouteId, StartedAt, EndedAt?, Status | Has many `TripStop`, `TruckLocation` |
| `TripStop` | Id, TripId, RouteStopId, ArrivedAt?, Completed | |
| `TruckLocation` | Id, TruckId, TripId?, Latitude, Longitude, SpeedKmh?, Heading?, RecordedAt | Belongs to `Truck` |
| `Alert` | Id, Type (DamLow / DamCritical / Truck / Announcement), Severity, Title, Message, DamId?, AreaId?, CreatedAt, CreatedByUserId? | |
| `AlertSubscription` | Id, UserId, AreaId, Channel (Sms / Email), IsActive | |
| `NotificationLog` | Id, AlertId, UserId, Channel, Status, Error?, SentAt | |

Storage tip: keep the **latest** truck position in a fast lookup (e.g. a `LastLatitude/LastLongitude/LastSeenAt` on `Truck`) and write full `TruckLocation` history at a lower frequency, so the table doesn't explode.

### 9.5 Authentication and authorization

- ASP.NET Core Identity with `IdentityUser` extended into `ApplicationUser`.
- Roles: `Resident`, `Driver`, `Admin` (seeded at startup).
- Login returns a JWT (short-lived, e.g. 60 min) containing user id, email and role claims. Refresh tokens [OPEN — nice to have].
- Public self-registration creates **Residents only**. Drivers and Admins are created by an Admin.
- Protect endpoints with `[Authorize(Roles = "...")]` or named policies.
- SignalR authenticates with the JWT passed as `access_token` in the query string (WebSockets can't set headers).
- CORS: allow only the deployed frontend origin(s) and `http://localhost:5173` in development.

### 9.6 API endpoints (draft) [PROPOSED]

| Method | Route | Roles | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Resident registration |
| POST | `/api/v1/auth/login` | Public | Returns JWT + user info |
| GET | `/api/v1/auth/me` | Any | Current user profile |
| GET | `/api/v1/dams` | Any | List dams with latest reading + status |
| GET | `/api/v1/dams/{id}` | Any | Dam detail |
| POST / PUT / DELETE | `/api/v1/dams` … | Admin | Manage dams |
| GET | `/api/v1/dams/{id}/readings?from=&to=` | Any | Reading history for charts |
| POST | `/api/v1/dams/{id}/readings` | Admin | Add a reading |
| GET | `/api/v1/trucks` | Any | Trucks with last known position |
| POST / PUT / DELETE | `/api/v1/trucks` … | Admin | Manage trucks |
| PUT | `/api/v1/trucks/{id}/driver` | Admin | Assign driver |
| GET / POST / PUT | `/api/v1/routes` … | Admin (read: Any) | Routes and stops |
| GET | `/api/v1/trips/mine` | Driver | Driver's current / upcoming trips |
| POST | `/api/v1/trips` | Admin | Schedule a trip |
| POST | `/api/v1/trips/{id}/start` | Driver | Start trip |
| POST | `/api/v1/trips/{id}/stops/{stopId}/complete` | Driver | Mark stop done |
| POST | `/api/v1/trips/{id}/end` | Driver | End trip |
| GET | `/api/v1/alerts` | Any | Alert feed (filter by area) |
| POST | `/api/v1/alerts` | Admin | Create and broadcast alert |
| GET / POST / DELETE | `/api/v1/subscriptions` | Resident | Manage own alert subscriptions |
| GET | `/api/v1/areas` | Any | List areas |
| GET / PUT | `/api/v1/users` … | Admin | User and role management |

### 9.7 Alerts logic [PROPOSED thresholds — confirm with the team]

| Dam level | Status | Colour | Action |
|---|---|---|---|
| ≥ 50% | Healthy | Green | None |
| 30–49% | Watch | Amber | Notify admins |
| 15–29% | Low | Red | Alert subscribers |
| < 15% | Critical | Red + flashing indicator | Alert subscribers + admins, repeat daily |

Implementation idea: when a reading is saved, call `AlertService.EvaluateAsync(reading)`. It only creates a new alert when the **status band changes** (prevents spamming residents).

### 9.8 SignalR design (truck tracking)

- Hub route: `/hubs/trucks`.
- Groups: `truck-{truckId}` (follow one truck) and `area-{areaId}` (all trucks in an area). Admins join `admins`.
- **Client → server:** `SendLocation(tripId, lat, lng, speed, heading)` — Driver role only.
- **Server → clients:** `LocationUpdated { truckId, lat, lng, speed, heading, recordedAt }`, `TripStarted`, `TripEnded`, `StopCompleted`.
- On receive: validate the driver owns the active trip, update the truck's last position, persist history every N seconds, broadcast to groups.
- Driver client throttles to one update every 5–10 s and uses the browser Geolocation API (`watchPosition`).
- Enable automatic reconnect on the client.

### 9.9 Notification abstraction

```csharp
public interface INotificationService
{
    Task SendSmsAsync(string phoneNumber, string message, CancellationToken ct = default);
    Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default);
}
```

- Register concrete SMS provider via DI so Twilio / Clickatell / BulkSMS can be swapped without touching business logic.
- Use South African number format (+27…) and validate before sending.
- Log every attempt to `NotificationLog`. Fail gracefully — a failed SMS must not break saving a reading.
- Rate-limit manual broadcasts and cap messages per run to control cost.
- For the demo: a "dry run" mode that logs instead of sending, so no credits are burned.

### 9.10 Configuration

`appsettings.json` (non-secret) and user-secrets / Azure App Settings (secret):

```
ConnectionStrings:DefaultConnection
Jwt:Issuer, Jwt:Audience, Jwt:Key (secret), Jwt:ExpiryMinutes
Cors:AllowedOrigins
Sms:Provider, Sms:ApiKey, Sms:Sender      (secret)
SendGrid:ApiKey, SendGrid:FromEmail       (secret)
Alerts:DryRun
```

---

## 10. Frontend specification

### 10.1 Suggested structure [PROPOSED]

This tree lives inside the `frontend/` folder at the repo root (see §3.2).

```
frontend/src/
├── api/            (axios instance, per-feature API modules, JWT interceptor)
├── auth/           (AuthContext, ProtectedRoute, role guard)
├── components/     (Sidebar, Topbar, StatCard, StatusBadge, DamPanel, TruckMarker, LiveMap, TrendChart, AlertList)
├── features/
│   ├── dams/
│   ├── trucks/
│   ├── alerts/
│   ├── routes/
│   └── users/
├── hooks/          (useSignalR, useLiveTrucks, useGeolocationBroadcast)
├── layouts/        (ResidentLayout, DriverLayout, AdminLayout)
├── pages/
└── main.jsx / App.jsx
```

### 10.2 Routes per role [PROPOSED]

| Role | Pages |
|---|---|
| Public | Landing (dashboard-style preview), Login, Register |
| Resident | Dashboard, Dam detail, Live truck map, Schedules, My alerts / subscriptions, Profile |
| Driver | My trip (route + stops), Live broadcast screen (big Start/End button), Profile |
| Admin | Overview dashboard, Dams & readings, Trucks, Drivers, Routes, Alerts & broadcast, Users, Reports |

Role-based navigation: the sidebar renders only the links allowed for the logged-in role; routes are also guarded so URL-typing can't bypass it.

### 10.3 Key UI components
- **Live map (Leaflet):** truck markers with heading/status, route polyline, stop markers, dam markers coloured by status. Update markers from SignalR without re-rendering the whole map.
- **Dam level panels:** gauge or bar, % value, status badge (icon + text + colour), sparkline.
- **Trend charts (Chart.js):** line charts with 7 / 30 / 90-day toggle.
- **Alert list:** severity chips, timestamps in SAST, area tags.
- **Connection indicator:** small "Live / Reconnecting" pill for system-status visibility.

### 10.4 State and data
- Auth state in context; token in memory + `localStorage` (or httpOnly cookie if the team prefers [OPEN]).
- Server state via TanStack Query (or plain hooks) with sensible caching to save data.
- Handle loading, empty and error states on every screen.

---

## 11. Design system and UI direction [CONFIRMED direction]

**Direction:** dark theme, **dashboard-first**, data-dense. The team reviewed two landing-page mockups and **rejected the marketing / magazine-style layout**. The landing page should look like the real product in action — live map, sidebar navigation, dam level panels, status indicators. Principle: *show the product working, not a pitch for it.*

**Palette:** deep navy background, with a status colour system of cyan / amber / green / red. Exact hex values were not fixed; suggested tokens [PROPOSED]:

| Token | Suggested value | Use |
|---|---|---|
| `--bg` | `#0B1220` | App background |
| `--surface` | `#111B2E` | Cards, panels |
| `--border` | `#1F2C45` | Dividers |
| `--text` | `#E6EDF7` | Primary text |
| `--muted` | `#8A9BB8` | Secondary text |
| `--cyan` | `#22D3EE` | Primary accent / live / info |
| `--green` | `#22C55E` | Healthy / completed |
| `--amber` | `#F59E0B` | Watch / warning |
| `--red` | `#EF4444` | Low / critical / error |

**Typography:** Inter, Poppins and Roboto were the chosen families. Suggested use: Inter for UI and data, Poppins for headings [PROPOSED].

**UX references:** USGS National Water Dashboard (water monitoring patterns) and Samsara (live fleet GPS tracking patterns).

**Usability rules:** status is never colour-only; large touch targets on driver screens; consistent layouts across roles; clear feedback on every action.

---

## 12. Security checklist

- HTTPS only; HSTS in production.
- Strong password policy via Identity options; lockout on repeated failures.
- JWT signing key in secrets, never committed.
- Role policies on every controller action; deny by default.
- Validate all input; use DTOs to avoid over-posting.
- Rate limiting on `/auth/*` and any SMS-triggering endpoint.
- CORS restricted to known origins.
- Don't log tokens, passwords or full phone numbers.
- Protect personal information (POPIA awareness: collect only what is needed, allow users to unsubscribe).

---

## 13. Deployment [CONFIRMED targets]

- **Frontend:** Vercel or Netlify. Because the repo is a monorepo, set the platform's **Root Directory** to `frontend`. Environment variable `VITE_API_BASE_URL` (or equivalent) points to the API.
- **Backend:** Azure App Service (deploy the `backend/AquaBophelo` project), with Azure SQL (free student tier). Apply EF Core migrations against Azure SQL, set App Settings for all secrets, update CORS to the deployed frontend URL.
- **CI/CD [PROPOSED]:** GitHub Actions or the platform's GitHub integration, deploying from `main`.
- **Environments:** local dev (SQL Server / LocalDB) and production. A staging slot is optional.

---

## 14. Project plan and status

**Deadline: 1 October 2026 (Phase 4: Implementation & Presentation).**

### Done
- Documentation phase (including ER diagram and requirements).
- Backend project created, Scalar wired, first GET returns 200 OK.
- UI direction agreed (dark, dashboard-first).

### In progress / next
0. **Step 0 – Bootstrap** (done by Antigravity; brief in `docs/Antigravity_Step0_Bootstrap.md`): restructure the repo (§3.3), install all tooling and packages, connect frontend ↔ backend with a health check, add `.gitignore` and `README.md`, push to GitHub so the whole team can start.
1. Models folder + `Dam.cs`, then remaining entities from the ER diagram.
2. `AppDbContext`, connection string, first EF Core migration, seed data.
3. Identity + JWT + roles.
4. Core CRUD: dams, readings, trucks, routes.
5. SignalR truck hub + driver location flow.
6. Alerts + notification service (dry-run first).
7. Frontend: role-based navigation, dashboards, live map (frontend team, in parallel).
8. Integration, deployment, demo data, presentation prep.

### Suggested build order for the agent (vertical slices)

| # | Slice | Done when |
|---|---|---|
| 1 | `Dam` model, DbContext, migration, `GET/POST /dams` | Dam created and listed in Scalar |
| 2 | `DamReading` + latest-level status in `GET /dams` | Status colour computed from level |
| 3 | Identity, roles seeding, register/login, JWT | Protected endpoint rejects anonymous, accepts Admin |
| 4 | Trucks, drivers, routes, stops CRUD | Admin can build a route end to end |
| 5 | Trips lifecycle (start / stop complete / end) | Driver can run a full trip via API |
| 6 | `TruckHub` + live location broadcast | Two browser tabs see a marker move |
| 7 | Alerts + subscriptions + dry-run notifications | Low reading creates alert + log rows |
| 8 | Real SMS / email provider | Test message delivered |
| 9 | Deploy to Azure + connect deployed frontend | End-to-end demo on public URLs |
| 10 | Demo polish: simulator, seed data, error handling | Presentation script runs cleanly |

---

## 15. Testing approach [PROPOSED]

- **Manual:** Scalar for every endpoint; Postman collection optional.
- **Unit tests:** alert threshold logic, status calculation, trip state transitions (xUnit).
- **Integration:** auth flow and one full trip using `WebApplicationFactory` with an in-memory or test database.
- **Real-time test:** two browsers (driver simulation + resident map).
- **UAT:** a short checklist per role for the presentation.

---

## 16. Open questions (agent: ask before assuming)

1. What does the finalised **ER diagram** contain? (Overrides §9.4.)
2. Where do **dam readings** come from — manual, CSV, external data, simulator?
3. Which **SMS provider** will be used (Twilio vs Clickatell vs BulkSMS)?
4. Exact **alert thresholds** and who receives which alert.
5. Do residents **request water delivery**, or only view schedules and trucks?
6. Token storage approach on the frontend (localStorage vs httpOnly cookie) and whether refresh tokens are required.
7. Exact target framework version and EF Core provider packages in the `.csproj`.
8. Final hex values and font assignments for the design system.

---

## 17. Glossary

| Term | Meaning |
|---|---|
| Dam level | Percentage / volume of water currently stored in a dam |
| Truck / tanker | Vehicle delivering water to areas without supply |
| Trip | One run of a truck along a route by a driver |
| Stop | A delivery point on a route |
| JWT | JSON Web Token — signed token proving who the user is and their role |
| SignalR | ASP.NET Core library for real-time server-to-client communication |
| EF Core | Entity Framework Core — the ORM mapping C# classes to SQL tables |
| DTO | Data Transfer Object — the shape of data sent over the API |
| Scalar | Interactive API documentation UI (OpenAPI) |
| SAST | South African Standard Time (UTC+2) |
| POPIA | South Africa's Protection of Personal Information Act |
