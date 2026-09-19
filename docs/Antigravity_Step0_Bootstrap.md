# Step 0 — Bootstrap AquaBophelo (task brief for Antigravity)

> Paste this whole file into Antigravity as the task, with the repo root open as the workspace.
> Read `AquaBophelo_Project_Documentation.md` (sections 0, 3, 7, 9, 10 and 11) **before doing anything**.

---

## 1. Goal

Get AquaBophelo from "a lonely API project" to "a working, shared foundation the whole team can build on". When this step is done:

1. All required tools and packages are installed (backend and frontend).
2. The repo has the agreed structure (`backend/`, `frontend/`, `docs/`).
3. The React frontend and the ASP.NET Core backend are **connected and provably working together** (REST call and SignalR connection, both visible on a status page).
4. Everything is pushed to GitHub with a proper `.gitignore` and `README.md`, so Cuba, Nosipho (backend) and Nomcebo, Jabulile (frontend) can clone and start working straight away.

**Out of scope for Step 0** (do NOT build these; they come next, and Cuba wants to learn them step by step): models such as `Dam.cs`, `AppDbContext`, migrations, Identity/JWT configuration, real endpoints beyond the health check, real UI pages.

---

## 2. Context you need

- Machine: Windows, PowerShell, Visual Studio 2022 Community. Repo root on Cuba's machine: `C:\Users\Sisekelo Masombuka\source\repos\AquaBophelo` (the path contains a space, so quote paths).
- Current state: the ASP.NET Core Web API lives **flat in the repo root** (`Controllers/`, `Program.cs`, `AquaBophelo.csproj`, `AquaBophelo.slnx`, `appsettings*.json`, `Properties/`, template leftover `WeatherForecast.cs`). No frontend exists yet.
- Style constraints: controllers-based API, **no top-level statements** (keep the classic `Program` style already in `Program.cs`), no Docker, Scalar for API docs.
- GitHub repo already exists: `github.com/Sisekelo-Masombuka/AqueBophelo` (spelled *Aque*; the local folder is spelled *Aqua*).
- Frontend is **React (JavaScript, not TypeScript) + Vite + Tailwind CSS**.

---

## 3. How to work (important)

- **Teach as you go.** Before each stage, write 2–4 lines in plain language explaining *what* you're about to do and *why*, with a real-world analogy where it helps (for example: CORS is a bouncer at the API's door deciding which websites may talk to it). Cuba wants to understand every step, not just get a working result.
- **Small steps, verify each one.** Run the check listed at the end of each stage before moving on.
- **Checkpoints.** Stop and wait for Cuba's "continue" at: end of Stage 1 (restructure), and just before the push in Stage 7.
- **Ask before** installing system-level software, deleting anything other than the items named here, or doing anything not in this brief.
- **Never** use `git push --force`, `npm install --force`, or `--legacy-peer-deps` without asking first. Never commit secrets, `bin/`, `obj/`, `node_modules/`, database files or `.user` files.
- PowerShell note: run commands one per line (do not chain with `&&`).

---

## 4. Stages

### Stage 0 — Preflight (read-only checks)

Run and report the results:

```
git --version
dotnet --list-sdks
node --version
npm --version
sqllocaldb info
```

Also open `AquaBophelo.csproj` and note the `<TargetFramework>` (for example `net9.0`). The installed .NET SDK must match that major version.

If something is missing, tell Cuba and (with his OK) install via winget, for example:

```
winget install --id Git.Git -e
winget install --id Microsoft.DotNet.SDK.9 -e
winget install --id OpenJS.NodeJS.LTS -e
```

(`sqllocaldb` missing means the LocalDB component of Visual Studio isn't installed; tell Cuba to add it via the Visual Studio Installer. Nothing in Step 0 needs the database yet, but the next step will.)

Then set up the two global helpers:

```
dotnet tool install --global dotnet-ef
dotnet dev-certs https --trust
```

(If `dotnet-ef` is already installed, use `dotnet tool update --global dotnet-ef`. The `dev-certs` command shows a Windows security dialog; Cuba must click **Yes**. This makes the browser trust the local HTTPS API, otherwise the frontend's calls will fail with certificate errors.)

**Check:** all tools report a version; `dotnet-ef --version` works.

---

### Stage 1 — Restructure the repo (follow documentation §3.2 and §3.3)

**Ask Cuba to close Visual Studio first**, then:

1. Create folders: `backend\`, `backend\AquaBophelo\`, `frontend\`, `docs\`.
2. Move `AquaBophelo.slnx` into `backend\`.
3. Move everything else that belongs to the API (`Controllers`, `Properties`, `appsettings.json`, `appsettings.Development.json`, `AquaBophelo.csproj`, `AquaBophelo.http`, `Program.cs`) into `backend\AquaBophelo\`.
4. Delete `bin\`, `obj\`, `AquaBophelo.csproj.user`, `WeatherForecast.cs` and the template weather controller in `Controllers\` (it is only template code).
5. Open `backend\AquaBophelo.slnx` (small XML file) and fix the project path so it points at `AquaBophelo/AquaBophelo.csproj`.
6. Move `AquaBophelo_Project_Documentation.md` and `Antigravity_Step0_Bootstrap.md` into `docs\` if they are present, and place the provided `README.md` in the repo root.

If the folder is already a Git repository, use `git mv` so history follows the files.

**Check:** from `backend\`, `dotnet build` succeeds with 0 errors.

**CHECKPOINT: stop and wait for Cuba's "continue".**

---

### Stage 2 — Backend: install packages and make it ready to talk to a frontend

Work inside `backend\AquaBophelo\`.

**2.1 Packages.** Use the same **major version** as the project's `TargetFramework` (a `net9.0` project needs EF Core 9.x; the newest EF Core release can require a newer framework and will fail to restore). Example for `net9.0`:

```
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version "9.*"
dotnet add package Microsoft.EntityFrameworkCore.Design --version "9.*"
dotnet add package Microsoft.EntityFrameworkCore.Tools --version "9.*"
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version "9.*"
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version "9.*"
```

Confirm `Scalar.AspNetCore` and the OpenAPI package are already present with `dotnet list package`. SignalR's server side is already part of ASP.NET Core, so there is no package for it.

These packages are installed now but **not configured yet**; they are used in the next steps (database, then login). Do **not** install Twilio, SendGrid or any SMS package yet: the SMS provider is still an open team decision.

Run `dotnet user-secrets init` so secrets have a safe home from day one.

**2.2 CORS.** In `appsettings.Development.json` add:

```json
"Cors": { "AllowedOrigins": [ "http://localhost:5173" ] }
```

In `Program.cs` register a CORS policy named `Frontend` that reads those origins, allows any header and method, and calls `AllowCredentials()` (SignalR needs this, and it only works with an explicit origin list, never "allow any origin"). Add `app.UseCors("Frontend")` in the correct place in the pipeline: after `UseHttpsRedirection`/routing and **before** authorization.

**2.3 Health endpoint.** Add `Controllers/HealthController.cs`:
- Route `GET /api/v1/health`, anonymous.
- Returns JSON like `{ "status": "ok", "service": "AquaBophelo API", "serverTimeUtc": "<UTC ISO time>", "environment": "<env name>" }`.

**2.4 SignalR smoke test.** Add `Hubs/PingHub.cs` with one method `Ping()` that returns the text `pong` plus the UTC server time. Register with `builder.Services.AddSignalR()` and map with `app.MapHub<PingHub>("/hubs/ping")`. (This proves real-time works end to end early; the real `TruckHub` comes later.)

**2.5 Keep the existing style.** Do not convert `Program.cs` to top-level statements. Make small, readable edits and explain each line you add.

**Check:**
- `dotnet build` passes.
- Run the API with the `https` launch profile (the port is in `Properties/launchSettings.json`, note it down).
- The Scalar page loads and `GET /api/v1/health` returns `200` with the JSON above. Verify with `Invoke-RestMethod https://localhost:<port>/api/v1/health`.

---

### Stage 3 — Frontend: scaffold and install

From the repo root:

```
npm create vite@latest frontend -- --template react
```

Answer any prompts with: **JavaScript** (not TypeScript), and do **not** start the dev server. Then:

```
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
npm install react-router-dom axios @tanstack/react-query @microsoft/signalr leaflet react-leaflet chart.js react-chartjs-2 lucide-react
```

Notes:
- Check `react-leaflet`'s supported React version against the React version Vite installed. If they clash, pick the compatible `react-leaflet` version instead of forcing it.
- Follow the official Tailwind + Vite install steps for the installed Tailwind version (add the `@tailwindcss/vite` plugin to `vite.config.js` and `@import "tailwindcss";` to `src/index.css`).
- In `vite.config.js` pin the dev server: `server: { port: 5173, strictPort: true }`, so the port always matches the backend CORS origin.
- Define the design tokens from documentation §11 as Tailwind theme colours (`bg`, `surface`, `border`, `text`, `muted`, `cyan`, `green`, `amber`, `red`).
- Create the empty folder skeleton from documentation §10.1 (`api`, `auth`, `components`, `features`, `hooks`, `layouts`, `pages`) using `.gitkeep` files.
- Create `.env.development` containing `VITE_API_BASE_URL=https://localhost:<port from launchSettings.json>` and an `.env.example` with the same key and a placeholder value. (`.env.development` holds no secrets and is committed.)

**Check:** `npm run dev` starts on `http://localhost:5173` and shows the default page with no errors.

---

### Stage 4 — Connect frontend and backend (the "System Check" page)

Replace the default Vite page with a small **System Check** screen (dark navy background, a centred card, using the Tailwind theme colours):

1. `src/api/client.js`: an axios instance whose `baseURL` comes from `import.meta.env.VITE_API_BASE_URL`.
2. `src/components/ConnectionStatus.jsx` shows two rows:
   - **API (REST):** calls `GET /api/v1/health` on load. Shows a green "Online" with the server time on success, and a red "Offline" with a short, human-friendly message on failure (not a raw error).
   - **Live connection (SignalR):** connects to `${VITE_API_BASE_URL}/hubs/ping` using `@microsoft/signalr` with `withAutomaticReconnect()`, calls `Ping`, and shows "Connected", "Reconnecting…" or "Disconnected". Stop the connection in the effect's cleanup so React StrictMode's double render in development doesn't leave duplicate connections.
   - A **Retry** button for both.
3. Status is never colour-only: include an icon and a text label as well (accessibility rule from documentation §6).

**Check (all must pass, run both apps together):**
- Page shows **API: Online** and **Live: Connected** with no CORS or certificate errors in the browser console.
- Stop the API: the page shows **Offline / Reconnecting…** gracefully, without crashing. Start it again: the status recovers (after Retry or by automatic reconnect).
- Tailwind styling is visibly applied (dark theme).

Then explain to Cuba in a short paragraph what CORS is and how this page proves it is set up correctly.

---

### Stage 5 — Repo hygiene

In the repo root:

1. Run `dotnet new gitignore`, then append:
   ```
   # Node / frontend
   node_modules/
   dist/
   *.log
   .env*.local
   ```
2. Add `.gitattributes` with `* text=auto` (avoids Windows line-ending noise between teammates).
3. Confirm `README.md` is in the root and `docs/` contains the two documentation files. Update any placeholder in the README that no longer matches reality (for example the API port).
4. Run `git status` and review the full list of files that would be committed. Nothing from `bin/`, `obj/`, `.vs/`, `node_modules/`, `*.user` or any file containing passwords or API keys.

---

### Stage 6 — Git: prepare commits

Check identity and state:

```
git config user.name
git config user.email
git status
git remote -v
git branch --show-current
```

- If this folder is **not** a Git repo yet: `git init`, set the default branch to `main`, and add the remote `https://github.com/Sisekelo-Masombuka/AqueBophelo.git`.
- If the remote already contains commits (for example a GitHub-generated README or licence): `git fetch origin`, then integrate them (`git pull origin main --allow-unrelated-histories` if the histories are unrelated). If there is anything more than a trivial conflict, **stop and show Cuba**; do not guess.

Make logical commits, not one giant one:

1. `chore: restructure repo into backend/ frontend/ docs/`
2. `feat(backend): add EF Core/Identity/JWT packages, CORS, health endpoint and SignalR ping hub`
3. `feat(frontend): scaffold React + Vite + Tailwind with System Check page`
4. `docs: add README and project documentation`

---

### Stage 7 — Push to GitHub

**CHECKPOINT:** before pushing, show Cuba the output of `git log --oneline` and `git status`, and confirm no secrets are included.

Then: `git push -u origin main`.

If authentication is required, Windows' Git Credential Manager opens a browser sign-in: Cuba completes it. If the agent cannot authenticate, give Cuba the exact command to run himself.

**Fresh-clone test (proves teammates will succeed):**

```
git clone https://github.com/Sisekelo-Masombuka/AqueBophelo.git "$env:TEMP\aquabophelo-verify"
cd "$env:TEMP\aquabophelo-verify\backend\AquaBophelo"
dotnet build
cd ..\..\frontend
npm ci
npm run build
```

Both builds must pass. Then delete the temporary folder.

---

## 5. Things only Cuba can do (remind him at the end)

- Click **Yes** on the dev-certificate dialog.
- Sign in to GitHub if the credential prompt appears.
- On GitHub → repo **Settings → Collaborators**, add Nosipho, Nomcebo and Jabulile with write access.
- Optional: protect `main` (require pull requests) if the repo plan allows it.
- Tell the team to pull, then follow the **Getting started** section of the README.

---

## 6. Definition of done (report each item as PASS/FAIL with evidence)

- [ ] Tooling verified: Git, .NET SDK matching the project, Node LTS, `dotnet-ef`, dev certificate trusted.
- [ ] Repo restructured: `backend/`, `frontend/`, `docs/`, `README.md` in the root; template weather code removed.
- [ ] `dotnet build` passes from `backend/`.
- [ ] `GET /api/v1/health` returns 200; Scalar page loads.
- [ ] Frontend runs on `http://localhost:5173`; Tailwind works.
- [ ] System Check page shows **API: Online** and **Live: Connected**, with no console errors.
- [ ] Offline behaviour is graceful and recovers when the API returns.
- [ ] `.gitignore` and `.gitattributes` in place; no secrets or build output tracked.
- [ ] Pushed to `main` on GitHub; README renders correctly there.
- [ ] Fresh clone builds (`dotnet build`, `npm ci`, `npm run build`).

## 7. Final report format

1. **What was installed** (tool and package names with versions).
2. **What changed** (files created/moved/deleted, grouped by folder).
3. **Verification results** (the checklist above with evidence).
4. **Ports and URLs** (API, Scalar, frontend).
5. **Anything needing a human action or a decision.**
6. **Suggested next step:** create `Models/Dam.cs` from the ER diagram (concept first, then code).
