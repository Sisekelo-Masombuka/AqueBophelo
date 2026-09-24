# AquaBophelo — Team Sprint Schedule & Progress Tracker (Phase 4)

> **Project:** AquaBophelo Water Monitoring & Truck Tracking System  
> **Client Context:** Sol Plaatje Municipality, Kimberley, Northern Cape  
> **Sprint Window:** 22 September 2026 – 28 September 2026  
> **Final Phase 4 Deadline:** 1 October 2026  
> **Team Allocation:** 
> - **Backend Developers:** Sisekelo "Cuba" Masombuka (Lead) & Nosipho Mbatha
> - **Frontend Developers:** Nomcebo Nkosi & Jabulile Shabalala

---

## 📌 Team Responsibilities & Current Status Summary

| Developer | Primary Domain | Status Summary | Remaining Focus Areas |
|---|---|---|---|
| **Sisekelo (Cuba)** | Backend Lead | **Step 1 DB Foundation Done ✅** | Auth Controller (JWT), Dams/Readings APIs, Alert Engine, Azure Deployment |
| **Nosipho** | Backend | **Fleet & Trips APIs Done ✅** | Location persistence optimization, Admin Reports Summary API |
| **Nomcebo** | Frontend | **Auth & Resident UI Done ✅** | Mapbox GL JS map integration on Resident Live Trucks page |
| **Jabulile** | Frontend | **Base Layout & Map Done ✅** | Mapbox GL JS upgrade, Driver Mobile Broadcast Screen (touch targets $\ge 48\text{px}$), Admin Command Center |

---

## 📅 Master Sprint Schedule & Task Progress (22 – 28 September 2026)

---

### 🟢 1. Tuesday, 22 September 2026 — Database Schema, Core Models & Layout Base

#### 👤 Sisekelo (Cuba) — Backend Lead
- [x] Create EF Core entities in `backend/AquaBophelo/Models/`: `ApplicationUser.cs`, `Area.cs`, `Dam.cs`, `DamReading.cs`.
- [x] Create `AppDbContext.cs` extending `IdentityDbContext<ApplicationUser>`.
- [x] Create LocalDB instance `AquaBopheloDbInstance` and generate initial EF migration `InitialCreate`.
- [x] Create `DbSeeder.cs`: seed Identity Roles (`Admin`, `Driver`, `Resident`), Sol Plaatje Municipal Areas (`Galeshewe`, `Kimberley Central`, `Roodepan`), Dams (`Newton Reservoir`, `Riverton Water Works`), and Admin User (`admin@aquabophelo.gov.za`).

#### 👤 Nosipho — Backend Developer
- [x] Create Fleet & Notification EF Core entities in `backend/AquaBophelo/Models/`: `Truck.cs`, `TruckRoute.cs`, `RouteStop.cs`, `Trip.cs`, `TripStop.cs`, `TruckLocation.cs`, `Alert.cs`, `AlertSubscription.cs`, `NotificationLog.cs`.
- [x] Review foreign key constraints in `AppDbContext.cs` to prevent circular cascade deletes on `Truck` and `Trip`.

#### 👤 Nomcebo — Frontend Developer
- [x] Create shared UI components: `Sidebar.jsx`, `StatusBadge.jsx` (accessibility icons + text), `StatCard.jsx`.
- [x] Configure React Router (`App.jsx`) & `MainLayout.jsx` with responsive drawer navigation.

#### 👤 Jabulile — Frontend Developer
- [x] Scaffold interactive map component `LiveMap.jsx` centered on Kimberley (`-28.7419, 24.7719`).
- [x] Build shared `AdminLayout.jsx` container.

---

### 🟢 2. Wednesday, 23 September 2026 — Authentication, JWT Tokens & Core REST APIs

#### 👤 Nosipho — Backend Developer (Completed via PR #3 ✅)
- [x] Create `Dtos/FleetDtos.cs` (`TruckDto`, `CreateTruckDto`, `RouteDto`, `CreateRouteDto`, `RouteStopDto`).
- [x] Create `Controllers/TrucksController.cs` (`GET`, `POST`, `PUT`, `DELETE /api/v1/trucks`, `PUT /api/v1/trucks/{id}/driver`).
- [x] Create `Controllers/RoutesController.cs` (`GET`, `POST`, `PUT`, `DELETE /api/v1/routes`).
- [x] Create `Controllers/AreasController.cs` (`GET /api/v1/areas`, `GET /api/v1/areas/{id}`).

#### 👤 Nomcebo — Frontend Developer (Completed via PR #4 ✅)
- [x] Create `src/auth/AuthContext.jsx` (token storage in `localStorage`, auto-attach Bearer token in `client.js`).
- [x] Create `src/auth/ProtectedRoute.jsx` (route guards for Resident, Driver, and Admin roles).
- [x] Create `src/pages/Login.jsx` & `src/pages/Register.jsx` (Resident self-registration with inline validation and HCI error prevention).
- [x] Create `src/components/DamPanel.jsx` & `src/components/TrendChart.jsx` (Chart.js 7/30/90-day toggles).

#### 👤 Sisekelo (Cuba) — Backend Lead (Next Immediate Tasks ⏳)
- [ ] Create `Dtos/AuthDtos.cs` (`RegisterDto`, `LoginDto`, `AuthResponseDto`).
- [ ] Create `Services/AuthService.cs` & `IAuthService.cs` (JWT token generation with claims for UserId, Email, Role).
- [ ] Create `Controllers/AuthController.cs` (`POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`).
- [ ] Create `Controllers/DamsController.cs` (`GET /api/v1/dams`, `GET /api/v1/dams/{id}`, `POST /api/v1/dams`, `PUT /api/v1/dams/{id}`).
- [ ] Create `Controllers/DamReadingsController.cs` (`GET /api/v1/dams/{id}/readings`, `POST /api/v1/dams/{id}/readings`).

#### 👤 Jabulile — Frontend Developer (Remaining Tasks ⏳)
- [ ] Create `src/pages/admin/ManageDams.jsx` (Admin panel to manage dams and record manual water levels).
- [ ] Create `src/pages/admin/ManageTrucks.jsx` (Admin panel to manage water tankers and assign drivers).
- [ ] Create `src/pages/admin/ManageRoutes.jsx` (Admin panel to create routes and stops with coordinates).

---

### 🟢 3. Thursday, 24 September 2026 — Trip Lifecycle, Real-Time SignalR & Resident Pages

#### 👤 Nosipho — Backend Developer (Completed via PR #3 ✅)
- [x] Create `Controllers/TripsController.cs` (`POST /api/v1/trips`, `GET /api/v1/trips/mine`, `POST /trips/{id}/start`, `POST /trips/{id}/stops/{stopId}/complete`, `POST /trips/{id}/end`).
- [x] Implement `Hubs/TruckHub.cs` (`/hubs/trucks`):
  - Client $\rightarrow$ Server: `SendLocation(tripId, lat, lng, speed, heading)`
  - Server $\rightarrow$ Clients: `LocationUpdated`, `TripStarted`, `TripEnded`, `StopCompleted`.

#### 👤 Nomcebo — Frontend Developer (Completed via PR #4 ✅)
- [x] Create `src/pages/resident/ResidentDashboard.jsx`: dam level gauges, status badges, trend charts, active alert feed.
- [x] Create `src/components/AlertSubscriptionsModal.jsx` (Resident SMS/Email area alert subscription modal).
- [x] Create `src/pages/resident/DamsPage.jsx`, `src/pages/resident/LiveTrucksPage.jsx`, `src/pages/resident/AlertsPage.jsx`.

#### 👤 Sisekelo (Cuba) — Backend Lead (Next Immediate Tasks ⏳)
- [ ] Create `Services/AlertService.cs` & `Controllers/AlertsController.cs` (`GET /api/v1/alerts`, `POST /api/v1/alerts`).
- [ ] Create `Controllers/SubscriptionsController.cs` (`GET`, `POST`, `DELETE /api/v1/subscriptions`).
- [ ] Create `BackgroundServices/AlertEvaluator.cs`: evaluates dam level changes on new readings and auto-generates Amber/Red alert records when thresholds cross (<50%, <30%, <15%).

#### 👤 Jabulile — Frontend Developer (Remaining Tasks ⏳)
- [ ] Create `src/pages/driver/DriverTripScreen.jsx`: Mobile UI with **oversized touch targets ($\ge 48\text{px}$)** for one-tap operation while driving ("Start Trip", "Mark Stop Complete", "End Trip").
- [ ] Create `src/hooks/useGeolocationBroadcast.js`: uses `navigator.geolocation.watchPosition` to stream driver GPS updates to Nosipho's `TruckHub`.

---

### 🟡 4. Friday, 25 September 2026 — Notifications, Mapbox Real-Time & Admin Command Center

#### 👤 Sisekelo (Cuba) — Backend Lead
- [ ] Implement `INotificationService` with `DryRunNotificationService` (logs to `NotificationLog` table) and `SendGridEmailService`.
- [ ] Connect `AlertEvaluator.cs` to trigger automatic SMS/Email dispatch when dam levels change status bands.

#### 👤 Nosipho — Backend Developer
- [ ] Optimize `TruckLocation` persistence: store latest position on `Truck` entity (`LastLatitude`, `LastLongitude`, `LastSeenAt`) for fast lookup, write full history records every 10 seconds.
- [ ] Create `Controllers/ReportsController.cs` (`GET /api/v1/reports/summary`) for admin analytics.

#### 👤 Nomcebo — Frontend Developer
- [ ] Connect Mapbox GL JS map on `LiveTrucksPage.jsx` with SignalR live location updates.
- [ ] Add HCI System Status indicator ("Connected", "Reconnecting...", "Disconnected").

#### 👤 Jabulile — Frontend Developer
- [ ] Upgrade `LiveMap.jsx` to Mapbox GL JS.
- [ ] Create `src/pages/admin/AdminOverview.jsx`: Command Center showing all active trucks moving across Kimberley on Mapbox GL JS map, dam status markers, and driver state badges.
- [ ] Create `src/components/BroadcastAlertModal.jsx` for Admin manual SMS/Email announcements.

---

### 🟡 5. Saturday, 26 September 2026 — System Integration, End-to-End Testing & Bug Fixes

#### 👥 Sisekelo (Cuba) & Nosipho (Backend Integration)
- [ ] Review and merge all backend feature branches into `main`.
- [ ] Test all endpoints in Scalar (`https://localhost:7154/scalar/v1`).

#### 👥 Nomcebo & Jabulile (Frontend Integration)
- [ ] Merge feature branches into `main`.
- [ ] Verify complete navigation flow for all 3 user roles (Resident, Driver, Admin).

#### 🤝 Whole Team Collaboration
- [ ] Joint debugging session to fix Mapbox vector marker rendering, empty state handling, and error toasts.

---

### 🟡 6. Sunday, 27 September 2026 — Cloud Deployment (Azure + Vercel / Netlify)

#### 👥 Sisekelo (Cuba) & Nosipho (Backend Deployment)
- [ ] Create **Azure App Service** instance for the ASP.NET Core API.
- [ ] Create **Azure SQL Database** (free student tier) and apply EF Core migrations (`dotnet ef database update`).

#### 👥 Nomcebo & Jabulile (Frontend Deployment)
- [ ] Deploy `frontend/` directory to **Vercel** or **Netlify**.
- [ ] Configure environment variable `VITE_API_BASE_URL` pointing to deployed Azure API URL.

---

### 🟡 7. Monday, 28 September 2026 — Demo Telemetry, Simulator & Presentation Rehearsal

#### 👤 Sisekelo (Cuba)
- [ ] Add `BackgroundServices/DamReadingSimulator.cs` for presentation demo.

#### 👤 Nosipho
- [ ] Export final Postman Collection and verify live Scalar documentation endpoints.

#### 👤 Nomcebo & Jabulile
- [ ] Final UI visual polish & HCI usability review (Nielsen Heuristics check).

#### 👥 Whole Team (Phase 4 Presentation Dry-Run)
- [ ] Conduct 2 full practice runs of the Phase 4 Capstone Presentation.