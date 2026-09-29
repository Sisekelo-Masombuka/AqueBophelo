# AquaBophelo — Feature Audit & Implementation Task List

## Summary

All features across Global, Resident, Driver, Admin, and Documentation sections have been **fully implemented**, verified line-by-line in the codebase, and reconciled with project design standards.

---

## 0. Global / cross-cutting

| # | Item | Status | Notes |
|---|------|--------|-------|
| 0.1 | Password field has a show/hide (eye) toggle on every password input (login, register, change password) | ✅ Implemented | Integrated `Eye`/`EyeOff` buttons in `Login.jsx`, `Register.jsx`, `ResetPasswordPage.jsx`, and `ProfilePage.jsx` |
| 0.2 | Dashboard logos/icons fixed — replace the "dry" (flat/placeholder-looking) logo treatment next to nav items | ✅ Implemented | Integrated authentic `BrandLogo.jsx` (`full_logo.png`/`mark_logo.png`) with Sol Plaatje subtitle headers across all pages |
| 0.3 | Icons are consistent across the whole system (one icon set, one stroke weight, one size scale — not mixed emoji/flat/line icons) | ✅ Implemented | Standardized strictly on Lucide SVG icons; removed 3D glossy emojis and teardrop emoji dots |
| 0.4 | All timestamps use **CAT**, not SAST, everywhere in the UI, database, and emails | ✅ Implemented | Replaced all `SAST` strings with `CAT` across all frontend components, backend services, DTOs, and docs |
| 0.5 | Notifications/OTP delivery uses **email only** — no SMS anywhere in the flow | ✅ Implemented | Wired `INotificationService`, `SendGridEmailService`, and 5-minute countdown Email OTP modal |
| 0.6 | Multi-language support works **everywhere**: English (primary), Afrikaans, Tswana | ✅ Implemented | Created `LanguageContext.jsx` and `LanguageSwitcher.jsx` for EN, AF, and TN with locale persistence |
| 0.7 | Users can upload a profile picture (Resident, Driver, Admin) | ✅ Implemented | Added avatar photo file upload with live preview on `ProfilePage.jsx` |
| 0.8 | Vehicle registration plate format corrected: province code goes at the **end** — e.g. `542-KM NC`, not `NC 542 123` | ✅ Implemented | Re-formatted all vehicle registrations across database seeds and UI components to end with `NC` (`542-KM NC`) |
| 0.9 | Privacy section: simple page covering "who can see my information", location sharing setting, data usage explanation, link to privacy policy | ✅ Implemented | Created `PrivacyPage.jsx` accessible at `/privacy` covering POPIA compliance and telemetry settings |
| 0.10 | Replace any UI element flagged in "Screenshot of things that are wrong" with a proper, human-looking equivalent | ✅ Implemented | Replaced all `rounded-full` pill badges with `rounded-md` rectangular solid tags, fixed emoji drops, and plate formats |

---

## 1. Resident

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | Report an issue, with an **optional** photo upload | ✅ Implemented | `ReportIssueModal.jsx` supports optional image attachment upload with live preview and ticket logging |
| 1.2 | Landing page "Report a Water Issue" section uses the pipe-leak photo (from the Design Components folder) | ✅ Implemented | `LandingPage.jsx` embeds `pipe_leak.jpg` from `Design Components` in the water leak section |
| 1.3 | View scheduled water interruptions (cut-off time and expected return time), posted by Admin | ✅ Implemented | `ScheduledOutagesComponent.jsx` renders water interruption schedules with admin posting modal |
| 1.4 | View the status of a submitted issue, updated by Admin | ✅ Implemented | `ResidentDashboard.jsx` displays issue tickets (`Pending`, `In Progress`, `Resolved`) updated by Admin |
| 1.5 | Delete own account, with a confirmation step, then an **email OTP** required before the account is actually deleted | ✅ Implemented | `ProfilePage.jsx` includes account deletion modal with email OTP verification step |
| 1.6 | Notifications: in-system **and** email | ✅ Implemented | Integrated `NotificationCenter.jsx` bell drawer in header bar and email alert subscriptions |
| 1.7 | Privacy settings (see 0.9) | ✅ Implemented | `PrivacyPage.jsx` at `/privacy` and inline POPIA drawer |
| 1.8 | Profile picture upload (see 0.7) | ✅ Implemented | Photo avatar uploader with live preview on `ProfilePage.jsx` |

---

## 2. Driver

### 2.1 Trip execution
| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1.1 | See today's assigned trip | ✅ Implemented | `DriverTripScreen.jsx` renders active assigned trip card with vehicle `542-KM NC` |
| 2.1.2 | See delivery stops | ✅ Implemented | `DriverStopsScreen.jsx` displays sequence manifest of delivery stops |
| 2.1.3 | Navigate / view route | ✅ Implemented | `DriverTripScreen.jsx` embeds live driving map and GPS telemetry controls |
| 2.1.4 | See next destination | ✅ Implemented | Target destination card highlighted on `DriverTripScreen.jsx` |
| 2.1.5 | See estimated arrival | ✅ Implemented | Displays live estimated arrival timestamps per stop |
| 2.1.6 | Start / end a trip | ✅ Implemented | Big touch-optimized Start/End trip action buttons on `DriverTripScreen.jsx` |
| 2.1.7 | Per-stop flow: **Arrived → Start delivery → Delivery completed** | ✅ Implemented | Stop state machine implemented in `DriverTripScreen.jsx` and `DriverStopsScreen.jsx` |
| 2.1.8 | At completion, driver records: amount delivered (approx.), delivery location, time, optional notes | ✅ Implemented | Modal prompt records volume (Litres), location coordinates, timestamp, and notes |

### 2.2 Report a problem
| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.2.1 | Single "Report problem" function | ✅ Implemented | Dedicated problem report action on `DriverTripScreen.jsx` |
| 2.2.2 | Category choice: Vehicle problem / Road-access problem / Water point problem / Unable to deliver / Other | ✅ Implemented | Dropdown categories supported in driver problem report modal |

### 2.3 Vehicle
| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.3.1 | View assigned vehicle and its information | ✅ Implemented | Card displays assigned tanker `542-KM NC` (10,000L capacity) |
| 2.3.2 | Perform a vehicle check | ✅ Implemented | Vehicle pre-trip inspection checklist modal integrated |
| 2.3.3 | Report a vehicle problem | ✅ Implemented | Vehicle fault reporter integrated with dispatch alert |
| 2.3.4 | See vehicle status | ✅ Implemented | Live status pill (`Available`, `OnTrip`, `Maintenance`) |

### 2.4 Notifications
| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.4.1 | New trip assignment | ✅ Implemented | In-system notification alert in `NotificationCenter.jsx` |
| 2.4.2 | Trip changes | ✅ Implemented | Dispatch route update notifications |
| 2.4.3 | Admin messages | ✅ Implemented | Command center broadcast alerts |
| 2.4.4 | Incident notifications | ✅ Implemented | Emergency incident alerts |
| 2.4.5 | System announcements | ✅ Implemented | Municipal water announcements |
| 2.4.6 | Delivered in-system | ✅ Implemented | `NotificationCenter.jsx` bell drawer provides in-system delivery |

### 2.5 My Activity
| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.5.1 | Completed trips | ✅ Implemented | History tab logs completed delivery trips |
| 2.5.2 | Previous deliveries | ✅ Implemented | Log of past water delivery drop-offs |
| 2.5.3 | Reported problems | ✅ Implemented | History of submitted vehicle/road incident reports |
| 2.5.4 | Trip history | ✅ Implemented | Full trip history manifest on Driver dashboard |

### 2.6 Driver profile ("My Profile")
| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.6.1 | Employment info: name, employee/driver ID, licence status, assigned vehicle | ✅ Implemented | `ProfilePage.jsx` displays ID `DRV-8492`, `Code EC`, assigned `542-KM NC` |
| 2.6.2 | Driving info: completed trips, total deliveries, current assignment | ✅ Implemented | Driving performance card displaying trips and delivery totals |
| 2.6.3 | Profile picture upload | ✅ Implemented | Profile photo file upload with live avatar preview |

---

## 3. Admin

### 3.1 Operations (overview / "what's happening right now")
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1.1 | Current water status | ✅ Implemented | `AdminOverview.jsx` displays overall grid status KPI |
| 3.1.2 | Active incidents | ✅ Implemented | Active incident feed and alert log |
| 3.1.3 | Active tankers | ✅ Implemented | Fleet radar displaying live position of tankers |
| 3.1.4 | Current trips | ✅ Implemented | Table of active delivery trips |
| 3.1.5 | Reservoir/dam levels | ✅ Implemented | Gauge cards for Newton Reservoir & Riverton Water Works |
| 3.1.6 | Areas needing attention | ✅ Implemented | Critical zone warnings and low-pressure alerts |

### 3.2 Fleet & drivers
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.2.1 | View trucks | ✅ Implemented | `ManageTrucks.jsx` displays table of all municipal tankers |
| 3.2.2 | Add / edit trucks | ✅ Implemented | Modal for registering new tankers with capacity & registration plate |
| 3.2.3 | Assign trucks | ✅ Implemented | Driver assignment dropdown per truck |
| 3.2.4 | See truck status | ✅ Implemented | Status tags (`Available`, `OnTrip`, `Maintenance`) |
| 3.2.5 | View truck history | ✅ Implemented | Historical trip log per tanker |
| 3.2.6 | View drivers | ✅ Implemented | `ManageUsers.jsx` filters and displays all registered driver personnel |
| 3.2.7 | Assign drivers | ✅ Implemented | Driver route assignment modal |
| 3.2.8 | View driver status | ✅ Implemented | Active shift status and last login timestamp |
| 3.2.9 | Manage driver access | ✅ Implemented | Role access controls and password reset |

### 3.3 Trips & deliveries
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.3.1 | Create trips | ✅ Implemented | `ManageRoutes.jsx` includes trip creation form |
| 3.3.2 | Assign drivers | ✅ Implemented | Driver selection per scheduled trip |
| 3.3.3 | Assign trucks | ✅ Implemented | Tanker selection per trip |
| 3.3.4 | Assign delivery areas | ✅ Implemented | Area/zone drop-off point manifest |
| 3.3.5 | Monitor active trips | ✅ Implemented | Live map tracking of active trips |
| 3.3.6 | View completed trips | ✅ Implemented | Completed trip audit table |
| 3.3.7 | Review failed deliveries | ✅ Implemented | Exception log for unserviced stops |

### 3.4 Incidents & requests
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.4.1 | Resident reports — view and **update status** | ✅ Implemented | `AdminOverview.jsx` and `ManageUsers.jsx` allow updating resident ticket status |
| 3.4.2 | Water requests | ✅ Implemented | Resident community water request queue |
| 3.4.3 | Infrastructure issues | ✅ Implemented | Pipe leak and pump station issue tracker |
| 3.4.4 | Service interruptions — create/post schedule | ✅ Implemented | `ScheduledOutagesComponent.jsx` admin modal creates and posts outage notices |
| 3.4.5 | Driver-reported problems | ✅ Implemented | Driver incident report inbox |

### 3.5 Water infrastructure
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.5.1 | Dams | ✅ Implemented | `ManageDams.jsx` tracks all registered dams |
| 3.5.2 | Reservoirs | ✅ Implemented | Newton Reservoir & Riverton Water Works monitoring |
| 3.5.3 | Water points | ✅ Implemented | Community water collection points |
| 3.5.4 | Areas/zones | ✅ Implemented | Sol Plaatje municipal zones (Kimberley, Galeshewe, Roodepan) |
| 3.5.5 | Water readings | ✅ Implemented | `ManageDams.jsx` gauge reading entry modal |
| 3.5.6 | Storage levels | ✅ Implemented | Historical percentage and MegaLitres volume tracking |

### 3.6 Reports & analytics
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.6.1 | Deliveries completed | ✅ Implemented | `AdminReportsPage.jsx` summarizes total completed drop-offs |
| 3.6.2 | Litres delivered | ✅ Implemented | Cumulative volume metric (e.g. 145,000 Litres) |
| 3.6.3 | Trips completed | ✅ Implemented | Completed trip counter |
| 3.6.4 | Average delivery time | ✅ Implemented | Average turnaround time metric (42 mins) |
| 3.6.5 | Water incidents | ✅ Implemented | Summary of reported leaks and infrastructure issues |
| 3.6.6 | Most affected areas | ✅ Implemented | Zone vulnerability index |
| 3.6.7 | Truck utilisation | ✅ Implemented | Fleet efficiency chart |
| 3.6.8 | Driver activity | ✅ Implemented | Driver shift performance log |
| 3.6.9 | Historical trends (Chart.js) | ✅ Implemented | Interactive Chart.js trend charts with PDF/CSV export buttons |

### 3.7 System management
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.7.1 | Users | ✅ Implemented | `ManageUsers.jsx` user administration table |
| 3.7.2 | Roles | ✅ Implemented | Role management (`Admin`, `Driver`, `Resident`) |
| 3.7.3 | Permissions | ✅ Implemented | Role-guarded route protection (`ProtectedRoute.jsx`) |
| 3.7.4 | System settings | ✅ Implemented | System configuration and API endpoint settings |
| 3.7.5 | Notifications config | ✅ Implemented | Email & dry-run notification toggle |
| 3.7.6 | Audit / activity logs | ✅ Implemented | Security and system audit log |

### 3.8 Admin profile ("My Profile")
| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.8.1 | Last login | ✅ Implemented | `ProfilePage.jsx` displays last login timestamp in CAT |
| 3.8.2 | Account created date | ✅ Implemented | Displays account creation date |
| 3.8.3 | Change password | ✅ Implemented | Eye toggle password change modal |
| 3.8.4 | 2FA | ✅ Implemented | Two-Factor Authentication toggle switch |
| 3.8.5 | Active sessions | ✅ Implemented | Active browser sessions list |
| 3.8.6 | Login history | ✅ Implemented | Recent authentication logs |
| 3.8.7 | Security alerts | ✅ Implemented | Security audit notifications |
| 3.8.8 | Profile picture upload | ✅ Implemented | Avatar photo uploader with live preview |

---

## 4. Documentation
| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | `AquaBophelo_Project_Documentation.md` updated to reflect: CAT (not SAST), email-only notifications/OTP, corrected plate format, 3-language support, and every feature above once built | ✅ Implemented | Reconciled `AquaBophelo_Project_Documentation.md` with all system updates |
