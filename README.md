# AquaBophelo 💧

**A Water Monitoring and Truck Tracking Web System for Sol Plaatje Municipality, Kimberley.**

AquaBophelo lets residents check live dam levels, track water-delivery trucks in real time, and report water issues — while giving municipal admins and drivers the tools to manage dams, fleets, and service requests from one platform.

> Capstone Project — `PROJECT(20262FNPRT630)` · Phase 4: Implementation & Presentation · Due 1 October 2026

---

## Table of Contents

- [About the Project](#about-the-project)
- [The Problem](#the-problem)
- [Team](#team)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [User Roles & Features](#user-roles--features)
- [Core Modules](#core-modules)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Real-Time Communication](#real-time-communication)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Design & HCI Principles](#design--hci-principles)
- [Roadmap](#roadmap)
- [License](#license)

---

## About the Project

AquaBophelo is a final-year capstone project built for **Sol Plaatje Municipality** in Kimberley, Northern Cape. It addresses a recurring local problem: residents often have no visibility into dam levels or water-truck delivery schedules during shortages, and the municipality has no digital system for tracking either.

The system is a full-stack web application with three coordinated pieces:

1. **Water Monitoring** — tracking and visualising dam/reservoir levels over time.
2. **Truck Tracking** — real-time GPS location of municipal water-delivery trucks on a live map.
3. **Issue Reporting & Alerts** — residents report shortages or leaks; admins triage and dispatch; residents and affected areas get notified via SMS/email.

## The Problem

Residents of Kimberley — particularly in areas affected by intermittent water supply — currently have no way to:
- See how full a nearby dam is, or whether levels are dropping.
- Know when a water-delivery truck is coming, or where it currently is.
- Report an issue without phoning the municipal call centre.

Municipal staff, in turn, have no centralised dashboard to monitor dam status across the region or coordinate truck dispatch in response to reports.

AquaBophelo solves this with a role-based web platform connecting residents, drivers, and municipal admins.

## Team

| Name | Role |
|---|---|
| Sisekelo Masombuka (Cuba) | Backend Developer — API, database, auth, real-time services |
| Nosipho Mbatha | Frontend Developer |
| Nomcebo Nkosi | Frontend Developer |
| Jabulile Shabalala | Frontend Developer |

Repository: [github.com/Sisekelo-Masombuka/AqueBophelo](https://github.com/Sisekelo-Masombuka/AqueBophelo)

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React.js + Tailwind CSS | Component-driven UI, fast styling, widely used in industry |
| Backend | ASP.NET Core Web API (C#) | Dominant in South African enterprise/government environments |
| ORM | Entity Framework Core | Code-first migrations, strong typing against SQL Server |
| Database | SQL Server / Azure SQL | Reliable, free student tier via Azure, standard in local industry |
| Authentication | ASP.NET Identity + JWT | Role-based access (Resident / Admin / Driver) |
| Real-Time | SignalR | Live truck location broadcast to connected clients |
| Mapping | Leaflet.js | Lightweight, free, open-source map rendering |
| Data Visualisation | Chart.js | Dam level trends, usage graphs |
| API Documentation | Scalar | Interactive API reference for backend endpoints |
| SMS Alerts | Twilio / Clickatell / BulkSMS | Shortage and dispatch notifications |
| Email | SendGrid | Account and report notifications |
| Hosting (Frontend) | Vercel / Netlify | Free, fast static hosting for the React app |
| Hosting (Backend) | Azure App Service + Azure SQL | Free student tier, industry-standard .NET hosting |

**.NET was deliberately chosen over Node.js/Express** because it is the dominant backend stack in South African enterprise and government IT environments, making this project more directly relevant to the team's target job market.

## System Architecture

AquaBophelo follows a layered (N-tier) architecture with a clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│  Presentation Layer                          │
│  React.js + Tailwind CSS (SPA)               │
│  — Resident, Admin, and Driver interfaces    │
└───────────────────┬───────────────────────────┘
                    │ HTTPS / REST + WebSocket (SignalR)
┌───────────────────▼───────────────────────────┐
│  API Layer                                   │
│  ASP.NET Core Controllers                    │
│  — Auth, Dams, Trucks, Reports, Alerts       │
└───────────────────┬───────────────────────────┘
┌───────────────────▼───────────────────────────┐
│  Business Logic Layer                        │
│  Services (DamService, TruckTrackingService, │
│  ReportService, NotificationService)         │
└───────────────────┬───────────────────────────┘
┌───────────────────▼───────────────────────────┐
│  Data Access Layer                           │
│  Entity Framework Core + Repositories        │
└───────────────────┬───────────────────────────┘
┌───────────────────▼───────────────────────────┐
│  Database                                    │
│  SQL Server / Azure SQL                      │
└─────────────────────────────────────────────┘

         ┌───────────────────────────┐
         │  Real-Time Layer          │
         │  SignalR Hub              │
         │  — broadcasts live truck  │
         │    location to clients    │
         └───────────────────────────┘
```

**Why this structure:** each layer only talks to the layer directly beneath it. Controllers never touch the database directly — they call services, which call repositories, which call the database. This keeps business rules (e.g. "flag a dam as critical below 20%") out of the controllers and out of the database, making the codebase easier for four people to work on in parallel without conflicts.

## User Roles & Features

### 🧍 Resident
- View live dam levels near their area, with historical trend charts.
- Track the assigned delivery truck on a live map with ETA.
- Report a water issue (leak, shortage, no delivery) with a location pin.
- Receive SMS/email alerts when a dam status changes or a truck is dispatched.

### 🚛 Driver
- View today's assigned delivery route.
- Start/end a trip — triggers live location broadcast via SignalR.
- Report a breakdown or delay mid-route.
- View trip history.

### 🛠️ Admin
- Dashboard view of all monitored dams and their current status.
- Manage the truck fleet and assign drivers to routes.
- Review and triage resident-submitted reports.
- Configure alert thresholds (e.g. auto-alert when a dam drops below 25%).
- View analytics/reporting (delivery frequency, report volume, response time).

## Core Modules

| Module | Description |
|---|---|
| **Auth Module** | Registration, login, JWT issuance, role assignment (Resident/Admin/Driver) |
| **Dam Monitoring Module** | CRUD for dams, level readings, historical data, status thresholds |
| **Truck Tracking Module** | Truck/driver assignment, live GPS location via SignalR, route history |
| **Reporting Module** | Resident-submitted issue reports, admin triage, status updates |
| **Notification Module** | SMS (Twilio/Clickatell) and email (SendGrid) alerts triggered by dam/truck/report events |
| **Analytics Module** | Chart.js visualisations of dam trends and delivery activity |

## Project Structure

```
AqueBophelo/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── resident/
│   │   │   ├── admin/
│   │   │   └── driver/
│   │   ├── services/            # API calls
│   │   └── hooks/
│   └── package.json
│
├── server/                      # ASP.NET Core backend
│   ├── Controllers/
│   ├── Models/                  # Dam.cs, Truck.cs, Report.cs, User.cs...
│   ├── Services/                # Business logic
│   ├── Repositories/            # Data access
│   ├── Hubs/                    # SignalR TruckTrackingHub
│   ├── Data/                    # DbContext, migrations
│   ├── Program.cs
│   └── appsettings.json
│
├── docs/                        # ER diagrams, wireframes, reports
└── README.md
```

## Getting Started

### Prerequisites
- Visual Studio 2026 (Community) or VS Code
- .NET SDK 8+
- Node.js 18+
- SQL Server (local) or an Azure SQL connection string

### Backend Setup
```bash
cd server
dotnet restore
dotnet ef database update
dotnet run
```
The API will start and expose Scalar API documentation at `/scalar` for testing endpoints.

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create an `appsettings.Development.json` in `server/` (never commit real secrets):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=AquaBophelo;..."
  },
  "Jwt": {
    "Key": "",
    "Issuer": "",
    "Audience": ""
  },
  "Twilio": {
    "AccountSid": "",
    "AuthToken": ""
  },
  "SendGrid": {
    "ApiKey": ""
  }
}
```

## Database

Entities are modelled from the team's ER diagram (see `/docs`) and include, at minimum: `Dam`, `DamReading`, `Truck`, `Driver`, `Route`, `Report`, `User`, and `Alert`. Relationships and full schema notes live in `/docs/er-diagram`.

## Real-Time Communication

Truck location updates are pushed via a **SignalR Hub** (`TruckTrackingHub`). The Driver app sends periodic location updates while a trip is active; the Hub broadcasts these to all Residents and Admins currently viewing that truck's route, so the map updates live without polling.

## API Documentation

The backend exposes interactive API documentation via **Scalar**, available at `/scalar` when the API is running locally. This documents all endpoints across the Auth, Dams, Trucks, Reports, and Alerts controllers.

## Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel / Netlify |
| Backend API | Azure App Service (free student tier) |
| Database | Azure SQL (free student tier) |

## Design & HCI Principles

The UI follows a blue (trust/water) and clay/ochre (local landscape) colour system, with red/amber/green used consistently across dam levels, alerts, and truck status. Interface decisions are grounded in Nielsen's usability heuristics — visibility of system status (live "last updated" timestamps), user control and error prevention (confirmation before destructive actions), and accessibility (high contrast, large tap targets, mobile-first layout for low-end devices and constrained data).

## Roadmap

- [x] Backend project setup, Scalar integration
- [ ] Core models (`Dam`, `Truck`, `Report`, `User`) and database migrations
- [ ] Authentication & role-based authorization
- [ ] Dam monitoring endpoints + Chart.js integration
- [ ] SignalR truck tracking hub + Leaflet map integration
- [ ] Resident reporting flow
- [ ] SMS/email alert integration
- [ ] Admin dashboard & analytics
- [ ] Deployment to Azure/Vercel
- [ ] Final testing & presentation (Phase 4, due 1 Oct 2026)

## License

This is an academic capstone project developed for educational purposes as part of `PROJECT(20262FNPRT630)`.
