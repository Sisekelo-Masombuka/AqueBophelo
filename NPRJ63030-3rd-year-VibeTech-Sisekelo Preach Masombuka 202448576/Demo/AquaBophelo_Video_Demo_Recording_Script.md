# AquaBophelo — 5-Minute Video Demonstration Script & Walkthrough Runbook
**Module:** NPRT 630 / NPRJ 63030 Project (ICT 3rd Year)  
**Team:** VibeTech (Sisekelo Preach Masombuka, Nomcebo Nkosi, Nosipho Mbatha, Jabulile Shabalala)  
**Lecturer:** Melvin Kisten  

---

## ⏱️ Video Breakdown (Exact 5 Minutes)

### [00:00 – 00:45] Intro & Municipal Problem Statement (Presenter: Sisekelo)
- **Visual:** Display Project Title Slide, Sol Plaatje University Crest & VibeTech Team Members.
- **Speaking Points:**
  > "Good day Mr. Kisten. We are Team VibeTech presenting AquaBophelo, our municipal water monitoring, smart fault reporting, and real-time tanker telemetry web system.
  > In Sol Plaatje Local Municipality (Kimberley, Galeshewe, and Ritchie), citizens suffer prolonged water cutoffs lasting up to 96 hours.
  > Prior to AquaBophelo, tanker deliveries were announced on unverified WhatsApp groups, paper leak reporting took 4.2 days, and tankers had zero proof-of-delivery verification.
  > Today we demonstrate our working, fully deployed system that solves these breakdowns."

---

### [00:45 – 01:45] Citizen Journey: Landing, Dam Telemetry & Fault Logging (Presenter: Nomcebo)
- **Visual:** Open `http://localhost:5173/`. Scroll past live dam gauges (Newton Reservoir, Riverton) and click **"Report Water Issue"**.
- **Actions:**
  1. Fill form: Resident **Nomcebo Nkosi**, Area **Galeshewe**, Address **12 Motswedi St**.
  2. Issue: **Pipe Leak**. Attach photo proof.
  3. Click **Submit Report**. Show ticket popup with reference **#SPM-2026-XXXX**.
  4. Navigate to `/track-trucks`. Show the interactive MapLibre map with animated tanker markers.
- **Speaking Points:**
  > "On our citizen landing page, residents can monitor live municipal dam storage levels in real time.
  > When a resident discovers a burst pipe, they log a digital ticket with photo evidence in under 45 seconds.
  > The system immediately generates an official municipal ticket reference and alerts both the citizen via email and the municipal dispatch center.
  > Citizens can also track live water tankers moving towards their designated drop points."

---

### [01:45 – 03:00] Driver Navigation & Live Camera Proof of Delivery (Presenter: Nosipho)
- **Visual:** Switch to Driver Screen at `http://localhost:5173/driver/trip`.
- **Actions:**
  1. Show active trip for tanker **542-KM NC** (10,000L capacity).
  2. Click **Start Trip (Live Simulation)**. Point to the SignalR live coordinates broadcasting to the hub.
  3. Arrive at Stop 1 (**Galeshewe Primary School Tank**). Click **Complete Stop / POD**.
  4. Show the new **2-column Proof of Delivery modal**:
     - Left: 2,500L Delivered, Specific Location, Recipient PIN **4829**.
     - Right: In-app **Live Camera Viewfinder**. Snap photo of delivery valve.
  5. Click **Confirm Delivery**. Stop turns green with **POD Verified** badge.
- **Speaking Points:**
  > "For our tanker drivers, AquaBophelo provides a turn-by-turn manifest.
  > Notice the live GPS telemetry broadcasting over SignalR WebSockets. When the driver arrives at Galeshewe Primary Tank, the truck marker automatically freezes at the stop location on citizen screens.
  > To prove delivery completion, the driver opens our live camera viewfinder, captures a live photograph of the valve discharge, enters the recipient PIN, and records the delivery.
  > This eliminates delivery disputes and verifies municipal relief accountability."

---

### [03:00 – 04:15] Admin Operations, Lightbox Inspection & Area Alerts (Presenter: Sisekelo)
- **Visual:** Switch to Admin Overview at `http://localhost:5173/admin/overview`.
- **Actions:**
  1. Show live fleet metrics and incoming ticket table.
  2. Click **View Photo** on Nomcebo's ticket. Show the full-screen photo evidence lightbox modal.
  3. Click **Update Status** -> change to **Investigating**.
  4. Click **Broadcast Alert**. Compose:
     - Title: `Emergency Main Pipeline Repair - Galeshewe Zone 3`
     - Severity: `Critical`
     - Target Municipal Area: Select **Galeshewe**.
  5. Click **Broadcast**. Show success message.
- **Speaking Points:**
  > "In the Admin Command Center, municipal dispatchers have complete visibility.
  > The dispatcher can inspect the citizen's uploaded pipe burst photo in high resolution before dispatching maintenance crews.
  > When an emergency outage occurs, the administrator dispatches a targeted broadcast.
  > Notice that when Galeshewe is selected, our Brevo notification engine isolates strictly Galeshewe residents, preventing alert fatigue in unaffected suburbs."

---

### [04:15 – 05:00] Code Quality, Automated Testing & Conclusion (Presenter: Jabulile)
- **Visual:** Show terminal running `dotnet test backend/AquaBophelo.slnx` (20/20 Passed) and `npm run build` (0 errors).
- **Speaking Points:**
  > "Behind the scenes, AquaBophelo is powered by an ASP.NET Core 10 Web API and React 19 SPA.
  > We maintain clean, robust code with global exception filters, rate limiting, and 20 automated xUnit tests passing with 100% success.
  > We conducted formal usability testing with 5 participants, achieving an 88.5 System Usability Scale score (Grade A).
  > All citizen data is protected under POPIA regulations with a 30-day soft-delete cycle.
  > Thank you Mr. Kisten, and we look forward to our live Q&A defense."

---

## 📹 Video File Upload Note
Save your final recorded video inside this `Demo/` folder as:
`AquaBophelo_Demo.mp4` (or upload to YouTube / Google Drive unlisted link and paste into `Demo_Video_Link.txt`).
