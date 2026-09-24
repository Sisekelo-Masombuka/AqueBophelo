# AquaBophelo — Team Sprint Schedule & Task Allocations (Phase 4)

> **Project:** AquaBophelo Water Monitoring & Truck Tracking System  
> **Client Context:** Sol Plaatje Municipality, Kimberley, Northern Cape  
> **Sprint Period:** 22 September 2026 – 28 September 2026  
> **Final Phase 4 Deadline:** 1 October 2026  
> **Team Allocation:** 
> - **Backend Developers:** Sisekelo "Cuba" Masombuka (Lead) & Nosipho Mbatha
> - **Frontend Developers:** Nomcebo Nkosi & Jabulile Shabalala

---

## 📌 Team Responsibilities Summary

| Developer | Primary Domain | Core Responsibilities | Git Branch Prefix |
|---|---|---|---|
| **Sisekelo (Cuba)** | Backend Lead | Database Schema & EF Core Migrations, Identity & JWT Auth, Dams & Readings APIs, Alert Engine, Azure Deployment | `backend/` |
| **Nosipho** | Backend | Fleet Management APIs (Trucks/Routes), Trip Lifecycle APIs, SignalR `TruckHub`, Notification Service, Admin Reports | `backend/` |
| **Nomcebo** | Frontend | HCI Usability Heuristics, Accessibility (WCAG AA), Design System Tokens, Shared Layouts, Resident Dashboard, Dam Level Gauges, Chart.js | `frontend/` |
| **Jabulile** | Frontend | **Mapbox GL JS Live Tracking Map**, Driver Mobile Broadcast Screen (oversized touch targets $\ge 48\text{px}$), Geolocation Hook, Admin Command Center | `frontend/` |

---

## 📅 Day-by-Day Master Schedule (22 – 28 September 2026)

---

### 1. Tuesday, 22 September 2026 — Database Schema, Core Models & Layout Base

#### 👤 Sisekelo (Cuba) — Backend
- [x] Create EF Core entities in `backend/AquaBophelo/Models/`: `ApplicationUser.cs`, `Area.cs`, `Dam.cs`, `DamReading.cs`.
- [x] Create `AppDbContext.cs` extending `IdentityDbContext<ApplicationUser>`.
- [x] Create LocalDB instance `AquaBopheloDbInstance` and generate initial EF migration `InitialCreate`.
- [x] Create `DbSeeder.cs`: seed Identity Roles (`Admin`, `Driver`, `Resident`), Sol Plaatje Municipal Areas (`Galeshewe`, `Kimberley Central`, `Roodepan`), Dams (`Newton Reservoir`, `Riverton Water Works`), and Admin User (`admin@aquabophelo.gov.za`).

#### 👤 Nosipho — Backend
- [x] Create Fleet & Notification EF Core entities in `backend/AquaBophelo/Models/`: `Truck.cs`, `TruckRoute.cs`, `RouteStop.cs`, `Trip.cs`, `TripStop.cs`, `TruckLocation.cs`, `Alert.cs`, `AlertSubscription.cs`, `NotificationLog.cs`.
- [x] Review foreign key constraints in `AppDbContext.cs` to prevent circular cascade deletes on `Truck` and `Trip`.

#### 👤 Nomcebo — Frontend (HCI Lead)
- [x] Create shared UI components: `Sidebar.jsx`, `StatusBadge.jsx` (HCI accessibility rule: color + icon + text label), `StatCard.jsx`.
- [x] Configure React Router (`App.jsx`) structure with responsive drawer navigation.

#### 👤 Jabulile — Frontend (Mapbox & Interactive Map)
- [x] Scaffold interactive map component `LiveMap.jsx` using **Mapbox GL JS** with dark vector map style centered on Kimberley (`-28.7419, 24.7719`).
- [x] Build shared `AdminLayout.jsx` container.

---

### 2. Wednesday, 23 September 2026 — Authentication, JWT Tokens & Core REST APIs

#### 👤 Sisekelo (Cuba) — Backend
- [x] Create `Dtos/AuthDtos.cs` (`RegisterDto`, `LoginDto`, `AuthResponseDto`).
- [x] Create `Services/AuthService.cs` & `IAuthService.cs` (JWT token generation with claims for UserId, Email, Role).
- [x] Create `Controllers/AuthController.cs` (`POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`).
- [x] Create `Controllers/DamsController.cs` (`GET /api/v1/dams`, `GET /api/v1/dams/{id}`, `POST /api/v1/dams`, `PUT /api/v1/dams/{id}`).
- [x] Create `Controllers/DamReadingsController.cs` (`GET /api/v1/dams/{id}/readings`, `POST /api/v1/dams/{id}/readings`).

#### 👤 Nosipho — Backend
- [x] Create `Dtos/FleetDtos.cs` (`TruckDto`, `CreateTruckDto`, `RouteDto`, `CreateRouteDto`, `RouteStopDto`).
- [x] Create `Controllers/TrucksController.cs` (`GET /api/v1/trucks`, `POST /api/v1/trucks`, `PUT /api/v1/trucks/{id}`, `PUT /api/v1/trucks/{id}/driver`).
- [x] Create `Controllers/RoutesController.cs` (`GET /api/v1/routes`, `POST /api/v1/routes`, `PUT /api/v1/routes/{id}`).
- [x] Create `Controllers/AreasController.cs` (`GET /api/v1/areas`).

#### 👤 Nomcebo — Frontend
- [x] Create `src/auth/AuthContext.jsx` (token storage in `localStorage`, auto-attach Bearer token in `client.js`).
- [x] Create `src/auth/ProtectedRoute.jsx` (route guards for Resident, Driver, and Admin roles).
- [x] Create `src/pages/Login.jsx` & `src/pages/Register.jsx` (Resident self-registration with inline validation and HCI error prevention).
- [x] Create `src/components/DamPanel.jsx` & `src/components/TrendChart.jsx` (Chart.js 7/30/90-day toggles).

#### 👤 Jabulile — Frontend
- [ ] Create `src/pages/admin/ManageDams.jsx` (Admin panel to manage dams and record manual water levels).
- [ ] Create `src/pages/admin/ManageTrucks.jsx` (Admin panel to manage water tankers and assign drivers).
- [ ] Create `src/pages/admin/ManageRoutes.jsx` (Admin panel to create routes and stops with coordinates).

---

### 3. Thursday, 24 September 2026 — Trip Lifecycle, Real-Time SignalR & Alert Engine

#### 👤 Sisekelo (Cuba) — Backend
- [x] Create `Services/AlertService.cs` & `Controllers/AlertsController.cs` (`GET /api/v1/alerts`, `POST /api/v1/alerts`).
- [x] Create `Controllers/SubscriptionsController.cs` (`GET`, `POST`, `DELETE /api/v1/subscriptions`).
- [x] Create `BackgroundServices/AlertEvaluator.cs`: evaluates dam level changes on new readings and auto-generates Amber/Red alert records when thresholds cross (<50%, <30%, <15%).

#### 👤 Nosipho — Backend
- [x] Create `Controllers/TripsController.cs` (`POST /api/v1/trips`, `GET /api/v1/trips/mine`, `POST /trips/{id}/start`, `POST /trips/{id}/stops/{stopId}/complete`, `POST /trips/{id}/end`).
- [x] Upgrade `Hubs/TruckHub.cs` (`/hubs/trucks`):
  - Client $\rightarrow$ Server: `SendLocation(tripId, lat, lng, speed, heading)`
  - Server $\rightarrow$ Clients: `LocationUpdated`, `TripStarted`, `TripEnded`, `StopCompleted`.

#### 👤 Nomcebo — Frontend
- [x] Create `src/pages/resident/ResidentDashboard.jsx`: dam level gauges, status badges, trend charts, active alert feed.
- [x] Create `src/components/AlertSubscriptionsModal.jsx` (Resident SMS/Email area alert subscription modal).

#### 👤 Jabulile — Frontend (HCI Touch Targets & Driver Screen)
- [ ] Create `src/pages/driver/DriverTripScreen.jsx`: Mobile UI with **oversized touch targets ($\ge 48\text{px}$)** for one-tap operation while driving ("Start Trip", "Mark Stop Complete", "End Trip").
- [ ] Create `src/hooks/useGeolocationBroadcast.js`: uses `navigator.geolocation.watchPosition` to stream driver GPS updates to Nosipho's `TruckHub`.

---

### 4. Friday, 25 September 2026 — Mapbox Real-time Tracking & Notifications

#### 👤 Sisekelo (Cuba) — Backend
- [ ] Implement `INotificationService` with `DryRunNotificationService` (logs to `NotificationLog` table) and `SendGridEmailService`.
- [ ] Connect `AlertEvaluator.cs` to trigger automatic SMS/Email dispatch when dam levels change status bands.

#### 👤 Nosipho — Backend
- [ ] Optimize `TruckLocation` persistence: store latest position on `Truck` entity (`LastLatitude`, `LastLongitude`, `LastSeenAt`) for fast lookup, write full history records every 10 seconds.
- [ ] Create `Controllers/ReportsController.cs` (`GET /api/v1/reports/summary`) for admin analytics.

#### 👤 Nomcebo — Frontend
- [ ] Integrate live moving truck markers on **Mapbox GL JS** `LiveMap.jsx` for resident view using custom `@microsoft/signalr` hook (`useSignalR.js`).
- [ ] Add HCI Visibility of System Status indicator ("Connected", "Reconnecting...", "Disconnected").

#### 👤 Jabulile — Frontend
- [ ] Create `src/pages/admin/AdminOverview.jsx`: Command Center showing all active trucks moving across Kimberley on Mapbox GL JS map, dam status markers, and driver state badges.
- [ ] Create `src/components/BroadcastAlertModal.jsx` for Admin manual SMS/Email announcements.

---

### 5. Saturday, 26 September 2026 — System Integration, End-to-End Testing & Bug Fixes

#### 👥 Sisekelo (Cuba) & Nosipho (Backend Integration)
- [ ] Review and merge feature branches into `main`.
- [ ] Test all endpoints in Scalar (`https://localhost:7154/scalar/v1`).

#### 👥 Nomcebo & Jabulile (Frontend Integration)
- [ ] Merge feature branches into `main`.
- [ ] Verify complete navigation flow for all 3 user roles (Resident, Driver, Admin).

#### 🤝 Whole Team Collaboration
- [ ] Joint debugging session to fix Mapbox vector marker rendering, empty state handling, and error toasts.

---

### 6. Sunday, 27 September 2026 — Cloud Deployment (Azure + Vercel / Netlify)

#### 👥 Sisekelo (Cuba) & Nosipho (Backend Deployment)
- [ ] Create **Azure App Service** instance for the ASP.NET Core API.
- [ ] Create **Azure SQL Database** (free student tier) and apply EF Core migrations (`dotnet ef database update`).

#### 👥 Nomcebo & Jabulile (Frontend Deployment)
- [ ] Deploy `frontend/` directory to **Vercel** or **Netlify**.
- [ ] Configure environment variable `VITE_API_BASE_URL` pointing to deployed Azure API URL.

---

### 7. Monday, 28 September 2026 — Demo Telemetry, Simulator & Presentation Rehearsal

#### 👤 Sisekelo (Cuba)
- [ ] Add `BackgroundServices/DamReadingSimulator.cs` for presentation demo.

#### 👤 Nosipho
- [ ] Export final Postman Collection and verify live Scalar documentation endpoints.

#### 👤 Nomcebo & Jabulile
- [ ] Final UI visual polish & HCI usability review (Nielsen Heuristics check).

#### 👥 Whole Team (Phase 4 Presentation Dry-Run)
- [ ] Conduct 2 full practice runs of the Phase 4 Capstone Presentation.