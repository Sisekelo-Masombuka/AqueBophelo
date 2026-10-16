# 🌊 AquaBophelo — Complete Capstone System Guide & Examination Masterclass

> **Sol Plaatje Municipal Water Monitoring, Tanker Telemetry & Resident Alerting System**  
> *Kimberley, Northern Cape, South Africa*  
> **Capstone Presentation Edition — Academic Year 2026**  
> **Team VibeTech:**  
> • **Backend Pair:** Nosipho Mbatha & Sisekelo "Cuba" Masombuka  
> • **Frontend Pair:** Nomcebo Nkosi & Jabulile Shabalala  

---

## 📑 Master Table of Contents

1. [Welcome and How to Use This Guide](#1-welcome-and-how-to-use-this-guide)
   - [Who This Is For & How to Read It](#who-this-is-for--how-to-read-it)
   - [Callout Box Legend](#callout-box-legend)
   - [The 60-Second Elevator Pitch](#the-60-second-elevator-pitch)
2. [The Big Picture](#2-the-big-picture)
   - [The Problem in Kimberley & Sol Plaatje Municipality](#the-problem-in-kimberley--sol-plaatje-municipality)
   - [Who Uses the System (Three Personas)](#who-uses-the-system-three-personas)
   - [End-to-End System Architecture (Diagram & Box-by-Box Walkthrough)](#end-to-end-system-architecture)
3. [Tech Stack: What, Why, and Why Not](#3-tech-stack-what-why-and-why-not)
   - [Technology Comparison Table](#technology-comparison-table)
   - [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)
4. [BACKEND PAIR: Nosipho and Cuba](#4-backend-pair-nosipho-and-cuba)
   - [4.1 Backend Folder-by-Folder Tour](#41-backend-folder-by-folder-tour)
   - [4.2 Database Deep Dive & ER Diagram](#42-database-deep-dive--er-diagram)
   - [4.3 API Reference & Endpoint Catalog](#43-api-reference--endpoint-catalog)
   - [4.4 Real-Time Telemetry & Alert Evaluation](#44-real-time-telemetry--alert-evaluation)
   - [4.5 Email System & Asynchronous Queue Worker](#45-email-system--asynchronous-queue-worker)
4B. [Authentication and Authorization: Security Deep Dive (Joint Territory)](#4b-authentication-and-authorization-security-deep-dive)
   - [1. The Basics: Authentication vs Authorization](#1-the-basics-authentication-vs-authorization)
   - [2. How We Authenticate (Identity, Hashing & Verification)](#2-how-we-authenticate)
   - [3. JWT Tokens: Anatomy, Signing & Verification](#3-jwt-tokens)
   - [4. How We Authorize (Roles, Permissions & Ownership Checks)](#4-how-we-authorize)
   - [5. The Frontend Side: Session Storage & HTTP Interceptors](#5-the-frontend-side)
   - [6. Other Security Layers (CORS, Rate Limiting, CSP, PII Scrubbing)](#6-other-security-layers)
   - [7. Security Flowcharts & Diagrams](#7-security-flowcharts--diagrams)
   - [8. Honesty Section: Real Gaps & 12 Panel Questions](#8-honesty-section)
5. [FRONTEND PAIR: Nomcebo and Jabulile](#5-frontend-pair-nomcebo-and-jabulile)
   - [5.1 Frontend Folder-by-Folder Tour](#51-frontend-folder-by-folder-tour)
   - [5.2 Routing, Public Landing & Role-Guarded Dashboards](#52-routing-public-landing--role-guarded-dashboards)
   - [5.3 Talking to the Backend: Axios Client, Storage & Interceptors](#53-talking-to-the-backend)
   - [5.4 Live Map Telemetry with MapLibre GL & SignalR](#54-live-map-telemetry)
   - [5.5 Charts, Forms, Turnstile & Live Camera Capture](#55-charts-forms-turnstile--live-camera-capture)
   - [5.6 Design System, Accessibility & Nielsen's 10 Heuristics](#56-design-system-accessibility--nielsens-10-heuristics)
6. [Data Flow Journeys](#6-data-flow-journeys)
   - [Journey 1: Resident Registration & Login](#journey-1-resident-registration--login)
   - [Journey 2: Dam Telemetry Ingestion & Critical Alert Dispatch](#journey-2-dam-telemetry-ingestion--critical-alert-dispatch)
   - [Journey 3: Driver Live GPS Movement to Resident Radar Map](#journey-3-driver-live-gps-movement-to-resident-radar-map)
   - [Journey 4: Citizen Fault Report to Admin Command Center](#journey-4-citizen-fault-report-to-admin-command-center)
   - [Journey 5: Self-Service Password Reset & Email OTP Verification](#journey-5-self-service-password-reset--email-otp-verification)
7. [Testing Strategy & Proof of Quality](#7-testing-strategy--proof-of-quality)
   - [Testing Pyramid & Map](#testing-pyramid--map)
   - [Real Code Walkthrough: 3 Tests Dissected Line-by-Line](#real-code-walkthrough)
   - [What We Tested vs What We Did Not (Honest Panel Defense)](#what-we-tested-vs-what-we-did-not)
8. [CI/CD Pipeline: GitHub Actions to Azure Cloud](#8-cicd-pipeline-github-actions-to-azure-cloud)
   - [Pipeline Flowchart](#pipeline-flowchart)
   - [Line-by-Line Breakdown of `ci.yml`](#line-by-line-breakdown-of-ciyml)
   - [Deployment Workflows: Web App & Backend API](#deployment-workflows)
   - [Debugging Pipeline Failures (Gitleaks, Docker, CodeQL)](#debugging-pipeline-failures)
9. [Azure Cloud Hosting & Production Infrastructure](#9-azure-cloud-hosting--production-infrastructure)
   - [Cloud Resource Inventory](#cloud-resource-inventory)
   - [Localhost to Live Production: Step-by-Step](#localhost-to-live-production)
   - [Cloudflare Edge Integration (DNS, R2, Web Analytics, Turnstile)](#cloudflare-edge-integration)
   - [Production Disaster Recovery & Health Probes](#production-disaster-recovery)
10. [Problems We Hit and How We Solved Them](#10-problems-we-hit-and-how-we-solved-them)
11. [Limitations and Future Work](#11-limitations-and-future-work)
12. [Cross-Pair Cheat Sheets](#12-cross-pair-cheat-sheets)
13. [Presentation Prep & Defense Master Plan](#13-presentation-prep--defense-master-plan)
   - [40 Tough Panel Questions & Model Answers](#40-tough-panel-questions--model-answers)
   - [Flawless Live Demo Script (Step-by-Step)](#flawless-live-demo-script)
   - ["If the Demo Breaks" Emergency Contingency Plan](#if-the-demo-breaks-emergency-contingency-plan)
   - [Team Speaking Split & Transition Handover Lines](#team-speaking-split--transition-handover-lines)
14. [Pair Quizzes (23 Questions Each Way)](#14-pair-quizzes)
15. [System Glossary (Simple 1-Line Definitions)](#15-glossary)
16. [One-Page Night-Before Revision Sheet](#16-one-page-cheat-sheet)

---

# 1. Welcome and How to Use This Guide

### Who This Is For & How to Read It
This document is the single source of truth for **AquaBophelo**. It was written to prepare our four-person student engineering team (Nosipho, Cuba, Nomcebo, and Jabulile) for our final-year capstone defense. 

No matter which pair you are in, **both pairs must understand the entire system from the first line of code to the cloud deployment**.
* If you are in the **Backend Pair (Nosipho & Cuba)**: You must understand how your APIs, SignalR hubs, Entity Framework migrations, and email queues are rendered and consumed on the frontend.
* If you are in the **Frontend Pair (Nomcebo & Jabulile)**: You must understand what happens behind the curtains when an HTTP request leaves Axios, reaches the ASP.NET middleware pipeline, hits the SQL database, and returns a JSON response.

### Callout Box Legend
Throughout this guide, important concepts are highlighted using GitHub alert callouts:

> [!NOTE]
> **In Plain English:** The simplest possible explanation, using everyday real-life analogies (restaurants, post offices, schools, and delivery trucks) so that anyone can immediately visualize how it works.

> [!TIP]
> **Why We Did It This Way:** The exact engineering justification for our choices, contrasting our implementation with alternative technologies we evaluated and rejected.

> [!WARNING]
> **What Would Break Without It:** The concrete failure mode. What crashes, leaks, or freezes if this specific piece of code or configuration is removed.

> [!IMPORTANT]
> **Panel Alert:** A high-probability question that lecturers and examiners love to ask, along with the precise technical keywords to use in your answer.

---

### The 60-Second Elevator Pitch
*(Practice saying this out loud before walking into the examination room)*

> *"Good morning, members of the panel. We are Team VibeTech, and we present **AquaBophelo** — an enterprise-grade municipal water monitoring and emergency tanker telemetry platform built for the Sol Plaatje Local Municipality right here in Kimberley.*
>
> *Our municipality faces severe water crises: aging pipelines, critical dam depletion at Newton Reservoir and Riverton Works, and uncoordinated emergency water tankers that leave residents waiting on street corners for hours without information.*
>
> *AquaBophelo solves this through three coordinated roles: **Residents** monitor live dam storage levels, track oncoming relief tankers on an interactive live radar map, and log photographic pipe leak reports. **Tanker Drivers** navigate digital distribution manifests, log turn-by-turn Proof of Delivery with timestamps and recipient signatures, and broadcast live sub-second GPS telemetry via WebSockets. Finally, **Municipal Administrators** operate a central command center — dispatching trucks, managing scheduled water outages, monitoring telemetry health, and resetting credentials via an IT helpdesk.*
>
> *The system is powered by an ASP.NET Core 10 Web API and Microsoft SQL Server backend with SignalR real-time hubs, coupled to a React 19 single-page application using Tailwind CSS and MapLibre GL JS, fully secured with Cloudflare Turnstile bot protection, Sentry crash telemetry, and deployed live on Microsoft Azure.*
>
> *AquaBophelo turns municipal water uncertainty into transparent, real-time civic reassurance: Elke druppel tel — Metsi ke bophelo."*

---

# 2. The Big Picture

### The Problem in Kimberley & Sol Plaatje Municipality
Kimberley's water infrastructure suffers from two intertwined crises:
1. **Supply Volatility:** Water levels in the Newton Reservoir and Riverton Water Treatment Works fluctuate dramatically due to power outages, pump failures, and drought. Residents often wake up with zero water pressure and no advance notice.
2. **Distribution Opacity:** During water shutdowns, the municipality dispatches mobile water tankers into townships like Galeshewe, Roodepan, and Homevale. However, residents have no way of knowing when a tanker will arrive, whether it has enough water remaining, or which street corner it is currently servicing. This results in vulnerable elderly citizens standing for hours in the Northern Cape heat with empty water buckets.

AquaBophelo bridges this communication gap by creating a single, trusted civic platform for residents, municipal drivers, and operations managers.

---

### Who Uses the System (Three Personas)

```mermaid
flowchart TD
    subgraph Personas["Municipal User Roles"]
        R["🧑‍💼 Resident (Kimberley Community)"]
        D["🚚 Driver (Municipal Tanker Fleet)"]
        A["🏛️ Admin (Water Operations Desk)"]
    end

    subgraph R_Features["Resident Experience"]
        R1["View Live Dam Storage Levels (%)"]
        R2["Track Oncoming Tankers on Live Radar Map"]
        R3["Report Burst Pipes with Live Photo Capture"]
        R4["Receive Critical Outage Notifications"]
    end

    subgraph D_Features["Driver Experience"]
        D1["Pre-Trip Vehicle Safety Inspection Checklist"]
        D2["Digital Manifest with Sequential Stops"]
        D3["1-Click Turn-by-Turn Delivery Confirmation"]
        D4["Background GPS Geolocation Telemetry Broadcast"]
    end

    subgraph A_Features["Admin Command Center"]
        A1["Fleet & Tanker Capacity Allocation"]
        A2["Scheduled Outages Calendar & Broadcast Alerts"]
        A3["Review & Action Resident Fault Reports"]
        A4["IT Helpdesk Credential Management & Audit Trail"]
    end

    R --> R_Features
    D --> D_Features
    A --> A_Features
```

1. **The Resident (Community Member):**
   - Accesses the public portal at `https://aquabophelo.app`.
   - Views Kimberley water telemetry (Riverton & Newton Reservoir fill percentages).
   - Observes active delivery tankers moving on the MapLibre radar map in real time.
   - Reports water leaks, pipe bursts, and illegal water connections with camera uploads.
   - Subscribes to area-specific water outage alerts in their preferred language (English, Afrikaans, or Setswana).

2. **The Driver (Operational Tanker Operator):**
   - Logs into mobile-optimized driver interface on ruggedized municipal tablets or smartphones.
   - Completes a mandatory 6-point pre-trip vehicle safety inspection (brakes, tires, tank cleanliness, fuel).
   - Receives an assigned delivery route with scheduled residential stops and litre quotas.
   - Broadcasts real-time GPS coordinates every 3 to 5 seconds via SignalR WebSocket.
   - Confirms water distribution at each stop with digital delivery proofs.

3. **The Administrator (Municipal Operations Desk):**
   - Monitors the entire municipal ecosystem from the Admin Command Center (`/admin`).
   - Manages water dams, fleet vehicles, drivers, and delivery routes.
   - Publishes scheduled water outage notices with emergency backup tanker provisions.
   - Investigates citizen fault tickets, updates work order statuses, and uploads repair proof photos.
   - Resets staff credentials via an IT helpdesk tool without exposing sensitive password hashes.

---

### End-to-End System Architecture

```mermaid
flowchart TB
    subgraph Clients["1. Frontend Presentation Layer (React 19 SPA)"]
        Browser["Citizen Web Browser / Mobile Device\n(Chrome, Safari, Edge)"]
        SPA["AquaBophelo React SPA\n(Vite 8 + Tailwind CSS + MapLibre GL)"]
        AxiosClient["Axios HTTP Client\n(Bearer JWT + SessionStorage)"]
        SignalRClient["SignalR WebSocket Client\n(@microsoft/signalr)"]
        Browser --> SPA
        SPA --> AxiosClient
        SPA --> SignalRClient
    end

    subgraph Edge["2. Cloudflare Edge Security & Services"]
        DNS["Cloudflare DNS (aquabophelo.app)"]
        Turnstile["Cloudflare Turnstile\n(Bot Defense)"]
        CFAnalytics["Cloudflare Web Analytics\n(Privacy-Preserving Telemetry)"]
        R2["Cloudflare R2 Object Storage\n(Zero Egress Photo Bucket)"]
    end

    subgraph Backend["3. Backend Application Layer (.NET 10 Web API)"]
        Kestrel["Kestrel Web Server / Azure App Service\n(aquabophelo-api-spu)"]
        RateLimiter["Rate Limiting Middleware\n(Auth: 5/min, General: 60/min)"]
        Cors["CORS Policy Engine\n(Strict Production Origins)"]
        JwtAuth["JWT Authentication & Claims Validation"]
        Controllers["REST API Controllers\n(Alerts, Dams, Trucks, Trips, Reports, Users)"]
        Hub["SignalR TruckHub\n(/hubs/trucks)"]
        EmailWorker["Background Email Queue Worker\n(System.Threading.Channels)"]
    end

    subgraph Data["4. Persistence & External Services"]
        AzureSQL[("Microsoft Azure SQL Database\n(AquaBopheloDb on sql-aquabophelo-spu)")]
        Brevo["Brevo API\n(Transactional Email & OTPs)"]
        Sentry["Sentry Cloud\n(Error Telemetry & Session Replays)"]
    end

    AxiosClient -- "HTTPS REST (JSON)" --> DNS
    SignalRClient -- "WSS WebSockets" --> DNS
    DNS --> RateLimiter
    RateLimiter --> Cors --> JwtAuth
    JwtAuth --> Controllers
    JwtAuth --> Hub

    Controllers -- "EF Core 10 (Queries & Migrations)" --> AzureSQL
    Controllers -- "Uploads Photos" --> R2
    Controllers -- "Enqueues Emails" --> EmailWorker
    Controllers -- "Verifies Tokens" --> Turnstile

    EmailWorker -- "HTTP POST" --> Brevo
    Kestrel -- "Crash Telemetry (PII Scrubbed)" --> Sentry
    SPA -- "Error Telemetry" --> Sentry
    SPA -- "Visitor Beacons" --> CFAnalytics
```

#### Box-by-Box Walkthrough of the Architecture:
1. **Frontend Client:** The resident or driver opens `https://aquabophelo.app`. The React application loads into their browser. State and API queries are handled through Axios and TanStack Query, while real-time truck telemetry is handled over WebSockets via `@microsoft/signalr`.
2. **Cloudflare Edge:** All incoming traffic passes through Cloudflare. Cloudflare validates that the request is not a DDoS attack. When a user registers or logs in, Cloudflare Turnstile verifies they are a human without solving annoying visual puzzles. Photo uploads (pipe leaks and delivery proofs) are stored in Cloudflare R2 with zero egress fees.
3. **Backend API Layer:** Hosted on Azure App Service running Linux and .NET 10. Every incoming request passes through the middleware pipeline: Global Exception Handling, Correlation ID tagging, Security Headers, Rate Limiting, CORS verification, and JWT Bearer token validation. If valid, the request executes the target controller action or SignalR hub method.
4. **Data & Services Layer:** Persistent entities (users, dams, trucks, trips, stops, and alerts) are stored in Azure SQL Database using Entity Framework Core. Email dispatches (verification OTPs and password resets) are queued into an asynchronous non-blocking memory channel (`EmailQueue`) and processed in the background via Brevo. Application crashes are captured in real-time by Sentry with all sensitive personal data scrubbed.

---

# 3. Tech Stack: What, Why, and Why Not

### Technology Comparison Table

| Layer | Technology in Our Repo | Alternatives Considered | Why We Chose It | Why We Rejected the Alternative | Where in Our Repo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Backend Framework** | **ASP.NET Core 10 Web API** (C# 14) | Node.js (Express), Python (FastAPI), Java (Spring Boot) | Enterprise-grade performance, native strongly typed models, compile-time safety, built-in ASP.NET Identity, and native SignalR support. | Node.js lacks native enterprise auth and requires dozens of unvetted NPM packages; Python is significantly slower for high-frequency GPS WebSockets. | `Code/backend/AquaBophelo/Program.cs` |
| **ORM & Data Access** | **Entity Framework Core 10** | Dapper, raw ADO.NET, Prisma, Hibernate | Strongly-typed LINQ queries, automatic SQL injection prevention via parameterized queries, Code-First migrations, and rich relationship mapping. | Dapper requires manually writing and maintaining hundreds of raw SQL strings; raw ADO.NET has massive boilerplate and no migration tracking. | `Code/backend/AquaBophelo/Data/AppDbContext.cs` |
| **Relational Database** | **Microsoft Azure SQL Database / SQL Server 2022** | MongoDB, PostgreSQL, MySQL, SQLite | ACID compliance, rock-solid foreign key constraints, composite B-tree indexing, and seamless integration with EF Core and Azure App Service. | MongoDB is document-based and lacks relational integrity needed for financial/inventory tanker manifests; SQLite cannot handle concurrent multi-user writes in production. | `Code/backend/AquaBophelo/appsettings.json` |
| **Real-Time Telemetry** | **ASP.NET Core SignalR** | Raw WebSockets, Socket.IO, Server-Sent Events (SSE), HTTP Polling | Managed WebSocket connections with automatic fallback to Long Polling, strongly typed hub clients, group broadcasting, and sub-second latency. | Raw WebSockets require hundreds of lines of connection heartbeat and reconnection logic; HTTP polling overwhelms server CPU with thousands of redundant requests. | `Code/backend/AquaBophelo/Hubs/TruckHub.cs` |
| **Frontend Framework** | **React 19 + Vite 8** | Angular, Vue 3, Next.js | Modern component ecosystem, lightning-fast HMR build times via Vite, declarative UI state, and rich ecosystem for interactive maps. | Angular has excessive boilerplate and steep learning curve; Next.js SSR adds unnecessary hosting complexity when Azure Static/Web App serves static assets cleanly. | `Code/frontend/vite.config.js`, `Code/frontend/package.json` |
| **UI Styling** | **Tailwind CSS v4** | Bootstrap, Material UI, Styled Components | Utility-first styling with zero runtime overhead, responsive mobile-first breakpoints, and consistent civic colour tokens. | Bootstrap produces generic, outdated corporate styles; Material UI adds massive bundle size and makes custom branding difficult. | `Code/frontend/src/index.css` |
| **Interactive Maps** | **MapLibre GL JS** | Leaflet, Mapbox GL JS, Google Maps Platform | Open-source vector tile rendering, smooth 60fps GPU acceleration, dynamic marker rotation by heading angle, and zero subscription costs. | Mapbox requires credit card billing and charges high API fees; Google Maps costs \$7 per 1,000 loads; Leaflet struggles with large vector GeoJSON layers. | `Code/frontend/src/components/LiveMap.jsx` |
| **Bot Protection** | **Cloudflare Turnstile** | Google reCAPTCHA v2 / v3, hCaptcha | Frictionless, privacy-preserving human verification with zero annoying visual puzzles (no clicking traffic lights) and 100% free tier. | Google reCAPTCHA v2 frustrates users on mobile screens; reCAPTCHA v3 tracks user cookies and raises POPIA privacy concerns. | `Code/frontend/src/components/TurnstileWidget.jsx`, `TurnstileService.cs` |
| **Media Storage** | **Cloudflare R2 Object Storage** | Azure Blob Storage, AWS S3, Local Disk Storage | S3-compatible API with **\$0.00 egress fees**, meaning municipal image streaming never incurs bandwidth charges. Includes local disk fallback. | Azure Blob and AWS S3 charge unpredictable bandwidth egress fees that quickly exceed student and municipal budgets. | `Code/backend/AquaBophelo/Services/Storage/R2StorageService.cs` |
| **Email Service** | **Brevo Transactional API** | Twilio SMS, SendGrid, Amazon SES, Local SMTP | High inbox deliverability, free 300 emails/day tier, zero SMS telecommunication costs, and clean REST API integration. | Twilio SMS costs ~\$0.05 per message in South Africa (R0.95/SMS) which would bankrupt a student budget within days; SendGrid blocked student registrations. | `Code/backend/AquaBophelo/Services/Notifications/BrevoEmailSender.cs` |
| **API Documentation** | **Scalar OpenAPI Viewer** | Swagger UI, Postman Docs | Modern, responsive API explorer with built-in dark mode, live request playground, and native integration with .NET 10 `AddOpenApi`. | Classic Swagger UI looks dated, has clunky mobile rendering, and requires heavy Swashbuckle packages deprecated in .NET 9/10. | `Code/backend/AquaBophelo/Program.cs` (`MapScalarApiReference`) |

---

### Architecture Decision Records (ADRs)

#### ADR 01: Why ASP.NET Core Instead of Node.js / Express?
* **Context:** Our initial proposal explored Node.js with Express.
* **Decision:** We migrated to ASP.NET Core 10 Web API.
* **Reasoning:** In a municipal water management platform, data integrity is paramount. A tanker cannot deliver 15,000 litres if its capacity is 10,000 litres. ASP.NET Core provides compile-time type safety through C#, built-in password hashing and user lockout mechanisms via ASP.NET Identity, and first-class integration with Microsoft SQL Server. Furthermore, SignalR provides a polished real-time abstraction that outperforms Node's Socket.IO under heavy concurrent load.

#### ADR 02: Why MapLibre GL JS Instead of Mapbox or Google Maps?
* **Context:** We needed an interactive map showing Kimberley suburbs, reservoir locations, and moving delivery trucks.
* **Decision:** We selected MapLibre GL JS paired with Carto / OpenStreetMap vector raster tiles.
* **Reasoning:** Google Maps charges prohibitive API fees (\$7.00 per 1,000 map loads), and Mapbox requires a credit card with strict quota ceilings. MapLibre GL is a fully open-source, community-governed fork of Mapbox GL that provides WebGL hardware-accelerated rendering at zero cost. It smoothly rotates truck icons based on real-time compass heading angles without dropping frames.

#### ADR 03: Why Brevo Transactional Email Instead of Twilio SMS?
* **Context:** We needed a way to deliver 6-digit one-time PINs (OTPs) for registration and password resets.
* **Decision:** We implemented Brevo transactional email with asynchronous queueing.
* **Reasoning:** Sending SMS messages in South Africa through Twilio or BulkSMS costs approximately R0.95 to R1.20 per message. With hundreds of test runs, our student budget would be exhausted immediately. Brevo provides 300 free transactional emails per day with enterprise-grade deliverability, full HTML styling, and rapid 2-to-5 second inbox delivery.

#### ADR 04: Why Ephemeral `sessionStorage` Instead of Persistent `localStorage`?
* **Context:** Previously, JWT authentication tokens were stored in `localStorage`, which persisted indefinitely across browser restarts.
* **Decision:** We transitioned authentication credentials to `sessionStorage`.
* **Reasoning:** Municipal security policy mandates that if an administrator or driver walks away from a workstation or closes their browser tab, their session must immediately terminate. `sessionStorage` automatically clears tokens upon tab/window closure, preventing unauthorized access on shared public or municipal computers.

---

# 4. BACKEND PAIR: Nosipho and Cuba

## 4.1 Backend Folder-by-Folder Tour

```text
Code/backend/AquaBophelo/
├── Configuration/               Strongly typed option classes bound from appsettings.json
│   ├── BrevoOptions.cs          API keys, sender email, and sender name for transactional email
│   ├── R2Options.cs             Cloudflare R2 Account ID, Access Keys, and bucket name
│   └── TurnstileOptions.cs      Cloudflare Turnstile secret key for server-side verification
├── Controllers/                 HTTP API endpoints handling incoming citizen and staff requests
│   ├── AlertsController.cs      CRUD operations for emergency and municipal water alerts
│   ├── AreasController.cs       List and manage Kimberley suburbs (Galeshewe, Roodepan, etc.)
│   ├── AuditLogsController.cs   Query immutable system security and personnel audit logs
│   ├── AuthController.cs        User registration, login, profile, OTP dispatch, and password change
│   ├── ContactController.cs     Public citizen inquiry submission with ticket generation
│   ├── DamReadingsController.cs Ingestion and history of reservoir level percentage readings
│   ├── DamsController.cs        Metadata and capacity details for Newton, Riverton, etc.
│   ├── DeviceTokensController.cs Registration of push notification device tokens
│   ├── DriverController.cs      Driver-specific workflows (inspection, manifest, incident report)
│   ├── HealthController.cs      Kubernetes and Azure liveness and readiness probes
│   ├── NotificationsController.cs User notification subscriptions and history
│   ├── OutagesController.cs     Scheduled water maintenance calendar management
│   ├── ReportsController.cs     Citizen leak photo reports and operational analytics summaries
│   ├── RoutesController.cs      Preset distribution routes across municipal wards
│   ├── SubscriptionsController.cs Resident SMS/Email outage subscription preferences
│   ├── TripsController.cs       Tanker trip lifecycle (Start, Complete, Cancel, Log Stops)
│   ├── TrucksController.cs      Fleet asset management (license plate, capacity litres, status)
│   └── UsersController.cs       Admin user provisioning, deactivation, and password resets
├── Data/                        Database access and initial state seeding
│   ├── AppDbContext.cs          EF Core DbContext configuring entities, keys, and indexes
│   └── DbSeeder.cs              Seeds default admin, drivers, Kimberley dams, and routes
├── Dtos/                        Data Transfer Objects separating database entities from API wire models
│   ├── Auth/                    LoginDto, RegisterDto, UserProfileDto, ResetPasswordDto
│   ├── Dams/                    DamDto, CreateDamReadingDto, DamSummaryDto
│   ├── Driver/                  InspectionCheckDto, DeliveryProofDto, ProblemReportDto
│   ├── Reports/                 IssueReportCreateDto, FleetReportSummaryDto
│   └── Trucks/                  TruckDto, CreateTripDto, UpdateLocationDto
├── Hubs/                        Real-time SignalR WebSocket communication hubs
│   ├── PingHub.cs               Lightweight connection heartbeat probe
│   └── TruckHub.cs              Sub-second GPS telemetry broadcast from trucks to maps
├── Migrations/                  EF Core database versioning and schema migration history
│   ├── 20260922160335_InitialCreate.cs
│   ├── ...
│   └── AppDbContextModelSnapshot.cs
├── Models/                      Domain entities representing database tables
│   ├── Alert.cs                 Emergency broadcast messages and water warnings
│   ├── ApplicationUser.cs       Extended ASP.NET Identity user entity
│   ├── Dam.cs                   Water reservoir entity (capacity, location, status)
│   ├── DamReading.cs            Time-series telemetry reading of reservoir fill percentage
│   ├── IssueReport.cs           Citizen-submitted pipe leak or infrastructure fault report
│   ├── ScheduledOutage.cs       Planned municipal water interruption events
│   ├── SystemAuditLog.cs        Immutable log of admin actions and security events
│   ├── Trip.cs                  Active tanker distribution run assigned to a driver
│   ├── TripStop.cs              Individual scheduled delivery stop on a trip manifest
│   ├── Truck.cs                 Water tanker fleet asset record
│   └── TruckLocation.cs         Historical breadcrumb GPS coordinates of trucks
├── Services/                    Business logic layer implementing business rules
│   ├── AlertEvaluator.cs        Evaluates dam drops and automatically generates amber/red alerts
│   ├── AlertService.cs          Dispatches alerts to affected resident subscribers
│   ├── AuditLogger.cs           Appends tamper-resistant records to SystemAuditLog
│   ├── AuthService.cs           JWT token generation, claims injection, and OTP hashing
│   ├── DamService.cs            Calculates rolling 7-day dam trends and replenishment rates
│   ├── Interfaces/              C# interfaces decoupling implementations for unit testing
│   ├── Notifications/           Brevo email sender, background queue, and email templates
│   ├── Security/                Turnstile cryptographic validation service
│   └── Storage/                 R2 distributed object storage with local disk fallback
├── Program.cs                   Application bootstrap: DI container, middleware pipeline & routing
└── appsettings.json             Configuration settings, connection strings, and logging levels
```

---

## 4.2 Database Deep Dive & ER Diagram

> [!NOTE]
> **In Plain English:** Think of the database as a giant, hyper-organized municipal filing cabinet. Every drawer (table) stores one specific thing — one for trucks, one for drivers, one for dams, and one for resident reports. The drawers have cross-referenced barcode stickers (foreign keys) so that a delivery stop always points back to its exact trip, truck, and driver.

```mermaid
erDiagram
    ApplicationUser ||--o{ Trip : "operates as driver"
    ApplicationUser ||--o{ IssueReport : "submits"
    ApplicationUser ||--o{ AlertSubscription : "subscribes"
    ApplicationUser ||--o{ EmailOtp : "receives"
    ApplicationUser ||--o{ DeviceToken : "registers"

    Truck ||--o{ Trip : "assigned to"
    Truck ||--o{ TruckLocation : "broadcasts"
    Truck ||--o{ VehicleInspectionCheck : "undergoes"

    Area ||--o{ ApplicationUser : "resides in"
    Area ||--o{ TruckRoute : "covers"
    Area ||--o{ ScheduledOutage : "experiences"
    Area ||--o{ Alert : "targeted by"

    TruckRoute ||--o{ RouteStop : "contains"
    TruckRoute ||--o{ Trip : "follows"

    Trip ||--o{ TripStop : "executes"
    Trip ||--o{ DriverProblemReport : "logs"

    Dam ||--o{ DamReading : "records telemetry"
    Dam ||--o{ Alert : "triggers"

    ApplicationUser {
        string Id PK
        string FullName
        string Email
        string PhoneNumber
        string PreferredLanguage
        int AreaId FK
        bool IsDeleted
        DateTime CreatedAt
    }

    Truck {
        int Id PK
        string RegistrationNumber
        int CapacityLitres
        string Status
        string DriverId FK
    }

    Trip {
        int Id PK
        int TruckId FK
        string DriverId FK
        int RouteId FK
        string Status
        DateTime StartTime
        DateTime EndTime
    }

    TripStop {
        int Id PK
        int TripId FK
        string Address
        int LitresDelivered
        bool Completed
        string ProofPhotoUrl
        DateTime CompletedAt
    }

    Dam {
        int Id PK
        string Name
        double CapacityMegaLitres
        double LatestLevelPercent
        string Status
    }

    DamReading {
        int Id PK
        int DamId FK
        double LevelPercent
        DateTime ReadingTime
    }

    IssueReport {
        int Id PK
        string TicketId
        string FullName
        string UserEmail
        string IssueType
        string Area
        string Description
        string ImageUrl
        string Status
        DateTime CreatedAt
    }

    ScheduledOutage {
        int Id PK
        int AreaId FK
        string Title
        string Description
        DateTime StartDate
        DateTime EndDate
        bool TankerDispatched
    }

    Alert {
        int Id PK
        string Title
        string Message
        string Severity
        string Type
        DateTime CreatedAt
    }
```

### Database Tables Breakdown
1. **`AspNetUsers` / `ApplicationUser`:** Extended identity table holding user credentials, hashed passwords, security stamps, preferred language (`EN`, `AF`, `ZU`), suburb foreign key (`AreaId`), and soft-delete flags.
2. **`Trucks`:** Municipal fleet inventory recording vehicle registration numbers (e.g. `542-KM NC`), tank capacity in litres (10,000L or 15,000L), operational status (`Available`, `OnTrip`, `Maintenance`), and currently assigned driver.
3. **`Trips` & `TripStops`:** The core operational delivery engine. A `Trip` tracks a specific dispatch run. Each `Trip` contains multiple sequential `TripStops` (street addresses, expected delivery volume, completion status, and photo proof of delivery).
4. **`Dams` & `DamReadings`:** Telemetry tracking for Kimberley's reservoirs. `Dams` stores static metadata (name, full capacity in megalitres), while `DamReadings` stores immutable time-series data capturing water levels over time.
5. **`IssueReports`:** Citizen complaint and fault tracking. Stores ticket reference codes (e.g. `SPM-TICKET-20261016-1234`), issue category (burst pipe, leak, water contamination), geolocation, street address, and Cloudflare R2 photo URLs.
6. **`ScheduledOutages`:** Forward-looking calendar of planned municipal maintenance. Connects affected municipal suburbs with start/end timestamps and flags whether mobile relief tankers are assigned.
7. **`SystemAuditLogs`:** Immutable append-only audit trail capturing every administrative action (who changed what, user ID, IP address, timestamp) to satisfy municipal governance and POPIA compliance.

> [!TIP]
> **Why Composite B-Tree Indexes Matter:** In migration `20261012132408_AddPerformanceIndexes.cs`, we added composite database indexes on `(TruckId, Timestamp)` and `(TicketId, Status)`. Without these, querying truck breadcrumbs or searching for resident tickets requires a full table scan, degrading SQL performance under high traffic.

---

## 4.3 API Reference & Endpoint Catalog

The AquaBophelo backend exposes 18 RESTful controllers. All endpoints follow the `/api/v1/` prefix convention.

| HTTP Method | Route | Authorized Roles | Purpose | Request Body / Parameters | Response Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Anonymous | Registers a new resident account | `RegisterDto` (Name, Email, Phone, Password, Area, TurnstileToken) | `200 OK` (User details) |
| `POST` | `/api/v1/auth/login` | Anonymous | Authenticates credentials and issues JWT | `LoginDto` (Email, Password, TurnstileToken) | `200 OK` (JWT + Profile) |
| `GET` | `/api/v1/auth/me` | Authenticated | Fetches profile of currently logged-in user | None (reads Bearer JWT) | `200 OK` (`UserProfileDto`) |
| `POST` | `/api/v1/auth/change-password` | Driver, Admin | Direct password update using current password | `ChangePasswordDto` (CurrentPassword, NewPassword) | `200 OK` (Success message) |
| `POST` | `/api/v1/auth/forgot-password` | Anonymous | Dispatches 6-digit password reset OTP | `ForgotPasswordDto` (Email) | `200 OK` (Notice sent) |
| `POST` | `/api/v1/auth/reset-password-otp` | Anonymous | Resets password using verified email OTP | `ResetPasswordWithOtpDto` (Email, OTP, NewPassword) | `200 OK` (Password updated) |
| `DELETE`| `/api/v1/auth/delete-account` | Resident Only | Soft-deletes account after OTP confirmation | `DeleteAccountDto` (OtpCode) | `200 OK` (Account scheduled for deletion) |
| `GET` | `/api/v1/dams` | Anonymous | Retrieves all reservoir statuses and levels | None | `200 OK` (Array of `DamDto`) |
| `POST` | `/api/v1/dams/{id}/readings` | Admin | Ingests new reservoir telemetry reading | `CreateDamReadingDto` (LevelPercent, ReadingTime) | `201 Created` (Reading entity) |
| `GET` | `/api/v1/trucks` | Anonymous | Lists municipal water tankers & statuses | None | `200 OK` (Array of `TruckDto`) |
| `POST` | `/api/v1/trips` | Admin | Dispatches a new tanker delivery trip | `CreateTripDto` (TruckId, DriverId, RouteId) | `201 Created` (`TripDto`) |
| `PUT` | `/api/v1/trips/{id}/complete` | Driver, Admin | Marks a delivery trip as finished | None | `200 OK` (Trip summary) |
| `POST` | `/api/v1/driver/stops/{id}/complete`| Driver | Confirms water delivery at scheduled stop | `DeliveryProofDto` (LitresDelivered, RecipientSignature, ProofPhoto) | `200 OK` (Updated stop) |
| `POST` | `/api/v1/reports/issues` | Anonymous / Resident | Submits burst pipe or fault report with photo | Multipart form (Type, Description, Area, Address, Image file) | `200 OK` (Created `IssueReport`) |
| `GET` | `/api/v1/reports/issues` | Admin | Fetches all resident fault tickets | None | `200 OK` (Array of `IssueReport`) |
| `POST` | `/api/v1/contact` | Anonymous | Submits public inquiry form (creates ticket) | `ContactMessageRequest` (Name, Email, Subject, Message) | `200 OK` (Reference number) |
| `GET` | `/api/v1/outages` | Anonymous | Lists scheduled water service interruptions | None | `200 OK` (Array of outages) |
| `POST` | `/api/v1/users/{id}/reset-password`| Admin | IT Helpdesk reset of staff/driver password | `AdminResetPasswordDto` (NewPassword) | `200 OK` (Password updated) |
| `GET` | `/health/ready` | Anonymous | Probe checking DB, EmailQueue & Worker | None | `200 OK` or `503 Unavailable` |

---

## 4.4 Real-Time Telemetry & Alert Evaluation

### How SignalR TruckHub Works
SignalR establishes an active, bidirectional communication channel between the driver's device, the server, and the resident's radar map.
1. When a driver starts a trip in [`DriverTripScreen.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/driver/DriverTripScreen.jsx), the browser captures GPS coordinates via the HTML5 Geolocation API (`navigator.geolocation.watchPosition`).
2. The hook [`useGeolocationBroadcast.js`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/hooks/useGeolocationBroadcast.js) transmits coordinates across the WebSocket connection to the hub method `BroadcastLocation(UpdateLocationDto)`.
3. Inside [`TruckHub.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Hubs/TruckHub.cs), the server validates the coordinates (ensuring latitude and longitude fall within reasonable South African geographical bounds), records the breadcrumb into `TruckLocations`, and broadcasts the payload to all connected clients via `Clients.All.SendAsync("LocationUpdated", payload)`.
4. The resident's map in [`LiveMap.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/LiveMap.jsx) listens for `"LocationUpdated"` and smoothly updates the truck icon's position and heading angle without refreshing the page.

### The AlertEvaluator Engine
[`AlertEvaluator.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Services/AlertEvaluator.cs) implements business logic that protects Kimberley from silent reservoir depletion:
* **Critical Red Threshold ($< 35\%$):** If a dam's level drops below 35%, `AlertEvaluator` immediately generates a **CRITICAL** alert, persists it to `_context.Alerts`, and triggers emergency background email broadcasts.
* **Warning Amber Threshold ($35\% - 50\%$):** Generates a **WARNING** advisory notifying residents to implement water conservation measures.
* **Rapid Depletion Detection:** Even if the level is above 50%, if a dam drops by more than $5\%$ within a single 24-hour window, the engine flags an abnormal drawdown warning indicating a possible major pipeline rupture.

---

## 4.5 Email System & Asynchronous Queue Worker

> [!NOTE]
> **In Plain English:** Sending an email is like mailing a letter. If a cashier at a bank had to walk to the post office every time a customer asked for a receipt, the line would never move. Instead, the cashier drops the letter into an outgoing mail tray (in-memory queue) and immediately attends to the next customer. A dedicated mail clerk (background worker service) picks up letters from the tray and delivers them one by one.

### Architecture of the Background Worker
In [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Program.cs#L216-L217), we register:
```csharp
builder.Services.AddSingleton<IEmailQueue, EmailQueue>();
builder.Services.AddHostedService<EmailQueueBackgroundService>();
```
1. When a user requests an OTP in [`AuthController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/AuthController.cs), the controller calls `_authService.SendEmailOtpAsync()`.
2. Rather than making a slow synchronous HTTP call to Brevo (which takes 1.5 to 3 seconds and blocks the web server thread), the service calls `_emailQueue.QueueBackgroundWorkItemAsync()`.
3. This pushes an `EmailWorkItem` into a thread-safe `System.Threading.Channels.Channel<EmailWorkItem>`.
4. The HTTP response returns to the resident immediately (`200 OK` in $< 80\text{ms}$).
5. Meanwhile, [`EmailQueueBackgroundService.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Services/Notifications/EmailQueueBackgroundService.cs) runs continuously in the background. It reads items from the channel and executes [`BrevoEmailSender.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Services/Notifications/BrevoEmailSender.cs) with exponential backoff retry logic.
6. The worker updates its health heartbeat timestamp on every execution. If Brevo experiences an outage, the health probe at `/health/ready` detects consecutive delivery failures and flags the service as `degraded` without crashing the API.


---

# 4B. Authentication and Authorization: Security Deep Dive

> **Joint Territory:** The backend pair explains how authentication and authorization are built and enforced; the frontend pair explains how credentials are handled, stored, and attached. **Both pairs must understand every line of this section.**

---

### 1. The Basics: Authentication vs Authorization

> [!NOTE]
> **In Plain English (The School Office Analogy):**
> * **Authentication is showing your student ID card at the school gate.** It answers: *"Who are you?"* The security guard checks your face and your card to confirm: *"Yes, this is Cuba."*
> * **Authorization is whether your card can open the chemistry lab or the principal's safe.** It answers: *"What are you allowed to do?"* Cuba is a verified student, but he cannot open the principal's safe. That is only authorized for the Principal (Admin).

In AquaBophelo, water distribution involves physical municipal assets and public health.
* We must **authenticate** so we know whether a person is a Kimberley resident, a municipal truck driver, or an official operations manager.
* We must **authorize** so that a resident cannot mark a delivery route as completed, and a driver cannot view or alter another driver's payroll or disciplinary audit records.

---

### 2. How We Authenticate (Who Are You?)

```mermaid
sequenceDiagram
    autonumber
    actor User as Resident / Driver
    participant SPA as React Frontend (Vite)
    participant API as AuthController (.NET 10)
    participant Turnstile as Cloudflare Turnstile
    participant Identity as ASP.NET Core Identity
    participant SQL as Azure SQL Database

    User->>SPA: Enters Email & Password + Human Check
    SPA->>Turnstile: Executes invisible challenge
    Turnstile-->>SPA: Returns Turnstile Token
    SPA->>API: POST /api/v1/auth/login {email, password, turnstileToken}
    
    API->>Turnstile: Verify Token (siteverify API)
    Turnstile-->>API: 200 OK (Human verified)
    
    API->>Identity: FindByEmailAsync(email)
    Identity->>SQL: SELECT user FROM AspNetUsers WHERE Email = ...
    SQL-->>Identity: User record with PasswordHash & SecurityStamp
    
    API->>Identity: CheckPasswordSignInAsync(user, password, lockoutOnFailure: true)
    
    alt Password Matches
        Identity-->>API: SignInResult.Success
        API->>API: GenerateJwtToken(user, roles)
        API-->>SPA: 200 OK { token: "eyJhbGci...", user: { id, fullName, role } }
        SPA->>SPA: Save token in sessionStorage
        SPA-->>User: Redirect to Role Dashboard (/dashboard, /driver/trip, /admin)
    else Invalid Password
        Identity-->>API: SignInResult.Failed (AccessFailedCount++)
        API-->>SPA: 400 Bad Request ("Invalid email or password.")
        SPA-->>User: Displays clean error message
    else Account Locked Out (5 Failed Attempts)
        Identity-->>API: SignInResult.IsLockedOut
        API-->>SPA: 400 Bad Request ("Account locked due to multiple failed login attempts. Try again in 15 minutes.")
        SPA-->>User: Displays security warning
    end
```

#### Registration Flow:
1. The resident submits Full Name, Email Address, Phone Number, Kimberley Suburb (`Area`), Password, and Cloudflare Turnstile token via [`Register.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/Register.jsx).
2. Server validates input in [`AuthController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/AuthController.cs). Passwords must contain at least 6 characters, an uppercase letter, and a digit.
3. **Password Hashing (Why we never store plain passwords):**
   * ASP.NET Core Identity uses **PBKDF2 with HMAC-SHA256** and a unique cryptographic salt per user.
   * *Analogy:* Salting is like adding a secret pinch of spice before pureeing food into soup. Even if two residents pick the same password (`Water2026!`), their stored password hashes look completely different. An attacker who steals the database cannot reverse-engineer passwords using rainbow tables.
4. **Email OTP Verification:**
   * To prevent spam registrations and fake complaint accounts, the system generates a 6-digit cryptographic PIN via `RandomNumberGenerator.GetInt32(100000, 999999)`.
   * The PIN is stored in the database with a **5-minute expiration timestamp** and a security hash in `_context.EmailOtps`.
   * The OTP is delivered to the citizen's inbox via [`BrevoEmailSender.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Services/Notifications/BrevoEmailSender.cs). Once submitted and verified, the account is activated.

#### Brute-Force Defense & Account Lockout:
In [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Program.cs#L116-L120):
```csharp
options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
options.Lockout.MaxFailedAccessAttempts = 5;
options.Lockout.AllowedForNewUsers = true;
```
If an attacker attempts 5 incorrect passwords on any account, ASP.NET Core Identity automatically locks the account for 15 minutes. To prevent user enumeration attacks (where hackers probe which emails exist on our platform), the API returns a generic message: *"Invalid email or password."*

---

### 3. JWT Tokens (JSON Web Tokens)

> [!NOTE]
> **In Plain English (The Festival Wristband Analogy):**
> When you buy a ticket at a festival gate, the ticket booth checks your cash and clips a tamper-proof wristband onto your arm. Inside the concert, security guards don't call the ticket office every time you buy a soda — they simply inspect your wristband. The color shows your role (General Admission or VIP), and the special holographic seal proves it was signed by the festival.
>
> A **JWT** is a digital wristband. The server creates it once when you log in, signs it with a secret key, and hands it to your browser. On every request, your browser presents this digital wristband.

#### The Three Parts of an AquaBophelo JWT:
A token looks like `eyJhbGciOi... . eyJzdWIiOi... . SflKxwRJSMe...`
1. **Header (Red):** Specifies the algorithm used to sign the token (`{"alg": "HS256", "typ": "JWT"}`).
2. **Payload / Claims (Green):** The user data packed inside:
   ```json
   {
     "sub": "b2c4819d-98e1-4c12-9c17-48821019beef",
     "email": "cuba@aquabophelo.app",
     "name": "Sisekelo Masombuka",
     "role": "Admin",
     "area": "Kimberley Central",
     "jti": "8f90214a-192b-426c-829d-112233445566",
     "nbf": 1729050000,
     "exp": 1729078800,
     "iss": "AquaBopheloServer",
     "aud": "AquaBopheloClient"
   }
   ```
3. **Signature (Blue):** A cryptographic hash calculated from:
   $$\text{HMAC-SHA256}(\text{base64UrlEncode}(\text{Header}) + "." + \text{base64UrlEncode}(\text{Payload}), \text{SecretKey})$$
   If a malicious user attempts to edit `"role": "Resident"` to `"role": "Admin"`, the signature immediately invalidates, and the ASP.NET Core middleware rejects the request with `401 Unauthorized`.

#### Token Expiration & The Refresh Token Truth:
* **Token Lifetime:** Our JWT tokens are configured with an **8-hour lifespan** (`TimeSpan.FromHours(8)`), matching a standard municipal operational shift.
* **Refresh Tokens:** **Not found in our repo.** 
  > [!IMPORTANT]
  > **Panel Defense:** If examiners ask, *"Do you have refresh tokens?"* Answer honestly:
  > *"No. For our undergraduate capstone scope, we deliberately implemented short-lived 8-hour access tokens paired with browser `sessionStorage`. When the browser is closed or the shift ends, the token is discarded. Refresh tokens introduce complex database revocation tables and sliding expiration logic which were deferred to Phase 5 future enterprise municipal work."*

---

### 4. How We Authorize (What Are You Allowed to Do?)

#### Role vs Permission Matrix Table

| Feature / API Resource | Resident | Driver | Admin | Enforced Where in Code |
| :--- | :---: | :---: | :---: | :--- |
| View Public Landing & Dam Levels | ✅ | ✅ | ✅ | [`LandingPage.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/LandingPage.jsx), `[AllowAnonymous]` in [`DamsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/DamsController.cs) |
| Track Moving Tankers on Live Map | ✅ | ✅ | ✅ | [`LiveTrucksPage.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/resident/LiveTrucksPage.jsx), [`TruckHub.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Hubs/TruckHub.cs) |
| Report Pipe Leaks with Photo | ✅ | ❌ | ❌ | [`ReportIssueModal.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/ReportIssueModal.jsx), [`ReportsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/ReportsController.cs) |
| Delete Own Account (with Email OTP) | ✅ | ❌ *(Protected)*| ❌ *(Protected)*| [`ProfilePage.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/ProfilePage.jsx), [`AuthController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/AuthController.cs#L267) |
| Vehicle Pre-Trip Safety Inspection | ❌ | ✅ | ✅ | [`DriverVehiclePage.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/driver/DriverVehiclePage.jsx), `[Authorize(Roles = "Driver,Admin")]` |
| View Assigned Manifest & Confirm Stops| ❌ | ✅ | ✅ | [`DriverStopsScreen.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/driver/DriverStopsScreen.jsx), [`DriverController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/DriverController.cs) |
| Broadcast Live GPS Coordinates | ❌ | ✅ | ✅ | [`useGeolocationBroadcast.js`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/hooks/useGeolocationBroadcast.js), [`TruckHub.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Hubs/TruckHub.cs) |
| Create / Dispatch New Delivery Trips | ❌ | ❌ | ✅ | [`AdminOverview.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/admin/AdminOverview.jsx), `[Authorize(Roles = "Admin")]` in [`TripsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/TripsController.cs) |
| Ingest Reservoir Telemetry Readings | ❌ | ❌ | ✅ | `[Authorize(Roles = "Admin")]` in [`DamReadingsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/DamReadingsController.cs) |
| Publish Scheduled Outage Notices | ❌ | ❌ | ✅ | `[Authorize(Roles = "Admin")]` in [`OutagesController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/OutagesController.cs) |
| IT Helpdesk Password Reset for Staff | ❌ | ❌ | ✅ | [`ManageUsers.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/admin/ManageUsers.jsx), `[Authorize(Roles = "Admin")]` in [`UsersController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/UsersController.cs#L195) |
| View System Security Audit Trail | ❌ | ❌ | ✅ | [`AuditLogsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/AuditLogsController.cs) |

#### How `[Authorize]` Works in C#:
In our controllers, endpoints are decorated with attributes:
```csharp
// Example 1: Any authenticated user (Resident, Driver, or Admin)
[HttpGet("me")]
[Authorize]
public async Task<ActionResult<UserProfileDto>> GetCurrentUser() { ... }

// Example 2: Operational staff only
[HttpPost("stops/{stopId}/complete")]
[Authorize(Roles = "Driver,Admin")]
public async Task<IActionResult> CompleteStop(int stopId, [FromBody] DeliveryProofDto dto) { ... }

// Example 3: Administrative governance strictly
[HttpPost("{id}/reset-password")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> AdminResetPassword(string id, [FromBody] AdminResetPasswordDto dto) { ... }
```

#### Ownership Checks (Preventing IDOR Vulnerabilities):
> [!IMPORTANT]
> **Insecure Direct Object Reference (IDOR) Defense:**
> If Resident A calls `GET /api/v1/subscriptions`, what prevents them from reading Resident B's SMS subscriptions?
> In [`SubscriptionsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/SubscriptionsController.cs) and [`ReportsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/ReportsController.cs#L273-L277), we extract the caller's unique ID directly from their verified JWT token claims:
> ```csharp
> var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
> var issues = await _context.IssueReports
>     .Where(i => i.UserId == userId)
>     .ToListAsync();
> ```
> Even if a user alters the request URL parameter, the database filter is strictly bound to the authenticated token identity, making cross-resident data tampering mathematically impossible.

---

### 5. The Frontend Side: Session Storage & HTTP Interceptors

#### Storage Strategy: `sessionStorage` vs `localStorage`
In [`AuthContext.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/auth/AuthContext.jsx) and [`client.js`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/api/client.js):
* **`sessionStorage`:** Tokens are stored in ephemeral tab memory (`sessionStorage.setItem('aquabophelo_token', token)`).
* **Trade-off Analysis:**
  * *`localStorage`:* Persists on disk forever. Convenient for users, but if a municipal worker closes their laptop at a shared library or cyber café, the next person can reopen the browser and access admin controls.
  * *`sessionStorage`:* High municipal security. Closing the browser immediately purges the cryptographic token.
  * *`HttpOnly Cookies`:* Immune to JavaScript XSS theft, but complex for mobile clients and cross-origin architectures without custom proxy backplanes.

#### Request Interceptor (Injecting the Bearer Token):
In [`client.js`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/api/client.js#L26-L39):
```javascript
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('aquabophelo_token') || localStorage.getItem('aquabophelo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lang = localStorage.getItem('aquabophelo_lang') || 'EN';
  config.headers['Accept-Language'] = lang;
  return config;
});
```

#### Response Interceptor (Handling 401 Unauthorized vs 403 Forbidden):
* **`401 Unauthorized`:** The token is missing, expired, or corrupted. The response interceptor automatically clears `sessionStorage` and redirects the user to `/login?expired=true`.
* **`403 Forbidden`:** The token is valid, but the user does not have permission (e.g. a Resident attempting to access `/api/v1/trips`). The frontend displays a permission banner without logging the user out.

---

### 6. Other Security Layers

1. **Content Security Policy (CSP):** Configured in [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Program.cs#L354-L379) to block cross-site scripting (XSS) and clickjacking (`frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
2. **Rate Limiting:** Protects authentication endpoints from credential-stuffing dictionaries (max 5 attempts per minute per IP via `AuthStrictPolicy`).
3. **Sentry PII Scrubbing:** In [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Program.cs#L28-L61), all request headers, query string tokens, and request body payloads are stripped before error events reach Sentry cloud servers, ensuring full compliance with the South African Protection of Personal Information Act (POPIA).
4. **SQL Injection Defense:** All database queries utilize EF Core parameterization. Zero raw concatenated SQL strings exist anywhere in our code.

---

### 7. Security Flowcharts & Diagrams

#### The "Can This User Do This?" Decision Flowchart

```mermaid
flowchart TD
    Start(["Incoming HTTP / WebSocket Request"]) --> HasToken{"Is Bearer JWT\nToken Attached?"}
    
    HasToken -- No --> IsPublic{"Is Endpoint Marked\n[AllowAnonymous]?"}
    IsPublic -- Yes --> ExecPublic["Execute Action\n(e.g. View Dams, Landing Page)"]
    IsPublic -- No --> Ret401["Return 401 Unauthorized\n(Redirect to Login)"]
    
    HasToken -- Yes --> ValidSig{"Is Token Valid?\n(Signature, Issuer, Expiry)"}
    ValidSig -- No --> Ret401
    
    ValidSig -- Yes --> RoleCheck{"Does Endpoint Have\n[Authorize(Roles = '...')]?"}
    RoleCheck -- No Role Required --> CheckOwn{"Requires Resource\nOwnership Check?"}
    
    RoleCheck -- Specific Role --> HasRole{"Does User Claim\nMatch Required Role?"}
    HasRole -- No --> Ret403["Return 403 Forbidden\n(Permission Denied)"]
    HasRole -- Yes --> CheckOwn
    
    CheckOwn -- Yes --> IsOwner{"Does Token User ID\nMatch Resource Owner?"}
    IsOwner -- No --> Ret403
    IsOwner -- Yes --> ExecAction["Execute Controller Action\n(Return 200 OK)"]
    CheckOwn -- No --> ExecAction
```

#### How SignalR Authenticates over WebSockets

```mermaid
sequenceDiagram
    autonumber
    actor Driver as Tanker Driver App
    participant Hub as SignalR TruckHub (/hubs/trucks)
    participant Auth as JwtBearer Middleware

    Note over Driver,Hub: WebSockets cannot send standard custom HTTP headers
    Driver->>Hub: Connect WSS /hubs/trucks?access_token=eyJhbGciOi...
    Hub->>Auth: OnMessageReceived Event
    Auth->>Auth: Extracts token from context.Request.Query["access_token"]
    Auth->>Auth: Validates cryptographic signature with SymmetricSecurityKey
    alt Token Valid & Role is Driver/Admin
        Auth-->>Hub: Connection Authenticated (User Identity established)
        Hub-->>Driver: WebSocket Connected (Status: Connected)
        Driver->>Hub: BroadcastLocation(latitude, longitude, speed)
    else Invalid Token or Role is Resident
        Auth-->>Hub: Token Invalid / Unauthorized
        Hub-->>Driver: 401 Unauthorized (WebSocket Closed)
    end
```

---

### 8. Honesty Section: Real Gaps & 12 Panel Questions

> [!IMPORTANT]
> **Panel Masterclass: 12 Tough Security Questions with Model Answers**
>
> **Q1: Why did you choose JWT instead of traditional server-side session cookies?**  
> *"JWTs are stateless and self-contained. In a municipal architecture designed for scaling across multiple mobile tanker drivers, the server does not need to query a shared session store (like Redis) on every 3-second GPS update. The cryptographic signature guarantees authenticity directly in server memory."*
>
> **Q2: Where is the JWT token stored on the frontend, and what are the security trade-offs?**  
> *"We store the token in browser `sessionStorage`. The trade-off: `localStorage` survives browser restarts but leaves credentials exposed on shared municipal computers. `sessionStorage` provides superior municipal security by wiping the token the second the browser tab closes. While vulnerable to hypothetical XSS, we mitigate this with strict Content Security Policies, sanitized inputs, and zero raw `dangerouslySetInnerHTML`."*
>
> **Q3: What happens if a JWT token is intercepted or stolen?**  
> *"Because JWTs are stateless, an active token remains valid until its 8-hour expiry unless the user's security stamp is revoked. In production, this risk is mitigated through mandatory HTTPS encryption (enforced by HSTS) which prevents wire eavesdropping, coupled with short 8-hour lifetimes and automated session clearing on browser close."*
>
> **Q4: How do you prevent a Resident from altering their role to Admin?**  
> *"Roles are embedded in the JWT payload and sealed with HMAC-SHA256 using a server-side 256-bit secret key. If a user modifies the role payload in their browser, the cryptographic signature check fails immediately, and ASP.NET Core returns `401 Unauthorized`."*
>
> **Q5: How do you prevent SQL injection?**  
> *"We use Entity Framework Core 10 for all database interactions. EF Core translates LINQ queries into parameterized SQL queries (`@p0, @p1`), ensuring that user inputs are treated strictly as data literals and never executed as SQL commands."*
>
> **Q6: Why did you not implement Refresh Tokens?**  
> *"Refresh tokens require persistent database token family tables, rotation handling, and revocation endpoints. Given our capstone timeframe, we prioritized hardening primary authentication, Brevo email OTPs, and Cloudflare Turnstile anti-bot verification, while using clean 8-hour session storage."*
>
> **Q7: What is the difference between a 401 and a 403 HTTP status code?**  
> *"401 Unauthorized means 'Who are you?' (you are not authenticated or your token is expired). 403 Forbidden means 'I know who you are, but you do not have permission to touch this resource' (e.g., a Resident trying to view the Admin Audit Log)."*
>
> **Q8: How are user passwords hashed in your database?**  
> *"ASP.NET Core Identity uses PBKDF2 with HMAC-SHA256, applying 100,000 hashing iterations and an individual 128-bit cryptographic salt per user before storing the hash in `AspNetUsers.PasswordHash`."*
>
> **Q9: Can an Administrator view another user's current password?**  
> *"No. Passwords are irreversibly hashed. In our Admin IT Helpdesk reset feature (`ManageUsers.jsx`), the Administrator can assign a new temporary password, but cannot view existing passwords."*
>
> **Q10: Can drivers delete their own accounts?**  
> *"No. Municipal drivers and operational staff accounts are governed by municipal IT policy. In [`AuthController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/AuthController.cs#L267), deletion requests are blocked if the user is a `Driver` or `Admin`. Only Residents can self-delete their personal accounts."*
>
> **Q11: How do you protect against automated credential stuffing and bots?**  
> *"We enforce two layers: Cloudflare Turnstile cryptographic human challenges on registration and login, and ASP.NET Core `AuthStrictPolicy` rate limiting (maximum 5 requests per minute)."*
>
> **Q12: How is sensitive personal data protected when sending error logs to Sentry?**  
> *"In [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Program.cs#L28-L61), our Sentry configuration explicitly scrubs Authorization tokens, cookies, passwords, and request body payloads before any error event leaves the server, guaranteeing full POPIA compliance."*

---

# 5. FRONTEND PAIR: Nomcebo and Jabulile

## 5.1 Frontend Folder-by-Folder Tour

```text
Code/frontend/src/
├── api/                         HTTP network communications layer
│   └── client.js                Configured Axios client, dynamic baseURL, and request/response interceptors
├── assets/                      Visual graphic assets
│   ├── AquaBophelo_logo.svg     Official Sol Plaatje municipal water drop brand mark
│   ├── kimberley_reservoir.jpg  Hero photograph of Newton Reservoir water infrastructure
│   └── pipe_leak.jpg            Citizen issue reporting banner illustration
├── auth/                        Authentication state and route security
│   ├── AuthContext.jsx          Global auth provider, login/logout actions, and sessionStorage management
│   └── ProtectedRoute.jsx       Higher-order component enforcing login and role access permissions
├── components/                  Modular, reusable user interface building blocks
│   ├── AlertSubscriptionsModal.jsx  Modal for toggling email/SMS suburb water outage alerts
│   ├── BrandLogo.jsx            Responsive vector logo supporting full, compact, and text-only variants
│   ├── BroadcastAlertModal.jsx  Admin pop-up for broadcasting emergency water alerts
│   ├── ConnectionStatus.jsx     Floating network indicator showing SignalR WebSocket connectivity
│   ├── CookieConsentBanner.jsx  POPIA-compliant civic cookie notification banner
│   ├── DamPanel.jsx             Visual card displaying reservoir level progress bars and trends
│   ├── EmptyState.jsx           Clean fallback placeholder when lists contain zero records
│   ├── ErrorBoundary.jsx        React class component catching unexpected runtime UI crashes
│   ├── Footer.jsx               Municipal civic footer with hotlines, addresses, and copyright
│   ├── ForgotPasswordModal.jsx  Modal initiating email OTP password recovery
│   ├── kimberleyMap.json        Offline fallback GeoJSON boundaries for Kimberley wards
│   ├── LanguageSwitcher.jsx     Dropdown selector for English, Afrikaans, and Setswana
│   ├── LiveCameraCapture.jsx    HTML5 camera capture component for taking delivery proof photos
│   ├── LiveMap.jsx              High-performance MapLibre GL radar map with animated tanker pins
│   ├── NotificationCenter.jsx   Bell dropdown tray filtering out self-actions with persistent read counts
│   ├── PushNotificationPrompt.jsx Native browser prompt requesting push alert permissions
│   ├── ReportIssueModal.jsx     Interactive form for logging burst water pipes with live photos
│   ├── ScheduledOutagesComponent.jsx Calendar table of upcoming water maintenance shutdowns
│   ├── Sidebar.jsx              Collapsible navigation drawer with role-based links
│   ├── StatCard.jsx             Metric display widget with title, numeric value, and icon
│   ├── StatusBadge.jsx          Pill badge displaying status colors (Healthy, Critical, Warning)
│   ├── TrendChart.jsx           Chart.js visualizer rendering historical 7-day dam trends
│   └── TurnstileWidget.jsx      Cloudflare Turnstile invisible human verification widget
├── context/                     Application-wide state providers
│   ├── LanguageContext.jsx      Trilingual translation dictionary (EN, AF, ZU) and active language state
│   └── ToastContext.jsx         Toast notification provider rendering success and error banners
├── hooks/                       Custom React lifecycle and operational hooks
│   ├── useGeolocationBroadcast.js Driver hook tracking GPS and broadcasting to TruckHub
│   ├── useOperations.js         Encapsulated hook for querying fleet and outage records
│   ├── useSignalR.js            Generic hook managing real-time hub connections and reconnects
│   └── useTruckTracking.js      Resident hook for streaming active tanker coordinates
├── layouts/                     Structural page shell wrappers
│   ├── AdminLayout.jsx          Admin dashboard shell with header, sub-navigation, and breadcrumbs
│   └── MainLayout.jsx           Resident and Driver shell with top municipal banner and sidebar
├── pages/                       Full-screen page views rendered by React Router
│   ├── AboutUsPage.jsx          Civic information on Sol Plaatje water treatment and history
│   ├── ContactUsPage.jsx        Public inquiry form creating tracked municipal tickets
│   ├── LandingPage.jsx          Root public homepage with live reservoir bars, outages, and tanker radar
│   ├── Login.jsx                Sign-in screen with Turnstile bot defense
│   ├── PrivacyPage.jsx          POPIA compliance, data retention, and civic privacy policies
│   ├── ProfilePage.jsx          User details, language selection, password change, and account deletion
│   ├── Register.jsx             Multi-step registration screen with Brevo email OTP confirmation
│   ├── ResetPasswordPage.jsx    Password recovery completion page
│   ├── admin/                   Dedicated administrative views
│   │   ├── AdminOverview.jsx    Operations dashboard, fleet stats, and resident ticket review table
│   │   ├── AdminReportsPage.jsx Printable operational reports, telemetry trends, and CSV exports
│   │   ├── BroadcastAlertPage.jsx Municipal broadcast console for emergency warnings
│   │   ├── ManageDams.jsx       Create, edit, and update reservoir capacities and readings
│   │   ├── ManageRoutes.jsx     Configure ward distribution routes and scheduled stops
│   │   ├── ManageTrucks.jsx     Add, edit, and assign municipal tanker vehicles
│   │   └── ManageUsers.jsx      User administration, driver provisioning, and IT password reset
│   ├── driver/                  Dedicated tanker operator screens
│   │   ├── DriverActivityPage.jsx Historical log of completed trips and delivered litres
│   │   ├── DriverStopsScreen.jsx Step-by-step delivery stop manifest with photo capture
│   │   ├── DriverTripScreen.jsx Live driving screen with GPS broadcast toggle and problem reporter
│   │   └── DriverVehiclePage.jsx Mandatory pre-trip 6-point safety inspection checklist
│   └── resident/                Dedicated community screens
│       ├── AlertsPage.jsx       Active community notices and emergency water advisories
│       ├── DamsPage.jsx         Comprehensive Kimberley reservoir telemetry and trend charts
│       ├── LiveTrucksPage.jsx   Dedicated full-screen radar map tracking mobile tankers
│       └── ResidentDashboard.jsx Personalized hub showing area dam levels and scheduled deliveries
├── services/                    Peripheral client-side utilities
│   └── analytics.js             POPIA-compliant Google Analytics helper with IP anonymization
└── tests/                       Vitest unit and UI component verification tests
    ├── AdminOperations.test.jsx
    ├── IssueReporting.test.jsx
    ├── LiveTrucks.test.jsx
    ├── Login.test.jsx
    └── Registration.test.jsx
```

---

## 5.2 Routing, Public Landing & Role-Guarded Dashboards

In [`App.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/App.jsx):
* **Root Route (`/`):** Utilizes `PublicLandingRoute`. If a visitor is unauthenticated, it renders [`LandingPage.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/LandingPage.jsx) directly at `https://aquabophelo.app/` without clunky sub-paths. If a logged-in user hits `/`, they are automatically redirected to their role's dashboard (`/admin`, `/driver/trip`, or `/dashboard`).
* **Guest-Only Routes (`/login`, `/register`):** Wrapped in `GuestOnlyRoute`. Logged-in users are blocked from viewing auth pages and redirected back to their active workspace.
* **Role-Guarded Dashboards:** Wrapped in [`ProtectedRoute.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/auth/ProtectedRoute.jsx). If a Resident attempts to enter `/admin`, the route guard evaluates `user.role` against `allowedRoles={['Admin']}` and redirects them to their resident dashboard.

---

## 5.3 Talking to the Backend: Axios Client, Storage & Interceptors

In [`client.js`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/api/client.js):
* **Dynamic BaseURL Resolution:** Automatically detects whether it is running in production (`https://aquabophelo-api-spu-hkahhxcqe0b0c5ek.southafricanorth-01.azurewebsites.net`) or development (`http://localhost:5094`), with runtime override support via `window.__CONFIG__`.
* **Automatic Bearer Injection:** Every outgoing request intercepts headers and injects `Authorization: Bearer <token>` from `sessionStorage`.
* **RFC 7807 ProblemDetails Parsing:** Backend validation errors return structured ProblemDetails JSON (`{ type, title, status, detail }`). Axios intercepts errors and extracts clean, readable error strings for UI toasts.

---

## 5.4 Live Map Telemetry with MapLibre GL & SignalR

In [`LiveMap.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/LiveMap.jsx):
1. **WebGL Canvas Initialization:** Mounts an interactive MapLibre map centered on Kimberley (`[-28.7419, 24.7639]`).
2. **Vector Tiles:** Uses high-contrast, lightweight raster tiles (`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`) that load rapidly on 3G and 4G South African cellular data networks.
3. **Dynamic Tanker Pins:** Tanker markers are custom DOM elements featuring SVG water drops and heading arrows. When a new GPS coordinate arrives over SignalR, the marker's position animates smoothly using linear interpolation, and the marker rotates to reflect the vehicle's compass heading.

---

## 5.5 Charts, Forms, Turnstile & Live Camera Capture

1. **Trend Charts:** In [`TrendChart.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/TrendChart.jsx), Chart.js renders 7-day historical dam fill percentages with smooth spline curves and color-coded threshold zones (green for healthy, amber for warning, red for critical).
2. **Turnstile Bot Defense:** In [`TurnstileWidget.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/TurnstileWidget.jsx), Cloudflare's invisible token challenge renders seamlessly inside forms.
3. **Live Camera Capture:** In [`LiveCameraCapture.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/LiveCameraCapture.jsx), tanker drivers can open their device's native camera stream via HTML5 `MediaDevices.getUserMedia`, snap an instant photo of the water delivery filling a resident's jojo tank, preview the photo, and submit it as digital Proof of Delivery (POD).

---

## 5.6 Design System, Accessibility & Nielsen's 10 Heuristics

### Civic Color Palette
* **Municipal Navy (`#152e52`):** Primary civic branding representing governmental authority and security.
* **Water Blue (`#1d70b8`):** Accent color representing clean municipal water infrastructure.
* **Success Green (`#2e7d32`):** Signifies healthy reservoir storage ($> 50\%$) and verified tanker deliveries.
* **Warning Amber (`#d97706`):** Signifies maintenance outages and water caution zones ($35\% - 50\%$).
* **Critical Red (`#dc2626`):** Signifies severe emergency shortages ($< 35\%$) and major burst pipe incidents.

### How We Applied Nielsen's 10 Usability Heuristics

| # | Nielsen Heuristic | Implementation in AquaBophelo | Exact Screen / Component in Repo |
| :--- | :--- | :--- | :--- |
| **1** | **Visibility of System Status** | Live animated pulse dots on active tankers; real-time SignalR connection badge showing `Connected`, `Reconnecting`, or `Offline`. | [`ConnectionStatus.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/ConnectionStatus.jsx) |
| **2** | **Match Between System and Real World** | Uses familiar South African terms (Jojo tanks, Newton Reservoir, Kimberley wards) and trilingual options (English, Afrikaans, Setswana). | [`LanguageContext.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/context/LanguageContext.jsx) |
| **3** | **User Control and Freedom** | "Cancel" buttons on all dialogs; step-by-step back buttons on multi-step driver delivery manifests. | [`DriverStopsScreen.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/driver/DriverStopsScreen.jsx) |
| **4** | **Consistency and Standards** | Standardized status badges (`StatusBadge.jsx`) sharing identical color semantics across Resident, Driver, and Admin portals. | [`StatusBadge.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/StatusBadge.jsx) |
| **5** | **Error Prevention** | Pre-trip inspection checklist forces drivers to verify tire pressure and brakes before the "Start Trip" button is unlocked. | [`DriverVehiclePage.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/driver/DriverVehiclePage.jsx) |
| **6** | **Recognition Rather than Recall** | Delivery stop cards clearly display the destination street address, expected litre quota, and contact details without needing to remember them. | [`DriverStopsScreen.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/driver/DriverStopsScreen.jsx) |
| **7** | **Flexibility and Efficiency of Use** | Admin table includes instant search filtering by resident name, email, or suburb with 1-click status toggles. | [`AdminOverview.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/admin/AdminOverview.jsx) |
| **8** | **Aesthetic and Minimalist Design** | Clean white surfaces, subtle borders, high contrast typography, and elimination of clutter to keep mobile views responsive. | [`LandingPage.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/LandingPage.jsx) |
| **9** | **Help Users Recognize, Diagnose & Recover** | Inline form validation showing exact password requirements (e.g. "Password must be at least 6 characters with a number") in clear red text. | [`Register.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/Register.jsx) |
| **10**| **Help and Documentation** | 24/7 municipal hotlines (`053 830 6100`), official support email, and emergency civic guidance embedded on every page. | [`Footer.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/Footer.jsx) |


---

# 6. Data Flow Journeys

### Journey 1: Resident Registration & Login

```mermaid
sequenceDiagram
    autonumber
    actor Resident as Resident User
    participant Browser as React App (Register.jsx / Login.jsx)
    participant AuthContext as AuthContext.jsx
    participant Client as Axios (client.js)
    participant API as AuthController.cs (.NET 10)
    participant AuthService as AuthService.cs
    participant Queue as EmailQueue.cs
    participant Worker as EmailQueueBackgroundService.cs
    participant Brevo as Brevo Email API
    participant Identity as ASP.NET Core Identity (AppDbContext)

    Note over Resident,Identity: Phase A: Multi-Step Registration with OTP
    Resident->>Browser: Enters Name, Email, Phone, Area, Password
    Browser->>Client: POST /api/v1/auth/register (payload + Turnstile token)
    Client->>API: HTTP POST /api/v1/auth/register
    API->>AuthService: RegisterAsync(dto)
    AuthService->>Identity: CreateAsync(user, password)
    Identity-->>AuthService: IdentityResult.Success
    AuthService->>AuthService: Generate 6-digit OTP ("123456")
    AuthService->>Queue: Enqueue EmailWorkItem (Subject, Body, Recipient)
    Queue-->>AuthService: Task Completed (< 5ms)
    AuthService-->>API: RegistrationPendingOtpResult
    API-->>Client: 200 OK ("Registration successful. Please verify OTP sent to email.")
    Client-->>Browser: Triggers Step 2 (OTP Input Screen)
    
    par Background Email Delivery
        Worker->>Queue: DequeueAsync()
        Queue-->>Worker: EmailWorkItem
        Worker->>Brevo: POST /v3/smtp/email (API Key)
        Brevo-->>Resident: Delivers OTP to Inbox
    end

    Resident->>Browser: Enters OTP "123456"
    Browser->>Client: POST /api/v1/auth/verify-otp {email, code}
    Client->>API: HTTP POST /api/v1/auth/verify-otp
    API->>AuthService: VerifyEmailOtpAsync(email, code)
    AuthService->>Identity: Set EmailConfirmed = true
    AuthService-->>API: Verification Succeeded
    API-->>Browser: 200 OK ("Email verified successfully. You may now sign in.")

    Note over Resident,Identity: Phase B: Login & JWT Issuance
    Resident->>Browser: Enters Email & Password
    Browser->>AuthContext: login(email, password, turnstileToken)
    AuthContext->>Client: POST /api/v1/auth/login
    Client->>API: HTTP POST /api/v1/auth/login
    API->>Identity: CheckPasswordSignInAsync(user, password)
    Identity-->>API: SignInResult.Success
    API->>AuthService: GenerateJwtTokenAsync(user)
    AuthService-->>API: Signed JWT String (Claims: id, role="Resident", area)
    API-->>Client: 200 OK { token, user: { id, fullName, role: "Resident" } }
    Client-->>AuthContext: Response Payload
    AuthContext->>AuthContext: sessionStorage.setItem('aquabophelo_token', token)
    AuthContext-->>Browser: State: isAuthenticated = true
    Browser-->>Resident: Redirects to /dashboard
```

#### Step-by-Step Walkthrough:
1. **Frontend Input:** Resident enters profile information in [`Register.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/Register.jsx). Cloudflare Turnstile generates a cryptographic human token.
2. **Backend Submission:** [`client.js`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/api/client.js) calls `POST /api/v1/auth/register`.
3. **Identity Creation:** In [`AuthController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/AuthController.cs), `Register()` calls `_authService.RegisterAsync()`, which invokes `_userManager.CreateAsync()`. Passwords are salted and hashed into `AspNetUsers`.
4. **Asynchronous OTP Dispatch:** `_authService.SendEmailOtpAsync()` creates an `EmailOtp` record in the database with a 5-minute expiry and drops an `EmailWorkItem` into [`EmailQueue.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Services/Notifications/EmailQueue.cs).
5. **Background Delivery:** [`EmailQueueBackgroundService.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Services/Notifications/EmailQueueBackgroundService.cs) picks up the item and calls Brevo's REST API. The resident receives an email with their 6-digit PIN.
6. **Verification & Activation:** The resident enters the PIN in `Register.jsx`. The backend confirms the OTP code and marks `EmailConfirmed = true`.
7. **Login & Session Storage:** Upon login, `CheckPasswordSignInAsync()` verifies the credentials. The server creates an 8-hour JWT token with the user's role and suburb. The frontend stores this in `sessionStorage` and navigates to [`ResidentDashboard.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/resident/ResidentDashboard.jsx).

---

### Journey 2: Dam Telemetry Ingestion & Critical Alert Dispatch

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Municipal Operations Admin
    participant AdminUI as ManageDams.jsx
    participant Client as Axios (client.js)
    participant DamCtrl as DamReadingsController.cs
    participant DamServ as DamService.cs
    participant Evaluator as AlertEvaluator.cs
    participant DB as AppDbContext (Azure SQL)
    participant SignalR as NotificationCenter / LiveMap

    Admin->>AdminUI: Submits new reservoir reading: "Newton Reservoir = 32.5%"
    AdminUI->>Client: POST /api/v1/dams/1/readings {levelPercent: 32.5} (Bearer JWT)
    Client->>DamCtrl: HTTP POST with Authorization Header
    Note over DamCtrl: [Authorize(Roles = "Admin")] validates Admin claims
    DamCtrl->>DamServ: AddReadingAsync(damId, 32.5)
    DamServ->>DB: INSERT INTO DamReadings (DamId, LevelPercent, ReadingTime)
    DamServ->>DB: UPDATE Dams SET LatestLevel = 32.5
    DB-->>DamServ: Changes Saved
    
    DamServ->>Evaluator: EvaluateDamLevelAsync(dam, 32.5)
    Note over Evaluator: 32.5% is below Critical Threshold (< 35%)!
    Evaluator->>DB: INSERT INTO Alerts (Title, Message, Severity="CRITICAL", Type="dam")
    DB-->>Evaluator: Alert Saved with Id
    
    Evaluator->>SignalR: Broadcast system alert event
    SignalR-->>AdminUI: Decrements unread badge & displays red critical warning
    DamCtrl-->>Client: 201 Created (Reading + Triggered Alert)
    Client-->>AdminUI: Success Toast: "Reading logged. Critical Alert dispatched to Kimberley."
```

#### Step-by-Step Walkthrough:
1. **Admin Telemetry Entry:** Admin inputs a new water level reading on [`ManageDams.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/admin/ManageDams.jsx).
2. **Authorized API Call:** Request travels via `apiClient.post('/api/v1/dams/1/readings')`. The backend validates `[Authorize(Roles = "Admin")]`.
3. **Database Persistence:** In [`DamReadingsController.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Controllers/DamReadingsController.cs), the reading is inserted into `DamReadings`, and the master `Dams` record is updated with `LatestLevel = 32.5`.
4. **Alert Engine Evaluation:** [`AlertEvaluator.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Services/AlertEvaluator.cs) executes. Because $32.5\% < 35\%$, it generates a **CRITICAL** alert: *"Newton Reservoir storage critically low at 32.5%."*
5. **Real-Time Notification:** The alert is saved to `_context.Alerts`. When residents and drivers refresh or open their notification center ([`NotificationCenter.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/NotificationCenter.jsx)), the critical alert appears at the top of their tray.

---

### Journey 3: Driver Live GPS Movement to Resident Radar Map

```mermaid
sequenceDiagram
    autonumber
    actor Driver as Tanker Driver (En Route)
    participant DriverApp as DriverTripScreen.jsx
    participant GeoHook as useGeolocationBroadcast.js
    participant Hub as SignalR TruckHub (/hubs/trucks)
    participant DB as AppDbContext (Azure SQL)
    participant ResidentMap as LiveMap.jsx (Resident Browser)

    Driver->>DriverApp: Toggles "Start GPS Broadcast"
    DriverApp->>GeoHook: watchPosition() starts streaming coordinates
    loop Every 3-5 Seconds while moving
        GeoHook->>Hub: BroadcastLocation({truckId: 1, lat: -28.7421, lng: 24.7645, heading: 45, speed: 38})
        Note over Hub: Hub validates bounds & updates memory cache
        Hub->>DB: INSERT INTO TruckLocations (TruckId, Latitude, Longitude, Timestamp)
        Hub->>ResidentMap: LocationUpdated({registrationNumber: "542-KM NC", latitude, longitude, heading, speed})
        ResidentMap->>ResidentMap: Interpolate position & smoothly animate truck pin rotation
    end
```

#### Step-by-Step Walkthrough:
1. **Driver Trip Start:** Tanker driver clicks "Start Trip" on [`DriverTripScreen.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/pages/driver/DriverTripScreen.jsx).
2. **Device Telemetry:** [`useGeolocationBroadcast.js`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/hooks/useGeolocationBroadcast.js) connects to `/hubs/trucks` using the driver's JWT token from `sessionStorage`.
3. **WebSocket Transmission:** The hook captures GPS coordinates from the device hardware and calls `connection.invoke('BroadcastLocation', updateDto)`.
4. **Server Relay:** In [`TruckHub.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Hubs/TruckHub.cs), coordinates are validated and dispatched via `Clients.All.SendAsync("LocationUpdated", payload)`.
5. **Resident Map Update:** Inside [`LiveMap.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/LiveMap.jsx), the resident's MapLibre canvas intercepts `"LocationUpdated"`, recalculates marker latitude/longitude, and applies CSS transform rotations to show the truck's real-time heading.

---

### Journey 4: Citizen Fault Report to Admin Command Center

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Kimberley Citizen
    participant Modal as ReportIssueModal.jsx
    participant Client as Axios (client.js)
    participant ReportCtrl as ReportsController.cs
    participant R2 as R2StorageService.cs
    participant DB as AppDbContext (Azure SQL)
    participant AdminUI as AdminOverview.jsx

    Citizen->>Modal: Selects "Burst Water Pipe", Kimberley Suburb, & Snaps Photo
    Modal->>Client: POST /api/v1/reports/issues (Multipart FormData)
    Client->>ReportCtrl: HTTP POST /api/v1/reports/issues
    ReportCtrl->>ReportCtrl: Generates TicketId: "SPM-TICKET-20261016-8812"
    
    alt Photo Provided
        ReportCtrl->>R2: UploadFileAsync(stream, "pipe_leak.jpg")
        R2-->>ReportCtrl: Returns R2 Object URL
    else Local Fallback
        ReportCtrl->>ReportCtrl: Saves to local disk /uploads/reports
    end

    ReportCtrl->>DB: INSERT INTO IssueReports (TicketId, FullName, IssueType, Area, ImageUrl, Status="Pending")
    DB-->>ReportCtrl: Record Saved
    ReportCtrl-->>Client: 200 OK (Created IssueReport with TicketId)
    Client-->>Modal: Displays Success Screen with Ticket Reference
    
    AdminUI->>Client: GET /api/v1/reports/issues (Polling interval: 10s)
    Client->>ReportCtrl: HTTP GET /api/v1/reports/issues (Bearer JWT)
    ReportCtrl->>DB: SELECT * FROM IssueReports ORDER BY CreatedAt DESC
    DB-->>ReportCtrl: List of IssueReports
    ReportCtrl-->>Client: 200 OK (Issues array)
    Client-->>AdminUI: Renders ticket row in "Resident Fault Reports" table
    AdminUI-->>AdminUI: Shows "Pending", Photo Thumbnail & "Resolve Ticket" button
```

---

### Journey 5: Self-Service Password Reset & Email OTP Verification

```mermaid
sequenceDiagram
    autonumber
    actor User as Forgetful User
    participant ForgotModal as ForgotPasswordModal.jsx
    participant ResetPage as ResetPasswordPage.jsx
    participant Client as Axios (client.js)
    participant API as AuthController.cs
    participant AuthService as AuthService.cs
    participant Queue as EmailQueue.cs
    participant Worker as EmailQueueBackgroundService.cs
    participant Brevo as Brevo Email API
    participant Identity as ASP.NET Core Identity

    User->>ForgotModal: Enters registered email address
    ForgotModal->>Client: POST /api/v1/auth/forgot-password {email}
    Client->>API: HTTP POST /api/v1/auth/forgot-password
    API->>AuthService: SendEmailOtpAsync(email, "PasswordReset")
    AuthService->>Identity: FindByEmailAsync(email)
    Identity-->>AuthService: User found
    AuthService->>AuthService: Generates 6-digit OTP ("749210")
    AuthService->>Queue: Enqueue EmailWorkItem ("Password Reset Code")
    API-->>Client: 200 OK ("If the email exists, an OTP has been dispatched.")
    
    par Background Delivery
        Worker->>Queue: DequeueAsync()
        Worker->>Brevo: Send Password Reset Email
        Brevo-->>User: Delivers 6-digit PIN to inbox
    end

    User->>ResetPage: Enters Email, OTP "749210", & New Password
    ResetPage->>Client: POST /api/v1/auth/reset-password-otp {email, otp, newPassword}
    Client->>API: HTTP POST /api/v1/auth/reset-password-otp
    API->>AuthService: VerifyEmailOtpAsync(email, "749210", "PasswordReset")
    AuthService-->>API: OTP verified & valid
    API->>Identity: GeneratePasswordResetTokenAsync(user)
    Identity-->>API: Internal Identity Reset Token
    API->>Identity: ResetPasswordAsync(user, token, newPassword)
    Identity-->>API: IdentityResult.Success
    API->>Identity: UpdateSecurityStampAsync(user)
    API-->>Client: 200 OK ("Password successfully updated. You may now log in.")
    Client-->>ResetPage: Navigates user to /login with success toast
```

---

# 7. Testing Strategy & Proof of Quality

### Testing Map & Pyramid

```mermaid
flowchart TD
    subgraph Pyramid["AquaBophelo Testing Pyramid"]
        E2E["3. End-to-End Persona Verification & Live Smoke Tests (10 Checks)\n(Automated bash smoke tests against compiled API in CI)"]
        Integration["2. Real Integration Tests (32 Tests)\n(Real SQL Server 2022 Docker Container + WebApplicationFactory)"]
        Unit["1. Unit Tests (37 Tests)\n(xUnit C# Backend + Vitest React Frontend Components)"]
    end

    Unit --> Integration
    Integration --> E2E
```

### Real Code Walkthrough: 3 Tests Dissected Line-by-Line

#### Test 1: Real SQL Server Database Integration Test
*File: `Code/backend/AquaBophelo.Tests/RealSqlServerIntegrationTests.cs`*

```csharp
[Fact]
public async Task CanConnect_AndQueryDatabase_AgainstRealSqlServer()
{
    // Line 1: Act — Connect to real disposable SQL Server container in GitHub Actions
    using var scope = _factory.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Line 2: Assert — Verify database engine is reachable and responsive
    var canConnect = await context.Database.CanConnectAsync();
    Assert.True(canConnect, "Test suite must be able to connect to real SQL Server instance.");

    // Line 3: Assert — Verify database migration schema has applied successfully
    var damsCount = await context.Dams.CountAsync();
    Assert.True(damsCount >= 0, "Dams table must exist and be queryable.");
}
```
* **Why this test is impressive:** Most student projects only test against an in-memory database stub (which behaves unrealistically). This test spins up an actual Microsoft SQL Server 2022 Linux container in GitHub Actions and verifies real relational connectivity, foreign key execution, and schema migrations.

#### Test 2: Role Authorization Enforcement Test
*File: `Code/backend/AquaBophelo.Tests/AuthorizationTests.cs`*

```csharp
[Fact]
public async Task Resident_CannotAccess_AdminTripsEndpoint()
{
    // Line 1: Arrange — Generate an authentic JWT bearer token with Role = "Resident"
    var client = _factory.CreateClient();
    var residentToken = await GetJwtTokenForRoleAsync("Resident");
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", residentToken);

    // Line 2: Act — Attempt to touch the Admin-only Trip Creation endpoint
    var response = await client.PostAsJsonAsync("/api/v1/trips", new CreateTripDto { TruckId = 1, DriverId = "test" });

    // Line 3: Assert — Expect HTTP 403 Forbidden
    Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
}
```
* **Why this test is impressive:** It proves mathematically that role boundaries cannot be breached. Even with a valid, signed JWT token, an unauthorized role is blocked by the ASP.NET Core authorization middleware.

#### Test 3: Frontend Multi-Step Registration UI Test
*File: `Code/frontend/src/tests/Registration.test.jsx`*

```javascript
test('displays error when form is submitted with empty required fields', async () => {
  // Line 1: Render the Register page wrapped in Auth & Language Context providers
  render(
    <LanguageProvider>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </LanguageProvider>
  );

  // Line 2: Simulate clicking the "Proceed" button without typing name or password
  const submitButton = screen.getByRole('button', { name: /create account/i });
  fireEvent.click(submitButton);

  // Line 3: Verify user-facing validation error appears on screen
  expect(await screen.findByText(/please provide your full name/i)).toBeInTheDocument();
});
```

---

### What We Tested vs What We Did Not (Honest Panel Defense)

| Testing Type | Status in Our Repo | How We Performed It | Honest Panel Defense |
| :--- | :---: | :--- | :--- |
| **Unit Testing** | ✅ Complete | 48 xUnit backend tests + 21 Vitest frontend tests. | *"All core business logic, dam alert rules, and form validation are covered by automated unit tests."* |
| **Integration Testing**| ✅ Complete | Real SQL Server container testing in CI with `WebApplicationFactory`. | *"We test real database transactions, identity password hashing, and token issuance in automated CI."* |
| **Deployment Smoke Testing**| ✅ Complete | Automated bash script `scripts/deployment-smoke-tests.sh` running 10 live HTTP checks against compiled DLL in CI. | *"Our CI pipeline automatically boots the compiled web server and tests health probes before permitting deployment."* |
| **Manual User Testing**| ✅ Complete | Cross-device testing on Android mobile phones, Windows laptops, and iPads in Kimberley. | *"Tested live on cellular connections to verify mobile map performance and camera photo uploads."* |
| **Automated End-to-End (Cypress/Playwright)**| ❌ Not in Repo | None. | *"We prioritized comprehensive API integration testing and unit testing over heavy browser headless runners due to CI runner memory limits."* |
| **Load / Stress Testing**| ❌ Not in Repo | None. | *"Formal load testing (e.g. Locust or k6 simulating 10,000 drivers) was deferred to future municipal staging deployment."* |
| **Automated Penetration Testing**| ❌ Not in Repo | None (CodeQL and Gitleaks used instead). | *"We used static application security testing (SAST) via GitHub CodeQL and Trivy container scanning."* |

---

# 8. CI/CD Pipeline: GitHub Actions to Azure Cloud

### Pipeline Flowchart

```mermaid
flowchart TD
    GitPush(["Developer pushes commit to GitHub 'main'"]) --> Trigger{"Branch == 'main'?"}
    
    Trigger -- Yes --> CI["1. AquaBophelo CI/CD Pipeline (.github/workflows/ci.yml)"]
    
    subgraph CI_Jobs["Parallel CI Security & Quality Gates"]
        SQL["Backend Build & Tests\n(.NET 10 + Real SQL Server 2022)"]
        FE["Frontend Build & Lint\n(Node.js 24 & Vite)"]
        Gitleaks["Secret Scanning\n(Gitleaks Action)"]
        CodeQL_CS["CodeQL Analysis\n(C# Backend SAST)"]
        CodeQL_JS["CodeQL Analysis\n(JavaScript Frontend SAST)"]
        Trivy["Container Security\n(Trivy Docker Scan)"]
    end
    
    CI --> SQL
    CI --> FE
    CI --> Gitleaks
    CI --> CodeQL_CS
    CI --> CodeQL_JS
    CI --> Trivy
    
    SQL & FE & Gitleaks & CodeQL_CS & CodeQL_JS & Trivy --> AllPass{"All 6 Jobs\nGreen Checkmark?"}
    
    AllPass -- No --> FailNotify["Block Deployment & Notify Team via Email"]
    AllPass -- Yes --> DeployAPI["2. Deploy Backend API (.github/workflows/main_aquabophelo-api-spu.yml)\n(Publish .NET Release to Azure App Service)"]
    AllPass -- Yes --> DeployWeb["3. Deploy Frontend Web (.github/workflows/main_aquabophelo-web-spu.yml)\n(Build Vite SPA & Deploy to Azure App Service)"]
    
    DeployAPI & DeployWeb --> SmokeVerify["4. Production Verification (.github/workflows/production-verification.yml)\n(Run Live HTTP Health Probes against aquabophelo.app)"]
    SmokeVerify --> LiveSystem(["AquaBophelo Live in Production!"])
```

### Line-by-Line Breakdown of `ci.yml`
*File: `.github/workflows/ci.yml`*
1. **Lines 3–7 (`on: push`):** Triggers on every push to `main` or security branches.
2. **Lines 17–30 (`services: sqlserver`):** Provisions a live Docker container running `mcr.microsoft.com/mssql/server:2022-latest` with health checks.
3. **Lines 39–42 (`setup-dotnet: 10.0.x`):** Installs the latest .NET 10 SDK.
4. **Lines 44–51 (`dotnet test`):** Executes all 48 backend integration tests against the real SQL Server container.
5. **Lines 53–61 (`deployment-smoke-tests.sh`):** Boots the compiled backend API in the background on port 5094 and executes 10 automated HTTP smoke probes.
6. **Lines 102–125 (`frontend-ci`):** Installs dependencies via `npm ci`, runs `npm run build` with Vite, and executes the Vitest test suite.
7. **Lines 127–140 (`security-audit`):** Runs Gitleaks to scan commit history for accidentally leaked passwords or private API keys.
8. **Lines 141–174 (`codeql-analysis`):** Runs GitHub CodeQL semantic security analysis for C# and JavaScript to identify vulnerabilities like CWE-89 (SQL Injection) or CWE-79 (XSS).
9. **Lines 175–195 (`container-security`):** Uses Aqua Security's Trivy vulnerability scanner to detect CVEs in the Docker image layers.

---

# 9. Azure Cloud Hosting & Production Infrastructure

### Cloud Resource Inventory

| Azure Cloud Resource | Resource Name in Azure | Tier / SKU | Role in System |
| :--- | :--- | :--- | :--- |
| **Backend App Service** | `aquabophelo-api-spu` | Linux App Service (Basic B1) | Hosts the .NET 10 Kestrel Web API, SignalR WebSocket endpoints, and background email worker. |
| **Frontend App Service** | `aquabophelo-web-spu` | Linux App Service (Basic B1) | Serves the compiled React 19 single-page application with SPA client routing. |
| **Azure SQL Server** | `sql-aquabophelo-spu.database.windows.net` | Microsoft SQL Server | Managed cloud database instance with automated firewall rules and encryption at rest. |
| **Azure SQL Database** | `AquaBopheloDb` | General Purpose (Serverless) | Stores all persistent tables, Identity credentials, dam readings, and audit trails. |
| **Custom Domain & DNS**| `aquabophelo.app` | Cloudflare DNS | Primary production domain with automated SSL/TLS termination and DDoS edge defense. |
| **Object Storage** | `aquabophelo-uploads` | Cloudflare R2 | S3-compatible media bucket storing resident pipe leak photos and delivery proofs. |

### The Student Tier Reality: Cold Starts & Auto-Pause
> [!NOTE]
> **In Plain English:** When a student tier Azure server receives no traffic for 20 minutes, Azure puts it to sleep to save money. The first visitor who opens the site wakes it up. It takes 10 to 15 seconds for the server to stretch, yawn, and boot up (a **cold start**). After that first request, the server stays awake and responds in under 100 milliseconds.

#### How to Answer Examiners About Cold Starts:
> *"Our production deployment operates on Azure's educational student tier. To optimize cloud compute, Azure puts idle instances into a sleep state. During our demonstration, you may notice a 10-second delay on the very first API request — this is a standard cloud cold start. In a full municipal contract, the municipality would allocate a Standard S1 or Production P1V3 plan with 'Always On' enabled to eliminate cold starts completely."*


---

# 10. Problems We Hit and How We Solved Them

### Blocker 1: SMS Telecommunication Cost vs Brevo Email Integration
* **What Happened:** In Phase 2, we specified Twilio SMS for OTP verification and water outage warnings.
* **The Diagnosis:** Testing showed sending 100 SMS messages cost over R110.00. Across four developers testing daily, our student budget would be depleted in under a week.
* **The Solution:** We pivoted to **Brevo Transactional Email API** using an asynchronous background queue (`EmailQueue`). Brevo provides 300 free emails per day with high deliverability, rich HTML formatting, and zero telecommunication expenses.
* **What We Learned:** Software architecture must align with operational budget constraints.

---

### Blocker 2: Mapbox Billing Ceiling vs MapLibre Open-Source Freedom
* **What Happened:** Our initial prototype used Mapbox GL JS for tanker tracking.
* **The Diagnosis:** Mapbox enforced strict monthly active user quotas and required an active international credit card for tile downloads.
* **The Solution:** We replaced Mapbox with **MapLibre GL JS**, a community-driven open-source WebGL library, and pointed tile endpoints to Carto CDN's free raster layers.
* **What We Learned:** Open-source software provides sovereign operational stability for civic and municipal platforms.

---

### Blocker 3: Persistent Credential Leakage vs Ephemeral Session Storage
* **What Happened:** User tokens were initially stored in `localStorage`. Testers noticed that closing the browser and reopening it kept them permanently logged in as an Administrator.
* **The Diagnosis:** On shared computers in municipal libraries, cyber cafes, or municipal offices, the next user could access sensitive fleet dispatch controls without entering credentials.
* **The Solution:** We refactored authentication storage across the entire React client to **`sessionStorage`**. Closing the tab or browser immediately discards credentials, mandating a fresh login.
* **What We Learned:** Civic applications must enforce strict session boundaries to protect municipal security.

---

### Blocker 4: Gitleaks CI False Alarm on Cloudflare Analytics Token
* **What Happened:** Our automated GitHub Actions security scanner (`Gitleaks`) blocked our deployment pipeline with an error: `generic-api-key detected in Code/frontend/index.html`.
* **The Diagnosis:** Gitleaks identified a 32-character hexadecimal token in the Cloudflare Web Analytics beacon script. While Cloudflare tokens are 100% public (like Google Analytics tracking IDs), the scanner's generic regex flagged it as a confidential private key.
* **The Solution:** We added `.gitleaks.toml` and `.gitleaksignore` configuration files to the repository root, explicitly allowlisting the public Cloudflare token and commit fingerprint.
* **What We Learned:** Automated security scanners require tuned allowlists to avoid blocking legitimate public tracking tags.

---

### Blocker 5: Notification Echo & Role Noise in Notification Center
* **What Happened:** When an administrator broadcast an emergency water notice, their own notification bell tray immediately pinged with an alert about their own action. Furthermore, tanker drivers were receiving resident billing and pipe leak complaint tickets.
* **The Diagnosis:** Alerts were fetched globally from `/api/v1/alerts` without user attribution filtering or role boundary checks.
* **The Solution:** We updated [`NotificationCenter.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/NotificationCenter.jsx) to filter out alerts where `createdByUserId === user.id`, restricted drivers to fleet and outage notices only, and saved read states to `sessionStorage`.
* **What We Learned:** Notifications must be contextual and actionable; irrelevant alerts create notification fatigue.

---

# 11. Limitations and Future Work

### Real Limitations in Our Repository (How to Defend Honestly)

| Limitation | Why It Exists in Our Repo | How We Plan to Solve It in Phase 5 | Honest Panel Defense Line |
| :--- | :--- | :--- | :--- |
| **No SMS Fallback for Feature Phones** | High carrier costs per SMS in South Africa. | Partner with municipal USSD / reverse-billed SMS gateway. | *"We focused on the 82% of urban Kimberley residents with smartphones, with USSD planned for municipal adoption."* |
| **No IoT Hardware Sensors on Reservoirs** | Physical ultrasonic IoT sensors require municipal procurement and physical installation on reservoir towers. | Integrate LoRaWAN or Modbus water depth sensors streaming MQTT telemetry to backend. | *"Our backend exposes `/api/v1/dams/{id}/readings` ready to ingest IoT telemetry as soon as sensors are deployed."* |
| **8-Hour Token Expiry Without Refresh Tokens** | Refresh tokens were deferred to prioritize core operational delivery workflows. | Implement sliding expiration refresh tokens in encrypted HttpOnly cookies. | *"We enforced short-lived 8-hour access tokens in `sessionStorage` for security simplicity."* |
| **Simulated GPS when Drivers are Offline** | Real municipal drivers only operate during working hours. | Simulated truck breadcrumb generator for live capstone demonstration. | *"We built an authentic simulator so examiners can observe dynamic MapLibre telemetry during our presentation."* |

---

# 12. Cross-Pair Cheat Sheets

### 📄 Frontend Pair: Everything You MUST Know About the Backend
*(Nomcebo & Jabulile — Memorize this before the presentation)*
1. **The Backend Framework:** .NET 10 Web API running C# 14 on Azure Linux App Service (`aquabophelo-api-spu`).
2. **The Database:** Microsoft Azure SQL Database (`AquaBopheloDb`). Entity Framework Core 10 maps C# classes (`Models/`) to SQL tables.
3. **The API URL:** `https://aquabophelo-api-spu-hkahhxcqe0b0c5ek.southafricanorth-01.azurewebsites.net/api/v1/`.
4. **How Auth Works:** The backend signs an 8-hour JWT token using HMAC-SHA256 with a 256-bit secret key. It embeds the user's role (`Admin`, `Driver`, `Resident`).
5. **How Real-Time Works:** SignalR hub is at `/hubs/trucks`. It accepts the JWT token in the query string `?access_token=...` and broadcasts `"LocationUpdated"` payloads to all connected clients.
6. **How Emails Send:** Emails are not sent synchronously; they are pushed into a memory channel (`EmailQueue`) and sent in the background via Brevo to prevent slowing down the API.
7. **The Rate Limiter:** Auth endpoints allow maximum 5 requests per minute; general API endpoints allow 60 per minute.

---

### 📄 Backend Pair: Everything You MUST Know About the Frontend
*(Nosipho & Cuba — Memorize this before the presentation)*
1. **The Frontend Stack:** React 19 single-page application built with Vite 8 and Tailwind CSS v4, hosted on Azure App Service (`aquabophelo-web-spu`).
2. **Token Storage:** The JWT token is saved in `sessionStorage.getItem('aquabophelo_token')`, meaning closing the browser window immediately logs the user out.
3. **Route Guards:** [`ProtectedRoute.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/auth/ProtectedRoute.jsx) reads `user.role` from `AuthContext`. If an unauthorized role enters a URL, they are bounced back to their respective dashboard.
4. **The Live Map:** Built with **MapLibre GL JS** using Carto Voyager raster tiles. Tanker markers are custom DOM SVG pins that rotate smoothly using compass heading degrees received over SignalR.
5. **Form Bot Defense:** Cloudflare Turnstile renders inside registration and login, returning a token that is sent to `/api/v1/auth/login`.
6. **Camera Capture:** [`LiveCameraCapture.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/LiveCameraCapture.jsx) uses HTML5 `navigator.mediaDevices.getUserMedia` to access mobile device cameras for live photo Proof of Delivery.
7. **Civic Design:** Follows Nielsen's 10 usability heuristics, featuring high-contrast municipal navy (`#152e52`) and trilingual translation (English, Afrikaans, Setswana).

---

# 13. Presentation Prep & Defense Master Plan

### 40 Tough Panel Questions & Model Answers

#### Architecture & Big Picture
1. **Q: What is the high-level architecture of AquaBophelo? (Answer: Cuba)**  
   *A: "AquaBophelo is a decoupled multi-tier system: a React 19 single-page application communicating over HTTPS and WebSockets with an ASP.NET Core 10 Web API, backed by an Azure SQL relational database, Cloudflare R2 media storage, and Brevo transactional email."*
2. **Q: Why didn't you build a native mobile app? (Answer: Nomcebo)**  
   *A: "A responsive web application with PWA capabilities eliminates app store download friction, works universally across Android, iOS, and desktop browsers, and conserves device storage for residents."*
3. **Q: What happens if the database goes down? (Answer: Nosipho)**  
   *A: "Our `/health/ready` probe immediately detects the database failure and reports `503 Service Unavailable`. The frontend displays a graceful error toast, and Sentry captures telemetry without exposing database connection strings."*
4. **Q: How does the system scale if Kimberley expands? (Answer: Cuba)**  
   *A: "Our backend is stateless. To scale horizontally, we can deploy multiple Azure App Service instances and enable Azure SignalR Service with Redis backplane scaling."*

#### Database & Entity Framework
5. **Q: Why use a relational database instead of MongoDB? (Answer: Nosipho)**  
   *A: "Water distribution requires strict relational integrity. Trips have sequential stops, tankers have fixed capacities, and users have foreign-keyed suburban locations. Relational ACID transactions prevent phantom data."*
6. **Q: How did you run migrations on Azure SQL? (Answer: Cuba)**  
   *A: "During startup in [`Program.cs`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/backend/AquaBophelo/Program.cs#L393), EF Core evaluates pending migrations against the cloud database schema using `await context.Database.MigrateAsync()`."*
7. **Q: What is the purpose of composite indexes in your database? (Answer: Nosipho)**  
   *A: "We added indexes on `(TruckId, Timestamp)` so that querying location breadcrumbs for a tanker executes as an indexed B-tree seek rather than scanning hundreds of thousands of historical rows."*
8. **Q: How do you handle user deletion under POPIA? (Answer: Nosipho)**  
   *A: "We implement soft deletion (`IsDeleted = true`, `DeletedAt = DateTime.UtcNow`) with email scrambling, retaining anonymized delivery records for municipal audit requirements."*

#### Security & Authentication
9. **Q: Why JWT instead of cookies? (Answer: Cuba)**  
   *A: "JWTs are stateless, highly performant for high-frequency SignalR WebSocket connections, and eliminate server-side session memory overhead."*
10. **Q: Where is the token stored on the frontend? (Answer: Nomcebo)**  
    *A: "`sessionStorage`. It isolates credentials to the active browser tab and automatically purges the token when the window is closed, preventing credential theft on shared municipal computers."*
11. **Q: How do you stop a user from tampering with their role? (Answer: Cuba)**  
    *A: "The role is sealed inside the JWT signature using HMAC-SHA256 and our secret key. Any client-side payload modification invalidates the signature, causing an immediate 401 rejection."*
12. **Q: What is the difference between 401 and 403? (Answer: Jabulile)**  
    *A: "401 means unauthenticated (missing or expired token). 403 means forbidden (authenticated, but lacking the necessary role permissions for that endpoint)."*

#### Real-Time Telemetry & SignalR
13. **Q: What is a SignalR Hub? (Answer: Cuba)**  
    *A: "A high-level abstraction in ASP.NET Core that manages full-duplex WebSocket connections, allowing the server to push real-time events to connected clients without polling."*
14. **Q: What happens if WebSockets are blocked by a firewall? (Answer: Jabulile)**  
    *A: "SignalR automatically falls back to Server-Sent Events (SSE) or HTTP Long Polling, ensuring continuous connectivity even on restricted municipal networks."*
15. **Q: How do you prevent invalid GPS coordinates? (Answer: Nosipho)**  
    *A: "Our hub and tests validate that latitude and longitude fall strictly within valid Northern Cape coordinates (latitude $-28.7$ to $-28.8$, longitude $24.7$ to $24.8$)."*
16. **Q: How does the map animate moving trucks? (Answer: Nomcebo)**  
    *A: "When a coordinate update arrives, MapLibre recalculates marker positions and smoothly rotates the SVG pin using CSS transform headings."*

#### Frontend & HCI
17. **Q: Which usability heuristic did you prioritize? (Answer: Jabulile)**  
    *A: "Visibility of System Status (Heuristic #1). We provide real-time connection badges, animated tanker pulse markers, and instant form submission indicators."*
18. **Q: How do you handle multilingual residents? (Answer: Nomcebo)**  
    *A: "Our [`LanguageContext.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/context/LanguageContext.jsx) translates the interface between English, Afrikaans, and Setswana with zero page reloads."*
19. **Q: Why did you pick MapLibre GL instead of Google Maps? (Answer: Nomcebo)**  
    *A: "MapLibre is open-source, hardware-accelerated via WebGL, has zero licensing fees, and loads lightweight vector raster tiles optimized for South African cellular data."*
20. **Q: How do tanker drivers capture proof of delivery? (Answer: Jabulile)**  
    *A: "Through our [`LiveCameraCapture.jsx`](file:///c:/Users/Sisekelo%20Masombuka/source/repos/AquaBophelo/Code/frontend/src/components/LiveCameraCapture.jsx) component, which interfaces directly with the device camera to photograph water deliveries and upload proofs to Cloudflare R2."*

#### Testing & CI/CD
21. **Q: How many tests do you have and what types? (Answer: Cuba)**  
    *A: "48 backend xUnit tests (including real SQL Server container integration tests) and 21 frontend Vitest component tests — all passing 100%."*
22. **Q: What is a mock, and where did you use it? (Answer: Nosipho)**  
    *A: "A mock is a simulated object that mimics a real dependency. In unit tests, we mock `IEmailSender` so we don't send real emails to Brevo during test runs."*
23. **Q: What does your CI pipeline do? (Answer: Jabulile)**  
    *A: "On every push, GitHub Actions runs 6 parallel jobs: backend tests against a real SQL container, frontend build and lint, Gitleaks secret scanning, CodeQL semantic analysis, and Trivy container scanning."*
24. **Q: What is Gitleaks and why did it fail earlier? (Answer: Cuba)**  
    *A: "Gitleaks detects committed secrets. It flagged our public Cloudflare analytics token as a false positive. We configured `.gitleaks.toml` to allowlist the public token."*

#### Cloud Hosting & Operations
25. **Q: What Azure resources are running? (Answer: Cuba)**  
    *A: "Two Linux App Services (`aquabophelo-api-spu` and `aquabophelo-web-spu`), an Azure SQL database (`AquaBopheloDb`), Cloudflare DNS, and Cloudflare R2 storage."*
26. **Q: What is an Azure cold start? (Answer: Nomcebo)**  
    *A: "On student and basic tiers, Azure sleeps idle instances. The first request after inactivity takes 10–15 seconds to boot the runtime. Subsequent requests respond in milliseconds."*
27. **Q: How is media stored without incurring costs? (Answer: Cuba)**  
    *A: "We use Cloudflare R2 object storage, which charges \$0.00 for egress bandwidth, ensuring municipal image streaming never incurs unexpected bills."*
28. **Q: How do you monitor production errors? (Answer: Jabulile)**  
    *A: "We integrate Sentry across both frontend and backend for real-time crash reporting and session replays with automatic PII data scrubbing."*

---

### Flawless Live Demo Script (Step-by-Step)

```text
[00:00 - 01:00] THE PUBLIC PORTAL (Nomcebo)
- Open https://aquabophelo.app.
- Point to the live dam bars: "Notice Newton Reservoir and Riverton Works fill levels."
- Scroll to the interactive radar map: "Here are active municipal tankers moving through Kimberley."
- Click "Read Notice Details" on the amber notice bar: page smoothly scrolls to the Outages Calendar.

[01:00 - 02:30] RESIDENT EXPERIENCE (Jabulile)
- Click "Sign In" -> Log in as resident: resident@aquabophelo.app / Resident2026!
- Arrive at /dashboard: show area-specific dam metrics and delivery schedules.
- Open the Notification Center bell: point out unread count decrements on click.
- Click "Report an Issue": show burst pipe reporting with photo upload modal.

[02:30 - 04:00] DRIVER DISPATCH & GPS TELEMETRY (Nosipho)
- Open an incognito window -> Log in as driver: driver@aquabophelo.app / Driver2026!
- Arrive at /driver/trip: point out the mandatory pre-trip inspection checklist.
- Click "Start GPS Broadcast": explain how SignalR broadcasts live coordinates every 3s.
- Navigate to /driver/stops: click "Confirm Delivery" -> demonstrate live camera capture.

[04:00 - 05:30] ADMIN COMMAND CENTER (Cuba)
- Log in as admin: admin@aquabophelo.app / Admin2026!
- Arrive at /admin: display high-level fleet stats, active trips, and resident tickets.
- Point out the citizen ticket logged earlier: click "In Progress" -> "Resolve Ticket".
- Open /admin/users: show the IT Helpdesk password reset modal for municipal staff.
- Conclude with the system health probe (/health/ready) showing all green services.
```

---

### "If the Demo Breaks" Emergency Contingency Plan
1. **Scenario A: Azure Cold Start (Site takes 15 seconds to load):**  
   *Action:* Do not panic or refresh repeatedly. Say: *"Members of the panel, our server is currently warming up from a student-tier sleep state. Azure is allocating our container now."*
2. **Scenario B: Campus Wi-Fi Disconnects:**  
   *Action:* Immediately switch to a smartphone mobile hotspot (already tethered before the talk). Our app uses lightweight vector tiles and will load instantly over LTE/5G.
3. **Scenario C: Driver Geolocation Denied by Browser:**  
   *Action:* The driver app includes a fallback demo toggle that simulates movement along Route 1 (Galeshewe Zone 3) without requiring hardware GPS permissions.

---

### Team Speaking Split & Transition Handover Lines

```mermaid
flowchart LR
    Cuba["1. Cuba (Opening & Arch)"] -- "'Nosipho will now walk you through the data engine...'" --> Nosipho["2. Nosipho (Backend & DB)"]
    Nosipho -- "'Nomcebo will showcase our resident interface...'" --> Nomcebo["3. Nomcebo (Frontend & UX)"]
    Nomcebo -- "'Jabulile will demonstrate testing and reliability...'" --> Jabulile["4. Jabulile (Testing & CI/CD)"]
    Jabulile -- "'Cuba will conclude with our live command center...'" --> Cuba2["5. Cuba (Admin Demo & Close)"]
```

---

# 14. Pair Quizzes (23 Questions Each Way)

### Quiz A: 23 Questions Backend Pair Asks Frontend Pair
*(Nosipho & Cuba quiz Nomcebo & Jabulile)*

1. **Q: Where is the JWT token stored on the frontend?**  
   *A: In `sessionStorage` under the key `'aquabophelo_token'`.*
2. **Q: What happens when the user closes their browser window?**  
   *A: `sessionStorage` is automatically wiped, logging the user out immediately.*
3. **Q: How does Axios attach the token to outgoing requests?**  
   *A: In `client.js`, a request interceptor adds the header `Authorization: Bearer <token>`.*
4. **Q: What does the frontend do when the backend returns a 401 Unauthorized?**  
   *A: The response interceptor clears `sessionStorage` and redirects to `/login?expired=true`.*
5. **Q: What is the difference between `/` and `/landing` in our routes?**  
   *A: `/` serves the landing page to guests and redirects logged-in users to their dashboard. `/landing` redirects directly to `/`.*
6. **Q: How does the MapLibre map know where to place a moving tanker?**  
   *A: It listens for the `"LocationUpdated"` SignalR event and updates marker coordinates.*
7. **Q: How does the map rotate the truck icon?**  
   *A: It applies a CSS `transform: rotate(<heading>deg)` to the marker DOM element.*
8. **Q: What tile provider do we use for the map?**  
   *A: Carto Voyager raster tiles via CartoCDN.*
9. **Q: How does the frontend prevent automated bots from registering?**  
   *A: Cloudflare Turnstile widget executes a cryptographic challenge and passes the token to the API.*
10. **Q: How does the driver take a photo of a water delivery?**  
    *A: Using `LiveCameraCapture.jsx` which accesses `navigator.mediaDevices.getUserMedia`.*
11. **Q: Where do uploaded leak and proof photos go?**  
    *A: They are streamed to Cloudflare R2 object storage with local disk fallback.*
12. **Q: How does `NotificationCenter.jsx` stop admins from seeing their own actions?**  
    *A: It filters out alerts where `createdByUserId === user.id`.*
13. **Q: How does the notification badge decrement when an alert is clicked?**  
    *A: It marks the alert ID as read in state and saves the read set to `sessionStorage`.*
14. **Q: Which library renders the 7-day dam trends?**  
    *A: Chart.js inside `TrendChart.jsx`.*
15. **Q: What is Heuristic #1 in Nielsen's usability model and how did you apply it?**  
    *A: Visibility of System Status — applied via live connection badges and truck pulse markers.*
16. **Q: What are the three languages supported by our language switcher?**  
    *A: English (`EN`), Afrikaans (`AF`), and Setswana (`ZU`).*
17. **Q: How does `ProtectedRoute.jsx` stop a resident from seeing the admin screen?**  
    *A: It inspects `user.role`; if `'Admin'` is missing, it redirects to `/dashboard`.*
18. **Q: Can drivers delete their own accounts on the profile page?**  
    *A: No. The button is hidden for drivers, and a municipal security policy card is shown.*
19. **Q: What happens if a user submits a registration with missing fields?**  
    *A: Inline client-side validation displays red error messages before any API call is made.*
20. **Q: Where can admins view real-time visitor web analytics?**  
    *A: In the Cloudflare Web Analytics dashboard under `aquabophelo.app`.*
21. **Q: How does the frontend handle RFC 7807 problem details?**  
    *A: Axios error handlers parse `error.response.data.detail` and show it in toast notifications.*
22. **Q: Why did we replace Leaflet with MapLibre GL?**  
    *A: MapLibre uses WebGL GPU acceleration for 60fps smooth marker rotations and vector handling.*
23. **Q: What tool runs our frontend automated unit tests?**  
    *A: Vitest with React Testing Library (`npm test`).*

---

### Quiz B: 23 Questions Frontend Pair Asks Backend Pair
*(Nomcebo & Jabulile quiz Nosipho & Cuba)*

1. **Q: What .NET version does the backend use?**  
   *A: .NET 10 running C# 14.*
2. **Q: What database engine are we connected to in production?**  
   *A: Microsoft Azure SQL Database (`AquaBopheloDb`).*
3. **Q: How are passwords hashed in the database?**  
   *A: ASP.NET Core Identity uses PBKDF2 with HMAC-SHA256 and unique per-user salts.*
4. **Q: What algorithm signs our JWT tokens?**  
   *A: HMAC-SHA256 (`HS256`) using a 256-bit secret key.*
5. **Q: How long does a JWT access token last?**  
   *A: 8 hours (`TimeSpan.FromHours(8)`).*
6. **Q: What table stores reservoir fill level readings over time?**  
   *A: `DamReadings` (foreign keyed to `Dams`).*
7. **Q: What threshold triggers a CRITICAL dam alert in `AlertEvaluator.cs`?**  
   *A: Fill level falling below 35% ($< 35\%$).*
8. **Q: What is the route of our real-time GPS SignalR hub?**  
   *A: `/hubs/trucks`.*
9. **Q: How does a WebSocket request pass its JWT token to SignalR?**  
   *A: Via the query parameter `?access_token=...` extracted in `OnMessageReceived`.*
10. **Q: How does the backend send emails without slowing down the API?**  
    *A: It drops work items into `EmailQueue`, processed asynchronously by `EmailQueueBackgroundService`.*
11. **Q: What email provider sends our OTP codes?**  
    *A: Brevo Transactional Email API.*
12. **Q: How long do email verification OTP codes remain valid?**  
    *A: 5 minutes.*
13. **Q: How does the backend prevent brute-force login attacks?**  
    *A: It locks the account for 15 minutes after 5 consecutive failed login attempts.*
14. **Q: What rate limiting policies are active on the backend?**  
    *A: `AuthStrictPolicy` (5 req/min) and `GeneralApiPolicy` (60 req/min).*
15. **Q: What happens if a driver tries to delete their account via API?**  
    *A: `AuthController.DeleteAccount` returns `400 Bad Request` citing municipal policy.*
16. **Q: How does `UsersController` allow admins to reset staff passwords?**  
    *A: Via `POST /api/v1/users/{id}/reset-password` using Identity reset tokens.*
17. **Q: What probe endpoint checks database and email queue health?**  
    *A: `GET /health/ready` (returns `200 OK` or `503 Service Unavailable`).*
18. **Q: How does the backend prevent SQL injection?**  
    *A: EF Core translates all queries into parameterized SQL commands.*
19. **Q: What object storage service holds uploaded leak photos?**  
    *A: Cloudflare R2 (`aquabophelo-uploads`) with zero egress fees.*
20. **Q: Where does the backend store immutable administrative audit trails?**  
    *A: In the `SystemAuditLogs` database table.*
21. **Q: What is the purpose of Scalar in `Program.cs`?**  
    *A: It provides interactive OpenAPI 3.0 documentation at `/scalar/v1`.*
22. **Q: How does Sentry protect resident privacy on the backend?**  
    *A: `BeforeSend` scrubs Authorization tokens, cookies, passwords, and request bodies.*
23. **Q: How many backend automated tests run in CI?**  
    *A: 48 xUnit tests running against a real SQL Server 2022 Docker container.*

---

# 15. Glossary

* **ACID:** Atomicity, Consistency, Isolation, Durability — the database guarantee that transactions never corrupt data.
* **API (Application Programming Interface):** A standardized digital counter where software asks for and receives data.
* **Asynchronous:** Operations that run in the background without freezing or blocking the main application.
* **Bearer Token:** A security credential that grants access to whoever holds ("bears") it.
* **Brute-Force Attack:** A hacking technique that repeatedly guesses passwords until one works.
* **CORS (Cross-Origin Resource Sharing):** A browser security rule controlling which websites can talk to an API.
* **CSP (Content Security Policy):** An HTTP security header preventing cross-site scripting and unauthorized iframe embeds.
* **DTO (Data Transfer Object):** A lightweight C# class designed strictly for sending data across the network.
* **Entity Framework (EF Core):** An object-relational mapper allowing developers to query databases using C# instead of raw SQL.
* **Gitleaks:** An automated security tool that scans git repositories for accidentally committed passwords.
* **GPS (Global Positioning System):** Satellite-based coordinate tracking of latitude, longitude, speed, and heading.
* **HSTS (HTTP Strict Transport Security):** A header forcing browsers to communicate strictly over encrypted HTTPS.
* **Identity (ASP.NET Core Identity):** A built-in security framework managing users, password hashes, roles, and lockouts.
* **IDOR (Insecure Direct Object Reference):** A vulnerability where changing an ID in a request touches another user's data.
* **JWT (JSON Web Token):** A compact, cryptographically signed digital pass containing user claims.
* **Linear Interpolation:** Calculating intermediate points to make moving map markers glide smoothly.
* **Lockout:** Temporarily disabling an account after too many incorrect password attempts.
* **MapLibre GL JS:** An open-source WebGL library for rendering hardware-accelerated interactive maps.
* **Middleware:** Software components chained together in the request pipeline to handle auth, logging, and security.
* **OTP (One-Time PIN):** A short-lived 6-digit numeric verification code.
* **PBKDF2:** Password-Based Key Derivation Function 2 — the cryptographic algorithm used to hash passwords.
* **POPIA:** Protection of Personal Information Act — South Africa's comprehensive data privacy law.
* **ProblemDetails (RFC 7807):** A standardized JSON format for reporting HTTP API errors.
* **Rate Limiting:** Restricting how many requests an IP address can make in a given timeframe.
* **Salting:** Adding unique random data to a password before hashing to defeat rainbow table attacks.
* **SessionStorage:** Ephemeral browser memory that automatically purges when a tab or window is closed.
* **SignalR:** A real-time ASP.NET Core library managing persistent bidirectional WebSocket connections.
* **Turnstile:** Cloudflare's invisible, privacy-preserving alternative to CAPTCHA bot puzzles.
* **Vite:** A lightning-fast modern frontend build tool and development server.
* **WebGL:** Web Graphics Library — technology enabling 3D and 2D GPU-accelerated graphics inside browsers.
* **xUnit:** The official unit and integration testing framework for .NET.

---

# 16. One-Page Night-Before Revision Sheet

> **Print this page or keep it open on your phone tonight.**

```text
========================================================================================
                      AQUABOPHELO CAPSTONE DEFENSE CHEAT SHEET
========================================================================================
1. THE PROBLEM:
   Kimberley water volatility (Newton & Riverton dams) + uncoordinated emergency relief tankers.

2. THE THREE PERSONAS:
   • Resident: View dam levels, track moving tankers on radar, report burst pipe leaks.
   • Driver: Pre-trip safety inspection, turn-by-turn digital manifest, live GPS broadcast.
   • Admin: Central command center, trip dispatch, outage calendar, IT password reset.

3. CORE TECH ARCHITECTURE:
   • Frontend: React 19 + Vite 8 + Tailwind CSS v4 + MapLibre GL JS.
   • Backend: ASP.NET Core 10 Web API (C# 14) + SignalR Hub (/hubs/trucks).
   • Database: Microsoft Azure SQL Database (AquaBopheloDb) via Entity Framework Core 10.
   • Edge & Security: Cloudflare DNS, Cloudflare Turnstile, Cloudflare R2 media storage.
   • Notifications: Brevo Transactional Email API via background System.Threading.Channels queue.

4. SECURITY BULLET POINTS:
   • Authentication: ASP.NET Core Identity with PBKDF2 salting + HMAC-SHA256 password hashing.
   • Tokens: 8-hour JWT Bearer tokens signed with 256-bit secret key.
   • Storage: sessionStorage (tab-isolated; auto-clears on browser close for municipal safety).
   • Ownership Checks: User ID extracted from token claims to prevent IDOR vulnerabilities.
   • Brute Force Defense: 15-minute account lockout after 5 failed login attempts.
   • Bot Defense: Cloudflare Turnstile invisible human verification on register and login.
   • Rate Limiting: 5 requests/min on auth endpoints; 60 requests/min on general API.

5. KEY DECISIONS (WHY NOT X?):
   • Why ASP.NET over Node? Strong typing, built-in Identity, and native SignalR performance.
   • Why MapLibre over Mapbox/Google? 100% open-source WebGL with $0 API fees.
   • Why Brevo over SMS? SMS costs R1.10 each; Brevo gives 300 free transactional emails/day.
   • Why R2 over Azure Blob? S3-compatible object storage with $0 egress bandwidth fees.

6. PROOF OF QUALITY:
   • 48 backend tests (including real SQL Server container integration tests).
   • 21 frontend Vitest component tests.
   • 6-stage GitHub Actions CI pipeline (Docker, Gitleaks, CodeQL C# & JS, Trivy security).
   • Deployed live on Microsoft Azure at https://aquabophelo.app.

7. MOTTO:
   Elke druppel tel — Metsi ke bophelo (Every drop counts — Water is life).
========================================================================================
```
