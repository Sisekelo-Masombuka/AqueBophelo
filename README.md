# AquaBophelo

**A water monitoring and truck tracking web system for Sol Plaatje Municipality, Kimberley, Northern Cape.**

Project · Diploma in ICT · Sol Plaatje University · `PROJECT(20262FNPRT630)`
Phase 4 (Implementation & Presentation) due **1 October 2026**.

---

## What is AquaBophelo?

*Bophelo* means "life", and water is exactly that. AquaBophelo helps a municipality and its residents answer two everyday questions:

1. **How much water do we have?** Dam levels are recorded, charted over time and colour-coded by status, with automatic alerts when levels drop.
2. **Where is the water truck?** Drivers broadcast their live GPS position while delivering water, and residents and admins watch the trucks move on a map in real time.

### User roles

| Role | What they do |
|---|---|
| **Resident** | View dam levels and trends, see live water trucks and schedules, subscribe to SMS / email alerts |
| **Driver** | See the assigned truck and route, start/end trips, broadcast GPS, mark stops complete |
| **Admin** | Manage dams, readings, trucks, drivers, routes, users and alerts from one dashboard |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (JavaScript) · Vite · Tailwind CSS · React Router · Leaflet (maps) · Chart.js (charts) |
| Backend | ASP.NET Core Web API (C#) · Entity Framework Core · SQL Server / Azure SQL |
| Auth | ASP.NET Core Identity + JWT, role-based (Resident / Driver / Admin) |
| Real-time | SignalR |
| API docs | OpenAPI + Scalar |
| Notifications | SMS (provider to be confirmed) · SendGrid email |
| Hosting | Vercel / Netlify (frontend) · Azure App Service + Azure SQL (backend) |

---

## Team

| Member | Role |
|---|---|
| Sisekelo Masombuka | Backend |
| Nosipho Mbatha | Backend |
| Nomcebo Nkosi | Frontend |
| Jabulile Shabalala | Frontend |

---

## Repository structure

```
AquaBophelo/
├── backend/
│   ├── AquaBophelo.slnx              Solution file (open this in Visual Studio)
│   └── AquaBophelo/                  ASP.NET Core Web API project
├── frontend/                         React + Vite + Tailwind app
├── docs/                             Project documentation, ER diagram, task briefs
├── .gitignore
├── .gitattributes
└── README.md
```

---

## Getting started

### 1. Prerequisites

Install these once:

- **Git**
- **.NET SDK** matching the `TargetFramework` in `backend/AquaBophelo/AquaBophelo.csproj` (for example .NET 9 for `net9.0`)
- **Node.js** (current LTS)
- **Visual Studio 2022** with the *ASP.NET and web development* workload and *SQL Server Express LocalDB* (or use VS Code with the C# extension)
- **EF Core CLI tool:** `dotnet tool install --global dotnet-ef`

### 2. Clone

```
git clone https://github.com/Sisekelo-Masombuka/AqueBophelo.git
cd AqueBophelo
```

(The GitHub repo name is spelled *Aque*; the project and folder names inside are spelled *Aqua*. That's expected.)

### 3. Trust the local HTTPS certificate (once per machine)

```
dotnet dev-certs https --trust
```

Click **Yes** on the Windows dialog. Without this, your browser will block calls from the frontend to the local API.

### 4. Run the backend

```
cd backend\AquaBophelo
dotnet run --launch-profile https
```

Or open `backend/AquaBophelo.slnx` in Visual Studio and press **F5** using the `https` profile.

- The API port is defined in `backend/AquaBophelo/Properties/launchSettings.json`.
- Interactive API docs (Scalar) open from the same address; check `Program.cs` for the exact route.
- Quick check: `GET /api/v1/health` should return `200` with `"status": "ok"`.

### 5. Run the frontend

In a **second** terminal:

```
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**. The URL of the API is set in `frontend/.env.development` (`VITE_API_BASE_URL`); it must match the port from step 4.

### 6. Check that everything is connected

Open http://localhost:5173. The **System Check** page should show **API: Online** and **Live: Connected**. If not:

| Symptom | Likely fix |
|---|---|
| API Offline, certificate error in the console | Run `dotnet dev-certs https --trust` (step 3) and restart the browser |
| API Offline, CORS error in the console | Make sure the frontend is on port `5173` and `Cors:AllowedOrigins` in `appsettings.Development.json` contains `http://localhost:5173` |
| API Offline, connection refused | The API isn't running, or `VITE_API_BASE_URL` has the wrong port |
| Port 5173 already in use | Close the other process; the port is fixed on purpose so CORS stays predictable |

---

## Configuration and secrets

- **Never commit secrets** (API keys, JWT signing key, SMS/email credentials, passwords).
- Backend secrets go in .NET user-secrets locally (`dotnet user-secrets set "Jwt:Key" "..."` from `backend/AquaBophelo`) and in Azure App Settings in production.
- Frontend variables live in `.env.development` (safe, non-secret values only). See `.env.example`.
- Each developer uses their own local database (SQL Server LocalDB). The schema is shared through EF Core migrations, and the sample data through code-based seeding. Database files are never committed.

---

## Working together

- **`main` must always run.** Don't push half-finished work straight to it.
- Work on short-lived branches named by area, for example `backend/dam-model`, `backend/trip-endpoints`, `frontend/live-map`, `frontend/admin-layout`, and open a pull request into `main`.
- Commit messages: `feat:`, `fix:`, `docs:`, `chore:` followed by a short description.
- **Backend:** pull `main` *before* adding an EF Core migration, and tell the other backend dev when you add one. Two people creating migrations at the same time cause conflicts in the model snapshot.
- **Frontend:** build against the endpoint list in the documentation and the live Scalar page. If a backend change alters a route or DTO, say so in the group chat straight away.
- Keep changes to `Program.cs` and `AppDbContext.cs` small and merge them quickly, since everyone touches them.

---

## Roadmap

| Step | Focus |
|---|---|
| 0 | Repo structure, tooling, frontend ↔ backend connection, GitHub *(bootstrap, current step)* |
| 1 | Data model from the ER diagram, database, migrations, seed data |
| 2 | Authentication, roles and role-based navigation |
| 3 | Dams and readings: CRUD, status colours, trend charts |
| 4 | Trucks, drivers, routes and trips |
| 5 | Live truck tracking with SignalR and the Leaflet map |
| 6 | Alerts and SMS / email notifications |
| 7 | Deployment (Azure + Vercel/Netlify), demo data, presentation |

---


---

## Academic note

AquaBophelo is a student capstone project developed at Sol Plaatje University. Sol Plaatje Municipality is the client context for the design; this is not an official municipal system.
