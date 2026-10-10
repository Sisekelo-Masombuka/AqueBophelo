# React JSX Comprehensive Codebase Audit Report

**Scope**: `frontend/src/` (excluding `components/LiveMap.jsx`)

**Total Files Audited**: 73 JSX/React Files


---

**Files with Audit Findings**: 48 / 73
**Total Issues Cataloged**: 878

### File: `frontend/src/auth/AuthContext.jsx` (3 findings)

- **Line 54** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `role: response.data.role || (email.toLowerCase().includes('admin') ? 'Admin' : email.toLowerCase().includes('driver') ? 'Driver' : 'Resident'),`

- **Line 108** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `role: 'Resident',`

- **Line 124** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `role: 'Resident',`

### File: `frontend/src/components/AlertSubscriptionsModal.jsx` (19 findings)

- **Line 56** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], border-[#bcd6ea], text-[#1d70b8]
  - *Snippet*: `<div className="p-2.5 rounded-md bg-[#eaf4fb] border border-[#bcd6ea] text-[#1d70b8]">`

- **Line 60** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-lg font-bold text-[#152e52]">Municipal Email Alert Preferences</h2>`

- **Line 84** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `<div className="mb-4 p-3 bg-[#f2f9f3] border border-[#b8e3bd] rounded-md text-xs text-[#2e7d32] flex items-center gap-2 font-medium">`

- **Line 99** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 118** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 120** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 mt-1">Direct email notifications for water tanker dispatches and drought advisories</p>`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<label className="flex items-center space-x-3 p-3 rounded-md bg-[#f8fafc] border border-slate-200 cursor-pointer text-xs text-slate-800">`

- **Line 134** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="w-4 h-4 rounded text-[#152e52] focus:ring-0"`

- **Line 137** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-semibold text-[#152e52]">Dam Storage Warnings</span>`

- **Line 138** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 font-normal">Notify when Newton or Riverton storage drops below 50%</p>`

- **Line 142** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<label className="flex items-center space-x-3 p-3 rounded-md bg-[#f8fafc] border border-slate-200 cursor-pointer text-xs text-slate-800">`

- **Line 147** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="w-4 h-4 rounded text-[#152e52] focus:ring-0"`

- **Line 150** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-semibold text-[#152e52]">Water Tanker Dispatched to {area}</span>`

- **Line 151** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 font-normal">Get notified when a truck departs for your zone</p>`

- **Line 155** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<label className="flex items-center space-x-3 p-3 rounded-md bg-[#f8fafc] border border-slate-200 cursor-pointer text-xs text-slate-800">`

- **Line 160** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="w-4 h-4 rounded text-[#152e52] focus:ring-0"`

- **Line 163** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-semibold text-[#152e52]">Emergency Municipal Announcements</span>`

- **Line 164** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 font-normal">Urgent pipe repairs, maintenance, or boil notices</p>`

- **Line 182** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"`

### File: `frontend/src/components/BrandLogo.jsx` (4 findings)

- **Line 20** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `? 'text-[11px]'`

- **Line 22** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[9px]
  - *Snippet*: `? 'text-[9px]'`

- **Line 23** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `: 'text-[10px]';`

- **Line 25** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `const titleColor = textTheme === 'light' ? 'text-white' : 'text-[#152e52]';`

### File: `frontend/src/components/BroadcastAlertModal.jsx` (11 findings)

- **Line 71** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">`

- **Line 85** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `? 'bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32]'`

- **Line 106** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 119** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 134** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 155** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md p-3 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] resize-none"`

- **Line 160** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-center justify-between">`

- **Line 168** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="rounded text-[#152e52] focus:ring-0"`

- **Line 171** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<MessageSquare className="w-3.5 h-3.5 text-[#1d70b8]" /> SMS`

- **Line 179** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="rounded text-[#152e52] focus:ring-0"`

- **Line 182** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Mail className="w-3.5 h-3.5 text-[#1d70b8]" /> Email`

### File: `frontend/src/components/ConnectionStatus.jsx` (25 findings)

- **Line 110** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#0B1220], text-[#E6EDF7]
  - *Snippet*: `<div className="min-h-screen bg-[#0B1220] text-[#E6EDF7] flex items-center justify-center p-4">`

- **Line 111** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#111B2E], border-[#1F2C45]
  - *Snippet*: `<div className="w-full max-w-lg bg-[#111B2E] border border-[#1F2C45] rounded-xl shadow-2xl p-6 space-y-6">`

- **Line 114** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1F2C45]
  - *Snippet*: `<div className="flex items-center space-x-3 border-b border-[#1F2C45] pb-4">`

- **Line 115** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#22D3EE]
  - *Snippet*: `<Activity className="w-7 h-7 text-[#22D3EE]" />`

- **Line 117** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#E6EDF7]
  - *Snippet*: `<h1 className="text-xl font-bold text-[#E6EDF7]">AquaBophelo System Check</h1>`

- **Line 118** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<p className="text-xs text-[#8A9BB8]">Frontend ↔ Backend Foundation Test</p>`

- **Line 126** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#0B1220], border-[#1F2C45]
  - *Snippet*: `<div className="bg-[#0B1220] border border-[#1F2C45] rounded-lg p-4 flex flex-col space-y-2">`

- **Line 128** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<span className="font-semibold text-sm text-[#8A9BB8] flex items-center gap-2">`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#22D3EE]
  - *Snippet*: `<Clock className="w-4 h-4 text-[#22D3EE]" />`

- **Line 134** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1F2C45], text-[#8A9BB8]
  - *Snippet*: `<span className="px-2.5 py-1 text-xs rounded-full bg-[#1F2C45] text-[#8A9BB8] flex items-center gap-1.5 font-medium">`

- **Line 135** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8A9BB8]" />`

- **Line 140** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22C55E], text-[#22C55E], border-[#22C55E]
  - *Snippet*: `<span className="px-2.5 py-1 text-xs rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1.5 font-medium">`

- **Line 146** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#EF4444], text-[#EF4444], border-[#EF4444]
  - *Snippet*: `<span className="px-2.5 py-1 text-xs rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1.5 font-medium">`

- **Line 154** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<p className="text-xs text-[#8A9BB8] font-mono">`

- **Line 160** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#EF4444]
  - *Snippet*: `<p className="text-xs text-[#EF4444]">`

- **Line 167** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#0B1220], border-[#1F2C45]
  - *Snippet*: `<div className="bg-[#0B1220] border border-[#1F2C45] rounded-lg p-4 flex flex-col space-y-2">`

- **Line 169** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<span className="font-semibold text-sm text-[#8A9BB8] flex items-center gap-2">`

- **Line 170** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#22D3EE]
  - *Snippet*: `<Wifi className="w-4 h-4 text-[#22D3EE]" />`

- **Line 175** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1F2C45], text-[#8A9BB8]
  - *Snippet*: `<span className="px-2.5 py-1 text-xs rounded-full bg-[#1F2C45] text-[#8A9BB8] flex items-center gap-1.5 font-medium">`

- **Line 176** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8A9BB8]" />`

- **Line 181** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22C55E], text-[#22C55E], border-[#22C55E]
  - *Snippet*: `<span className="px-2.5 py-1 text-xs rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1.5 font-medium">`

- **Line 187** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#F59E0B], text-[#F59E0B], border-[#F59E0B]
  - *Snippet*: `<span className="px-2.5 py-1 text-xs rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center gap-1.5 font-medium">`

- **Line 193** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#EF4444], text-[#EF4444], border-[#EF4444]
  - *Snippet*: `<span className="px-2.5 py-1 text-xs rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1.5 font-medium">`

- **Line 201** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<p className="text-xs text-[#8A9BB8] font-mono">`

- **Line 216** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22D3EE], text-[#0B1220], bg-[#22D3EE]
  - *Snippet*: `className="px-4 py-2 bg-[#22D3EE] text-[#0B1220] font-semibold text-sm rounded-lg hover:bg-[#22D3EE]/90 transition-colors flex items-center gap-2"`

### File: `frontend/src/components/ConnectionStatusBadge.jsx` (9 findings)

- **Line 9** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22C55E], border-[#22C55E], text-[#22C55E]
  - *Snippet*: `bg: 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]',`

- **Line 10** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22C55E]
  - *Snippet*: `dot: 'bg-[#22C55E] animate-pulse',`

- **Line 16** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22D3EE], border-[#22D3EE], text-[#22D3EE]
  - *Snippet*: `bg: 'bg-[#22D3EE]/15 border-[#22D3EE]/40 text-[#22D3EE]',`

- **Line 17** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22D3EE]
  - *Snippet*: `dot: 'bg-[#22D3EE] animate-pulse',`

- **Line 24** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#F59E0B], border-[#F59E0B], text-[#F59E0B]
  - *Snippet*: `bg: 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]',`

- **Line 25** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#F59E0B]
  - *Snippet*: `dot: 'bg-[#F59E0B]',`

- **Line 33** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#EF4444], border-[#EF4444], text-[#EF4444]
  - *Snippet*: `bg: 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]',`

- **Line 34** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#EF4444]
  - *Snippet*: `dot: 'bg-[#EF4444]',`

- **Line 52** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<span className="hidden lg:inline text-[10px] opacity-75 border-l border-current pl-1.5 ml-1">`

### File: `frontend/src/components/DamPanel.jsx` (6 findings)

- **Line 18** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `if (level >= 50) return 'bg-[#2e7d32]';`

- **Line 29** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Droplet className="w-5 h-5 text-[#152e52] fill-current shrink-0 mt-0.5" />`

- **Line 31** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] leading-snug">{name}</h3>`

- **Line 41** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="text-3xl font-serif font-bold text-[#152e52]">{latestLevel}%</span>`

- **Line 45** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="text-sm font-bold text-[#152e52]">{volumeMegaLitres} ML</span>`

- **Line 72** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="text-[#152e52] hover:underline font-medium flex items-center gap-0.5 cursor-pointer"`

### File: `frontend/src/components/DemoSimulationControls.jsx` (3 findings)

- **Line 131** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#111B2E], border-[#1F2C45]
  - *Snippet*: `<div className="bg-slate-900/90 dark:bg-[#111B2E]/90 backdrop-blur-md border border-slate-700 dark:border-[#1F2C45] rounded-2xl p-4 shadow-2xl text-slate-100 mb-6">`

- **Line 138** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">`

- **Line 180** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${`

### File: `frontend/src/components/EmptyState.jsx` (5 findings)

- **Line 12** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#111B2E], border-[#1F2C45]
  - *Snippet*: `<div className="bg-[#111B2E] border border-[#1F2C45] border-dashed rounded-2xl p-8 text-center max-w-md mx-auto my-6">`

- **Line 13** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1F2C45], text-[#8A9BB8]
  - *Snippet*: `<div className="w-12 h-12 rounded-full bg-[#1F2C45]/60 text-[#8A9BB8] flex items-center justify-center mx-auto mb-3">`

- **Line 16** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#E6EDF7]
  - *Snippet*: `<h3 className="font-bold text-base text-[#E6EDF7] mb-1">{title}</h3>`

- **Line 17** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<p className="text-xs text-[#8A9BB8] mb-4 leading-relaxed">{description}</p>`

- **Line 21** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22D3EE], bg-[#22D3EE], text-[#22D3EE], border-[#22D3EE]
  - *Snippet*: `className="px-4 py-2 bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 text-[#22D3EE] border border-[#22D3EE]/40 rounded-xl text-xs font-semibold transition-all"`

### File: `frontend/src/components/Footer.jsx` (8 findings)

- **Line 11** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], border-[#2e7d32], bg-[#1d70b8]
  - *Snippet*: `<footer className="bg-[#152e52] border-t-4 border-[#2e7d32] text-slate-200 font-sans selection:bg-[#1d70b8] selection:text-white mt-auto">`

- **Line 22** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#62d26f]
  - *Snippet*: `<div className="flex items-center space-x-1.5 text-xs text-[#62d26f] font-semibold pt-1">`

- **Line 23** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#62d26f]
  - *Snippet*: `<ShieldCheck className="w-4 h-4 shrink-0 text-[#62d26f]" />`

- **Line 74** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#62d26f]
  - *Snippet*: `<Phone className="w-3.5 h-3.5 text-[#62d26f] shrink-0 mt-0.5" />`

- **Line 81** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#62d26f]
  - *Snippet*: `<Phone className="w-3.5 h-3.5 text-[#62d26f] shrink-0 mt-0.5" />`

- **Line 88** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#62d26f]
  - *Snippet*: `<Mail className="w-3.5 h-3.5 text-[#62d26f] shrink-0 mt-0.5" />`

- **Line 104** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#62d26f]
  - *Snippet*: `<MapPin className="w-3.5 h-3.5 text-[#62d26f]" />`

- **Line 112** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px], bg-[#2e7d32]
  - *Snippet*: `<span className="inline-block text-[11px] bg-[#2e7d32] text-white px-2.5 py-1 rounded-md font-medium">`

### File: `frontend/src/components/ForgotPasswordModal.jsx` (8 findings)

- **Line 48** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], border-[#bcd6ea], text-[#1d70b8]
  - *Snippet*: `<div className="w-9 h-9 rounded-md bg-[#eaf4fb] border border-[#bcd6ea] flex items-center justify-center text-[#1d70b8] shrink-0">`

- **Line 52** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-lg text-[#152e52]">Reset Password</h3>`

- **Line 65** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `<div className="p-5 bg-[#f2f9f3] border border-[#b8e3bd] rounded-md text-center space-y-3 my-2">`

- **Line 66** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-10 h-10 text-[#2e7d32] mx-auto" />`

- **Line 67** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-sm font-medium text-[#152e52]">{successMessage}</p>`

- **Line 72** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full py-2 bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-medium rounded-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"`

- **Line 109** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 124** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white rounded-md text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"`

### File: `frontend/src/components/LanguageSwitcher.jsx` (2 findings)

- **Line 10** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Globe className="w-3.5 h-3.5 text-[#152e52] shrink-0" />`

- **Line 14** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="bg-transparent text-[#152e52] font-semibold focus:outline-none cursor-pointer text-xs"`

### File: `frontend/src/components/NotificationCenter.jsx` (16 findings)

- **Line 44** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `if (type === 'truck') return <Truck className="w-4 h-4 text-[#2e7d32]" />;`

- **Line 45** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `if (type === 'dam') return <Droplet className="w-4 h-4 text-[#152e52]" />;`

- **Line 47** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `return <Info className="w-4 h-4 text-[#152e52]" />;`

- **Line 54** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="p-2 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-[#152e52] hover:bg-slate-50 transition-colors relative cursor-pointer"`

- **Line 57** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Bell className="w-4 h-4 text-[#152e52]" />`

- **Line 59** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">`

- **Line 70** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border-b border-slate-200 px-4 py-3 flex items-center justify-between">`

- **Line 72** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Bell className="w-4 h-4 text-[#152e52]" />`

- **Line 73** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-sm text-[#152e52]">System Notifications</h3>`

- **Line 79** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `className="text-[#2e7d32] hover:underline font-semibold flex items-center gap-1 cursor-pointer"`

- **Line 105** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f4f8fb]
  - *Snippet*: `n.read ? 'bg-white' : 'bg-[#f4f8fb]'`

- **Line 111** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-xs font-bold text-[#152e52] leading-snug">{n.title}</p>`

- **Line 112** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-600 leading-relaxed font-normal">{n.message}</p>`

- **Line 113** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<span className="text-[10px] text-slate-400 font-normal block pt-1">{n.time}</span>`

- **Line 130** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border-t border-slate-200 p-2.5 text-center">`

- **Line 131** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-[11px] text-slate-500 font-normal">`

### File: `frontend/src/components/ReportIssueModal.jsx` (12 findings)

- **Line 92** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<AlertCircle className="h-6 w-6 text-[#152e52] shrink-0" />`

- **Line 94** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">Report Water Issue</h3>`

- **Line 108** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `<div className="p-5 bg-[#f2f9f3] border border-[#b8e3bd] rounded-md text-center space-y-2 my-4">`

- **Line 109** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-10 h-10 text-[#2e7d32] mx-auto" />`

- **Line 110** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-sm font-medium text-[#152e52]">{successMessage}</p>`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 147** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 163** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 176** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full p-3 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8]"`

- **Line 188** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Upload className="w-3.5 h-3.5 text-[#152e52]" />`

- **Line 214** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-[11px] text-slate-400 italic">No image chosen (optional)</span>`

- **Line 230** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"`

### File: `frontend/src/components/ScheduledOutagesComponent.jsx` (14 findings)

- **Line 124** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#152e52] uppercase tracking-wider mb-1">`

- **Line 125** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Calendar className="w-4 h-4 text-[#152e52]" />`

- **Line 128** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-xl text-[#152e52]">`

- **Line 139** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-3.5 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"`

- **Line 151** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `className="bg-[#f8fafc] border border-slate-200 rounded-md p-4 space-y-3 flex flex-col justify-between"`

- **Line 155** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-serif font-bold text-sm text-[#152e52] flex items-center gap-1.5">`

- **Line 156** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<MapPin className="w-3.5 h-3.5 text-[#152e52] shrink-0" />`

- **Line 166** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<span className="text-[10px] text-red-700 font-bold uppercase block">Water Cut Off:</span>`

- **Line 167** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="font-mono text-slate-900 font-semibold text-[11px]">{formatDate(item.cutOffTime || item.cutTime)}</span>`

- **Line 170** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px], text-[#2e7d32]
  - *Snippet*: `<span className="text-[10px] text-[#2e7d32] font-bold uppercase block">Expected Return:</span>`

- **Line 171** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="font-mono text-slate-900 font-semibold text-[11px]">{formatDate(item.expectedReturnTime || item.restoreTime)}</span>`

- **Line 176** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-normal flex items-center gap-1.5">`

- **Line 195** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52] mb-1">`

- **Line 274** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#152e52] text-white hover:bg-[#0f223d] cursor-pointer disabled:opacity-50"`

### File: `frontend/src/components/Sidebar.jsx` (13 findings)

- **Line 67** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-[#152e52] hover:bg-slate-100 transition-colors cursor-pointer"`

- **Line 87** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `? 'bg-[#152e52] text-white font-semibold shadow-xs'`

- **Line 88** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `: 'text-slate-600 hover:bg-slate-100 hover:text-[#152e52]'`

- **Line 94** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#1d70b8]'}`} />`

- **Line 113** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-[#152e52] hover:bg-slate-100 transition-colors"`

- **Line 116** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Globe className="w-3.5 h-3.5 text-[#1d70b8]" />`

- **Line 119** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px], bg-[#eaf4fb], text-[#1d70b8], border-[#bcd6ea]
  - *Snippet*: `<span className="text-[10px] bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea] px-1.5 py-0.5 rounded-md font-semibold">`

- **Line 126** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-[#152e52] hover:bg-slate-100 transition-colors"`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />`

- **Line 134** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-3 rounded-md border border-slate-200 flex items-center justify-between">`

- **Line 136** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-xs font-bold text-[#152e52] flex items-center gap-1">`

- **Line 137** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />`

- **Line 140** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 mt-0.5">Sol Plaatje Municipality</p>`

### File: `frontend/src/components/StatCard.jsx` (3 findings)

- **Line 3** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `export function StatCard({ title, value, subtitle, icon: Icon, accentColor = '#152e52' }) {`

- **Line 9** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `{Icon && <Icon className="h-4 h-4 shrink-0 text-[#152e52]" aria-hidden="true" />}`

- **Line 11** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#152e52]">{value}</h2>`

### File: `frontend/src/components/StatusBadge.jsx` (2 findings)

- **Line 18** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `classes: 'bg-[#2e7d32] text-white font-semibold shadow-2xs',`

- **Line 36** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `classes: 'bg-[#152e52] text-white font-semibold shadow-2xs',`

### File: `frontend/src/components/TrendChart.jsx` (15 findings)

- **Line 51** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `borderColor: '#152e52',`

- **Line 54** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `pointBackgroundColor: '#1d70b8',`

- **Line 55** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #FFFFFF
  - *Snippet*: `pointBorderColor: '#FFFFFF',`

- **Line 73** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #FFFFFF
  - *Snippet*: `backgroundColor: '#FFFFFF',`

- **Line 74** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `titleColor: '#152e52',`

- **Line 75** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `bodyColor: '#1d70b8',`

- **Line 76** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #e2e8f0
  - *Snippet*: `borderColor: '#e2e8f0',`

- **Line 88** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #f1f5f9
  - *Snippet*: `color: '#f1f5f9',`

- **Line 91** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #64748b
  - *Snippet*: `color: '#64748b',`

- **Line 99** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #f1f5f9
  - *Snippet*: `color: '#f1f5f9',`

- **Line 102** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #64748b
  - *Snippet*: `color: '#64748b',`

- **Line 115** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-lg text-[#152e52] flex items-center gap-2">`

- **Line 136** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `? 'bg-[#152e52] text-white font-semibold shadow-xs'`

- **Line 137** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `: 'text-slate-600 hover:text-[#152e52]'`

- **Line 157** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-[11px] text-slate-400">Source: Sol Plaatje Municipal Water Division</span>`

### File: `frontend/src/components/public/LandingHeroVisual.jsx` (2 findings)

- **Line 16** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<p className="text-[10px] font-heading font-semibold uppercase tracking-wide text-brand-navy-dark">`

- **Line 19** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="mt-1 text-[11px] leading-snug text-muted">`

### File: `frontend/src/components/ui/EmptyState.jsx` (4 findings)

- **Line 14** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#0B1220], border-[#1F2C45]
  - *Snippet*: `className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-slate-50 dark:bg-[#0B1220]/50 border border-slate-200 dark:border-[#1F2C45] rounded-2xl ${className}`}`

- **Line 17** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#22D3EE], border-[#22D3EE], text-[#22D3EE]
  - *Snippet*: `<div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-[#22D3EE]/10 border border-sky-200 dark:border-[#22D3EE]/20 flex items-center justify-center text-sky-600 dark:text-[#22D3EE] mb-4">`

- **Line 22** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#E6EDF7]
  - *Snippet*: `<h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-[#E6EDF7] mb-1">`

- **Line 26** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#8A9BB8]
  - *Snippet*: `<p className="text-xs md:text-sm text-slate-600 dark:text-[#8A9BB8] max-w-md mb-6 leading-relaxed">`

### File: `frontend/src/components/ui/LoadingSkeleton.jsx` (1 findings)

- **Line 11** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1F2C45]
  - *Snippet*: `className={`bg-slate-200 dark:bg-[#1F2C45]/60 animate-pulse rounded-xl ${className}`}`

### File: `frontend/src/context/LanguageContext.jsx` (1 findings)

- **Line 35** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `resident: 'Resident',`

### File: `frontend/src/layouts/AdminLayout.jsx` (5 findings)

- **Line 43** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-slate-700">`

- **Line 46** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32], text-[11px]
  - *Snippet*: `<span className="flex items-center space-x-1.5 rounded-md bg-[#2e7d32] text-white px-2 py-0.5 text-[11px] font-medium">`

- **Line 51** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="mt-1 font-serif text-xl md:text-2xl font-bold text-[#152e52]">`

- **Line 82** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `? 'bg-[#152e52] text-white font-semibold shadow-xs'`

- **Line 83** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `: 'text-slate-600 hover:bg-slate-100 hover:text-[#152e52]'`

### File: `frontend/src/layouts/MainLayout.jsx` (7 findings)

- **Line 23** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row font-sans">`

- **Line 54** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="md:hidden p-2 rounded-md text-[#152e52] hover:bg-slate-100 transition-colors cursor-pointer"`

- **Line 63** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="text-xs font-bold text-[#152e52] tracking-tight">`

- **Line 66** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-[11px] text-slate-500 font-normal">`

- **Line 76** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `<div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] text-xs font-medium">`

- **Line 77** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `<span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />`

- **Line 94** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#1f3f6e]
  - *Snippet*: `className="w-8 h-8 rounded-full bg-[#152e52] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer hover:bg-[#1f3f6e] transition-colors"`

### File: `frontend/src/pages/AboutUsPage.jsx` (34 findings)

- **Line 13** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-[#1d70b8] selection:text-white">`

- **Line 22** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 25** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 28** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 31** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/about" className="text-[#152e52] font-semibold">`

- **Line 34** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/contact" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 41** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/login" className="text-sm font-medium text-slate-700 hover:text-[#152e52]">`

- **Line 45** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `<button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">`

- **Line 54** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<section className="bg-[#f8fafc] border-b border-slate-200 py-12 md:py-16">`

- **Line 56** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#2e7d32]
  - *Snippet*: `<div className="flex items-center justify-center gap-2 border-l-2 border-[#2e7d32] pl-2 mx-auto w-fit">`

- **Line 57** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="text-[#2e7d32] font-medium text-sm italic">`

- **Line 61** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#152e52]">`

- **Line 75** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<div className="text-[#152e52] flex items-center gap-2">`

- **Line 76** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Droplet className="w-5 h-5 text-[#152e52]" />`

- **Line 77** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">{t('realtimeStorage')}</h3>`

- **Line 85** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<div className="text-[#152e52] flex items-center gap-2">`

- **Line 86** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Truck className="w-5 h-5 text-[#152e52]" />`

- **Line 87** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">{t('liveTankerMap')}</h3>`

- **Line 95** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<div className="text-[#152e52] flex items-center gap-2">`

- **Line 96** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<AlertTriangle className="w-5 h-5 text-[#152e52]" />`

- **Line 97** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">{t('verifiedEmailNotifications')}</h3>`

- **Line 108** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#152e52]">{t('knowYourSystem')}</h2>`

- **Line 115** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-2">`

- **Line 116** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<span className="w-7 h-7 rounded-md bg-[#152e52] text-white font-bold flex items-center justify-center text-xs">1</span>`

- **Line 117** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-[#152e52] text-sm">{t('damLevelEntry')}</h4>`

- **Line 121** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-2">`

- **Line 122** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<span className="w-7 h-7 rounded-md bg-[#152e52] text-white font-bold flex items-center justify-center text-xs">2</span>`

- **Line 123** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-[#152e52] text-sm">{t('autoThresholds')}</h4>`

- **Line 127** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-2">`

- **Line 128** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<span className="w-7 h-7 rounded-md bg-[#152e52] text-white font-bold flex items-center justify-center text-xs">3</span>`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-[#152e52] text-sm">{t('liveGpsTelemetry')}</h4>`

- **Line 133** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#c3e6c8]
  - *Snippet*: `<div className="bg-[#f2f9f3] p-5 rounded-lg border border-[#c3e6c8] space-y-2">`

- **Line 134** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `<span className="w-7 h-7 rounded-md bg-[#2e7d32] text-white font-bold flex items-center justify-center text-xs">4</span>`

- **Line 135** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<h4 className="font-serif font-bold text-[#2e7d32] text-sm">{t('residentEmpowerment')}</h4>`

### File: `frontend/src/pages/ContactUsPage.jsx` (28 findings)

- **Line 62** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-[#1d70b8] selection:text-white">`

- **Line 71** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 74** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 77** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 80** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/about" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 83** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/contact" className="text-[#152e52] font-semibold">`

- **Line 90** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/login" className="text-sm font-medium text-slate-700 hover:text-[#152e52]">`

- **Line 94** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `<button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">`

- **Line 106** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152e52]">`

- **Line 116** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="md:col-span-4 bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-6">`

- **Line 117** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-xl font-bold text-[#152e52]">{t('emergencyHotlines')}</h2>`

- **Line 121** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Phone className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />`

- **Line 124** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52] text-sm mt-0.5">053 830 6100</p>`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Phone className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />`

- **Line 132** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52] text-sm mt-0.5">053 830 6911</p>`

- **Line 137** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Mail className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />`

- **Line 140** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52] text-xs mt-0.5">water@solplaatje.org.za</p>`

- **Line 145** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<MapPin className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />`

- **Line 156** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-xs font-semibold text-[#152e52] flex items-center gap-1.5">`

- **Line 160** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500">Inquiries submitted online are answered within 24 hours.</p>`

- **Line 166** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl font-bold text-[#152e52]">{t('contactTitle')}</h2>`

- **Line 169** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#2e7d32], text-[#2e7d32]
  - *Snippet*: `<div className="p-4 rounded-md bg-[#f2f9f3] border border-[#2e7d32]/30 text-[#2e7d32] space-y-1">`

- **Line 171** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />`

- **Line 198** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8]"`

- **Line 213** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8]"`

- **Line 228** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8]"`

- **Line 238** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] resize-y"`

- **Line 250** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="bg-[#152e52] hover:bg-[#0f223d] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"`

### File: `frontend/src/pages/LandingPage.jsx` (55 findings)

- **Line 66** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Sipho Dlamini' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Sipho Dlamini',`

- **Line 78** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Lerato Motsepe' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Lerato Motsepe',`

- **Line 90** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Tshepo Khumalo' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Tshepo Khumalo',`

- **Line 108** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#1d70b8] selection:text-white flex flex-col justify-between">`

- **Line 111** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<div className="bg-[#152e52] text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10">`

- **Line 114** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5 whitespace-nowrap">`

- **Line 122** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<div className="flex items-center gap-3 text-[11px]">`

- **Line 148** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/" className="text-[#152e52] font-semibold">`

- **Line 151** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 154** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 157** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/about" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 160** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/contact" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 171** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer flex items-center gap-1.5"`

- **Line 178** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/login" className="text-sm font-medium text-slate-700 hover:text-[#152e52]">`

- **Line 182** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `<button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">`

- **Line 203** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#152e52]">`

- **Line 223** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<button className="w-full bg-[#152e52] text-white py-2 rounded-md font-medium text-sm">{t('createAccount')}</button>`

- **Line 237** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#2e7d32]
  - *Snippet*: `<div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2.5">`

- **Line 238** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="text-[#2e7d32] font-medium text-sm italic">`

- **Line 243** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-bold text-[#152e52] tracking-tight leading-[1.1]">`

- **Line 253** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `<button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors shadow-xs cursor-pointer">`

- **Line 259** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<button className="border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 px-5 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer">`

- **Line 260** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Truck className="w-4 h-4 text-[#152e52]" />`

- **Line 281** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-bold text-[#152e52]">62.5%</span>`

- **Line 284** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="bg-[#1d70b8] h-full rounded-full" style={{ width: '62.5%' }} />`

- **Line 291** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-bold text-[#152e52]">82.0%</span>`

- **Line 294** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="bg-[#1d70b8] h-full rounded-full" style={{ width: '82.0%' }} />`

- **Line 300** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">`

- **Line 302** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Truck className="w-3.5 h-3.5 text-[#152e52]" />`

- **Line 305** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="flex items-center gap-1.5 font-medium text-[#2e7d32]">`

- **Line 306** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `<span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />`

- **Line 317** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<section id="notices" className="bg-[#152e52] text-white py-3.5 px-4 sm:px-8 shadow-xs">`

- **Line 336** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="text-xs font-semibold text-[#1d70b8] uppercase tracking-wider block">`

- **Line 339** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#152e52]">`

- **Line 350** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-serif text-3xl font-bold text-[#152e52] block">01</span>`

- **Line 351** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">{t('step1Title')}</h3>`

- **Line 358** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-serif text-3xl font-bold text-[#152e52] block">02</span>`

- **Line 359** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">{t('step2Title')}</h3>`

- **Line 366** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-serif text-3xl font-bold text-[#152e52] block">03</span>`

- **Line 367** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">{t('step3Title')}</h3>`

- **Line 374** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="font-serif text-3xl font-bold text-[#2e7d32] block">04</span>`

- **Line 375** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">{t('step4Title')}</h3>`

- **Line 385** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<section id="water-status" className="py-16 bg-[#f8fafc] border-b border-slate-200">`

- **Line 389** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="text-xs font-semibold text-[#1d70b8] uppercase tracking-wider block mb-1">`

- **Line 392** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#152e52]">`

- **Line 406** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">Galeshewe Zone 3</h3>`

- **Line 415** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">Roodepan Depot Area</h3>`

- **Line 424** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">Kimberley CBD</h3>`

- **Line 433** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">Newton Reservoir Facility</h3>`

- **Line 447** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="text-xs font-semibold text-[#1d70b8] uppercase tracking-wider block mb-1">`

- **Line 450** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#152e52]">`

- **Line 473** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<section className="py-16 bg-[#f8fafc] border-b border-slate-200">`

- **Line 480** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#152e52]">`

- **Line 490** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full sm:w-auto bg-[#152e52] hover:bg-[#0f223d] text-white px-6 py-3 rounded-md font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"`

- **Line 497** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<button className="w-full border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 px-6 py-3 rounded-md font-medium text-sm transition-colors cursor-pointer">`

### File: `frontend/src/pages/Login.jsx` (18 findings)

- **Line 69** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#1d70b8] selection:text-white flex flex-col">`

- **Line 78** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 81** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 84** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 87** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/about" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 90** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/contact" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 97** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/login" className="text-sm font-medium text-[#152e52]">`

- **Line 101** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `<button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">`

- **Line 114** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-3xl font-bold text-[#152e52]">AquaBophelo</h1>`

- **Line 115** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#2e7d32]
  - *Snippet*: `<div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2">`

- **Line 116** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="text-[#2e7d32] font-medium text-xs italic">`

- **Line 145** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 160** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 175** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="text-xs font-medium text-[#1d70b8] hover:underline inline-flex items-center gap-1 cursor-pointer"`

- **Line 177** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<KeyRound className="w-3.5 h-3.5 text-[#1d70b8]" />`

- **Line 186** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"`

- **Line 196** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Link to="/register" className="text-[#1d70b8] hover:underline font-medium">`

- **Line 202** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />`

### File: `frontend/src/pages/PrivacyPage.jsx` (16 findings)

- **Line 13** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-[#1d70b8] selection:text-white">`

- **Line 23** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/login" className="text-sm font-medium text-[#152e52]">`

- **Line 34** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32], bg-[#f2f9f3], border-[#2e7d32]
  - *Snippet*: `<div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2e7d32] bg-[#f2f9f3] px-3 py-1 rounded-md border border-[#2e7d32]/30">`

- **Line 35** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<ShieldCheck className="w-4 h-4 text-[#2e7d32]" />`

- **Line 38** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152e52]">`

- **Line 48** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-3">`

- **Line 49** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">`

- **Line 50** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Eye className="w-5 h-5 text-[#152e52]" />`

- **Line 58** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-3">`

- **Line 59** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">`

- **Line 60** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<MapPin className="w-5 h-5 text-[#152e52]" />`

- **Line 68** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-3">`

- **Line 69** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">`

- **Line 70** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Database className="w-5 h-5 text-[#152e52]" />`

- **Line 79** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-base font-bold text-[#152e52] flex items-center gap-2">`

- **Line 80** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<FileText className="w-4 h-4 text-[#152e52]" />`

### File: `frontend/src/pages/ProfilePage.jsx` (91 findings)

- **Line 196** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 204** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32], bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `<div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2e7d32] bg-[#f2f9f3] px-3 py-1.5 rounded-md border border-[#b8e3bd]">`

- **Line 205** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<ShieldCheck className="w-4 h-4 text-[#2e7d32]" />`

- **Line 211** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Item 1.8)' present in UI heading/label
  - *Snippet*: `{/* User Badge Summary Card with Photo Upload (Item 1.8) */}`

- **Line 218** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52]
  - *Snippet*: `className="w-20 h-20 rounded-full object-cover border-2 border-[#152e52] shadow-xs"`

- **Line 221** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<div className="w-20 h-20 rounded-full bg-[#152e52] text-white flex items-center justify-center font-serif font-bold text-3xl shadow-xs">`

- **Line 228** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-300 rounded-full text-slate-700 hover:text-[#152e52] shadow-xs cursor-pointer"`

- **Line 242** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-lg text-[#152e52]">{fullName}</h3>`

- **Line 248** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-semibold text-[#152e52]">{area}</span>`

- **Line 252** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="font-semibold text-[#1d70b8]">CAT (UTC+2)</span>`

- **Line 256** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="font-semibold text-[#2e7d32]">Verified</span>`

- **Line 265** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-5 space-y-4">`

- **Line 266** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] flex items-center space-x-2 border-b border-slate-200 pb-2">`

- **Line 267** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Truck className="w-4 h-4 text-[#2e7d32]" />`

- **Line 268** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 2.6)' present in UI heading/label
  - *Snippet*: `<span>Driver Employment &amp; Performance Summary (Section 2.6)</span>`

- **Line 274** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-mono font-bold text-[#152e52] text-sm">{driverId}</span>`

- **Line 278** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="font-semibold text-[#2e7d32]">{licenseStatus}</span>`

- **Line 282** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="font-mono font-bold text-[#1d70b8] text-sm">{assignedVehicle}</span>`

- **Line 294** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-slate-500 block text-[11px]">Completed Trips:</span>`

- **Line 295** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="text-base font-bold text-[#152e52]">14 Completed</span>`

- **Line 297** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-5 h-5 text-[#2e7d32]" />`

- **Line 301** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-slate-500 block text-[11px]">Total Litres Delivered:</span>`

- **Line 302** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="text-base font-bold text-[#1d70b8]">145,000 L</span>`

- **Line 304** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Truck className="w-5 h-5 text-[#1d70b8]" />`

- **Line 310** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(SECTION 3.8)' present in UI heading/label
  - *Snippet*: `{/* ADMIN SPECIFIC SECURITY & SESSIONS PANEL (SECTION 3.8) */}`

- **Line 313** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] flex items-center space-x-2 border-b border-slate-200 pb-2">`

- **Line 314** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Lock className="w-4 h-4 text-[#1d70b8]" />`

- **Line 315** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 3.8)' present in UI heading/label
  - *Snippet*: `<span>Admin Security, 2FA &amp; Active Sessions (Section 3.8)</span>`

- **Line 320** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-3 rounded-md border border-slate-200">`

- **Line 321** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-slate-500 block text-[11px]">3.8.1 Last Login:</span>`

- **Line 322** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-semibold text-[#152e52] flex items-center gap-1 mt-0.5">`

- **Line 328** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-3 rounded-md border border-slate-200">`

- **Line 329** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-slate-500 block text-[11px]">3.8.2 Account Created:</span>`

- **Line 333** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-3 rounded-md border border-slate-200">`

- **Line 334** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-slate-500 block text-[11px]">Admin Access Tier:</span>`

- **Line 335** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="font-bold text-[#2e7d32] mt-0.5 block">Super Admin (Level 1)</span>`

- **Line 340** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-md flex items-center justify-between">`

- **Line 342** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52] text-xs flex items-center gap-1.5">`

- **Line 343** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Key className="w-4 h-4 text-[#2e7d32]" />`

- **Line 346** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-slate-500 text-[11px] mt-0.5">Require an authenticator code or SMS OTP on every admin login.</p>`

- **Line 353** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `twoFactorEnabled ? 'bg-[#2e7d32] text-white' : 'bg-slate-200 text-slate-700'`

- **Line 361** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#fcfdfe]
  - *Snippet*: `<div className="border border-slate-200 rounded-md p-4 space-y-3 bg-[#fcfdfe]">`

- **Line 362** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-xs text-[#152e52] uppercase tracking-wider">`

- **Line 372** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<div className="p-2.5 bg-green-50 border border-green-200 text-[#2e7d32] rounded-md text-xs font-medium">`

- **Line 386** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full border border-slate-300 rounded-md px-3 py-1.5 pr-9 text-xs focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 407** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full border border-slate-300 rounded-md px-3 py-1.5 pr-9 text-xs focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 427** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full border border-slate-300 rounded-md px-3 py-1.5 pr-9 text-xs focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 443** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white font-semibold rounded-md text-xs transition-colors cursor-pointer"`

- **Line 452** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-xs text-[#152e52] uppercase tracking-wider">`

- **Line 456** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="p-3 bg-[#f8fafc] border border-slate-200 rounded-md flex items-center justify-between">`

- **Line 458** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52]">Chrome on Windows 11 (Current Session)</p>`

- **Line 459** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 font-mono">IP: 197.229.41.10 · Sol Plaatje Municipal Network</p>`

- **Line 461** | [Category 1: Raw code or enum values shown to users]
  - *Finding*: Raw enum constant 'ACTIVE' rendered directly in UI
  - *Snippet*: `<span className="text-[11px] font-bold text-[#2e7d32] bg-[#f2f9f3] px-2 py-0.5 rounded border border-[#b8e3bd]">ACTIVE</span>`

- **Line 461** | [Category 7: All-caps badges and labels that could be sentence case]
  - *Finding*: ALL-CAPS label or badge text 'ACTIVE' used
  - *Snippet*: `<span className="text-[11px] font-bold text-[#2e7d32] bg-[#f2f9f3] px-2 py-0.5 rounded border border-[#b8e3bd]">ACTIVE</span>`

- **Line 461** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px], text-[#2e7d32], bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `<span className="text-[11px] font-bold text-[#2e7d32] bg-[#f2f9f3] px-2 py-0.5 rounded border border-[#b8e3bd]">ACTIVE</span>`

- **Line 463** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="p-3 bg-[#f8fafc] border border-slate-200 rounded-md flex items-center justify-between">`

- **Line 466** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 font-mono">IP: 197.229.41.18 · Last active 2 hours ago</p>`

- **Line 468** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<button className="text-[11px] text-red-600 hover:underline cursor-pointer font-medium">Revoke</button>`

- **Line 475** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-xs text-[#152e52] uppercase tracking-wider">`

- **Line 480** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc], text-[10px]
  - *Snippet*: `<thead className="bg-[#f8fafc] text-slate-600 text-[10px] uppercase font-semibold border-b">`

- **Line 488** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<tbody className="divide-y divide-slate-200 text-[11px]">`

- **Line 490** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<td className="py-2 px-3 font-semibold text-[#152e52]">Admin Login (Password + OTP)</td>`

- **Line 493** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<td className="py-2 px-3 text-[#2e7d32] font-bold">Success</td>`

- **Line 496** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<td className="py-2 px-3 font-semibold text-[#152e52]">2FA Settings Updated</td>`

- **Line 499** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<td className="py-2 px-3 text-[#2e7d32] font-bold">Success</td>`

- **Line 510** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] flex items-center space-x-2 border-b border-slate-200 pb-2">`

- **Line 511** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<ShieldCheck className="w-4 h-4 text-[#2e7d32]" />`

- **Line 512** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Item 1.7)' present in UI heading/label
  - *Snippet*: `<span>Privacy &amp; Notification Settings (Item 1.7)</span>`

- **Line 516** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<div className="p-3 bg-green-50 border border-green-200 rounded-md text-xs text-[#2e7d32] flex items-center space-x-2 font-medium">`

- **Line 523** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="flex items-center justify-between p-3 bg-[#f8fafc] border border-slate-200 rounded-md">`

- **Line 525** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52]">Opt-In Email Water Alerts</p>`

- **Line 532** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `optInEmailAlerts ? 'bg-[#2e7d32] text-white' : 'bg-slate-200 text-slate-700'`

- **Line 539** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="flex items-center justify-between p-3 bg-[#f8fafc] border border-slate-200 rounded-md">`

- **Line 541** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52]">SMS / Emergency Mobile Broadcasts</p>`

- **Line 548** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `optInSmsAlerts ? 'bg-[#2e7d32] text-white' : 'bg-slate-200 text-slate-700'`

- **Line 555** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="flex items-center justify-between p-3 bg-[#f8fafc] border border-slate-200 rounded-md">`

- **Line 557** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52]">Suburb Location Sharing for Mobile Tankers</p>`

- **Line 564** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `shareLocationForTankers ? 'bg-[#2e7d32] text-white' : 'bg-slate-200 text-slate-700'`

- **Line 575** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] mb-4 flex items-center space-x-2">`

- **Line 576** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<User className="w-4 h-4 text-[#1d70b8]" />`

- **Line 581** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-xs text-[#2e7d32] flex items-center space-x-2 font-medium">`

- **Line 595** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 607** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 622** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 631** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs rounded-md transition-colors cursor-pointer disabled:opacity-50"`

- **Line 643** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Item 1.5)' present in UI heading/label
  - *Snippet*: `<span>Delete Own Account (Item 1.5)</span>`

- **Line 673** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">Delete Account Confirmation</h3>`

- **Line 710** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f4f8fb], border-[#bcd6ea]
  - *Snippet*: `<div className="p-4 bg-[#f4f8fb] border border-[#bcd6ea] rounded-md text-center space-y-2">`

- **Line 711** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Mail className="w-6 h-6 text-[#1d70b8] mx-auto" />`

- **Line 712** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-bold text-sm text-[#152e52]">Enter Email OTP Code</h4>`

- **Line 721** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32], bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `className="text-xs font-mono text-[#2e7d32] bg-[#f2f9f3] px-3 py-1 rounded-md border border-[#b8e3bd] font-bold cursor-pointer"`

### File: `frontend/src/pages/Register.jsx` (33 findings)

- **Line 131** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#1d70b8] selection:text-white flex flex-col">`

- **Line 140** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 143** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 146** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<a href="/#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 149** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/about" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 152** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/contact" className="text-slate-600 hover:text-[#152e52] transition-colors">`

- **Line 159** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/login" className="text-sm font-medium text-[#152e52]">`

- **Line 163** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `<button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">`

- **Line 176** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-3xl font-bold text-[#152e52]">{t('registerTitle')}</h1>`

- **Line 177** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#2e7d32]
  - *Snippet*: `<div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2">`

- **Line 178** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="text-[#2e7d32] font-medium text-xs italic">`

- **Line 190** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f4f8fb], border-[#bcd6ea]
  - *Snippet*: `<div className="p-4 bg-[#f4f8fb] border border-[#bcd6ea] rounded-md text-center space-y-2">`

- **Line 191** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<KeyRound className="w-7 h-7 text-[#1d70b8] mx-auto" />`

- **Line 192** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">{t('verifyEmail')}</h3>`

- **Line 194** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `A 6-digit verification code has been dispatched to <strong className="text-[#152e52]">{email}</strong>.`

- **Line 201** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32], bg-[#f2f9f3], bg-[#e2f3e4], border-[#b8e3bd]
  - *Snippet*: `className="text-xs font-mono text-[#2e7d32] bg-[#f2f9f3] hover:bg-[#e2f3e4] px-3 py-1 rounded-md border border-[#b8e3bd] font-bold cursor-pointer transition-colors"`

- **Line 211** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `: 'bg-blue-50 text-[#1d70b8] border-blue-200'`

- **Line 238** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 245** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"`

- **Line 254** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="text-slate-500 hover:text-[#152e52] transition-colors cursor-pointer"`

- **Line 262** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="text-[#1d70b8] hover:underline inline-flex items-center gap-1 cursor-pointer"`

- **Line 289** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 303** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 317** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 319** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 mt-1">`

- **Line 332** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 352** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 376** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 390** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `doPasswordsMatch ? 'text-[#2e7d32]' : 'text-red-600'`

- **Line 395** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />`

- **Line 410** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer mt-2"`

- **Line 421** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Link to="/login" className="text-[#1d70b8] hover:underline font-medium">`

- **Line 427** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />`

### File: `frontend/src/pages/ResetPasswordPage.jsx` (14 findings)

- **Line 65** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#1d70b8] selection:text-white flex flex-col">`

- **Line 75** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Link to="/login" className="text-sm font-medium text-[#152e52]">`

- **Line 87** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-3xl font-bold text-[#152e52]">Set New Password</h1>`

- **Line 88** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#2e7d32]
  - *Snippet*: `<div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2">`

- **Line 89** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="text-[#2e7d32] font-medium text-xs italic">`

- **Line 99** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `<div className="p-6 bg-[#f2f9f3] border border-[#b8e3bd] rounded-lg text-center space-y-3">`

- **Line 100** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-12 h-12 text-[#2e7d32] mx-auto" />`

- **Line 101** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-lg text-[#152e52]">Password Reset Successful!</h3>`

- **Line 125** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 139** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 153** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 167** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"`

- **Line 174** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"`

- **Line 180** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-[#1d70b8] hover:underline font-medium">`

### File: `frontend/src/pages/admin/AdminOverview.jsx` (48 findings)

- **Line 118** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Sipho Dlamini' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Sipho Dlamini',`

- **Line 129** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Lerato Motsepe' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Lerato Motsepe',`

- **Line 140** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Tshepo Khumalo' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Tshepo Khumalo',`

- **Line 283** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `accentColor="#1d70b8"`

- **Line 290** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #2e7d32
  - *Snippet*: `accentColor="#2e7d32"`

- **Line 297** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `accentColor="#1d70b8"`

- **Line 304** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #d97706
  - *Snippet*: `accentColor="#d97706"`

- **Line 312** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<MapPin className="w-5 h-5 text-[#152e52] shrink-0" />`

- **Line 314** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">`

- **Line 333** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-[#152e52] rounded-md font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"`

- **Line 336** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<ArrowUpRight className="w-3.5 h-3.5 text-[#1d70b8]" />`

- **Line 349** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-sm text-[#152e52] flex items-center space-x-2">`

- **Line 350** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Droplet className="w-4 h-4 text-[#1d70b8] fill-current" />`

- **Line 355** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center space-x-1 cursor-pointer"`

- **Line 366** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div key={dam.id} className="bg-[#f8fafc] border border-slate-200 rounded-md p-3.5 space-y-2">`

- **Line 369** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-xs md:text-sm text-[#152e52]">{dam.name}</h4>`

- **Line 370** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 font-normal">Capacity: {dam.capacityMegaLitres} ML</p>`

- **Line 378** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `level < 30 ? 'bg-red-600' : level < 60 ? 'bg-amber-500' : 'bg-[#2e7d32]'`

- **Line 392** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-sm text-[#152e52] flex items-center space-x-2">`

- **Line 393** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Truck className="w-4 h-4 text-[#2e7d32]" />`

- **Line 398** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center space-x-1 cursor-pointer"`

- **Line 409** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-center justify-between"`

- **Line 412** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-mono text-xs font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">`

- **Line 416** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-xs font-semibold text-[#152e52]">{truck.route || 'Kimberley Route'}</p>`

- **Line 417** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 font-normal">`

- **Line 426** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px], text-[#2e7d32]
  - *Snippet*: `<p className="text-[10px] text-[#2e7d32] mt-1 font-mono font-medium">`

- **Line 443** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] flex items-center space-x-2">`

- **Line 444** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<FileText className="w-5 h-5 text-[#1d70b8]" />`

- **Line 445** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 3.4.1)' present in UI heading/label
  - *Snippet*: `<span>Resident Water Fault Reports (Section 3.4.1)</span>`

- **Line 451** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], text-[#152e52], border-[#bcd6ea]
  - *Snippet*: `<span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#eaf4fb] text-[#152e52] border border-[#bcd6ea]">`

- **Line 457** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `<div className="p-3 bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] rounded-md text-xs font-medium flex items-center gap-2">`

- **Line 465** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc], text-[11px]
  - *Snippet*: `<thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">`

- **Line 477** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<td className="py-3 px-3 font-mono font-bold text-[#152e52] text-xs">`

- **Line 481** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52]">{issue.issueType}</p>`

- **Line 482** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500">{issue.fullName} ({issue.userEmail})</p>`

- **Line 486** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500">{issue.streetAddress}</p>`

- **Line 489** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${`

- **Line 490** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `issue.status === 'Resolved' ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :`

- **Line 491** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], text-[#1d70b8], border-[#bcd6ea]
  - *Snippet*: `issue.status === 'In Progress' ? 'bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea]' :`

- **Line 500** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-3 py-1.5 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-semibold shadow-xs cursor-pointer"`

- **Line 515** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] flex items-center space-x-2">`

- **Line 526** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div key={inc.id} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-md space-y-1">`

- **Line 531** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-[11px] text-slate-500">{inc.reportedAt}</span>`

- **Line 534** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500">Reported by: <strong>{inc.reportedBy}</strong></p>`

- **Line 545** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52] mb-1">`

- **Line 560** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

- **Line 578** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

- **Line 595** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-5 py-2 text-xs font-semibold bg-[#152e52] hover:bg-[#0f223d] text-white rounded-md shadow-xs cursor-pointer"`

### File: `frontend/src/pages/admin/AdminReportsPage.jsx` (33 findings)

- **Line 120** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1e293b
  - *Snippet*: `body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; margin: 40px; }`

- **Line 121** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `.header { border-bottom: 3px solid #152e52; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }`

- **Line 122** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `.title { font-size: 22px; font-weight: bold; color: #152e52; margin: 0; }`

- **Line 123** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #64748b
  - *Snippet*: `.subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }`

- **Line 124** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #2e7d32
  - *Snippet*: `.tag { background: #2e7d32; color: white; padding: 4px 8px; font-size: 11px; border-radius: 4px; font-weight: bold; }`

- **Line 126** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #e2e8f0, #f8fafc
  - *Snippet*: `.kpi-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; background: #f8fafc; }`

- **Line 127** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #64748b
  - *Snippet*: `.kpi-title { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }`

- **Line 128** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `.kpi-value { font-size: 20px; font-weight: bold; color: #152e52; margin-top: 5px; }`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #475569
  - *Snippet*: `.kpi-sub { font-size: 11px; color: #475569; margin-top: 2px; }`

- **Line 131** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `th { background: #152e52; color: white; text-align: left; padding: 8px 12px; font-size: 11px; }`

- **Line 132** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #e2e8f0
  - *Snippet*: `td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }`

- **Line 133** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #cbd5e1, #64748b
  - *Snippet*: `.footer { margin-top: 40px; border-top: 1px solid #cbd5e1; pt: 15px; font-size: 10px; color: #64748b; text-align: center; }`

- **Line 168** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `<h3 style="color:#152e52; font-size:14px; margin-bottom:10px;">Area Distribution Summary</h3>`

- **Line 188** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #152e52
  - *Snippet*: `<h3 style="color:#152e52; font-size:14px; margin-bottom:10px;">Reservoir &amp; Storage Audit Summary</h3>`

- **Line 230** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 241** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="p-2 rounded-md bg-white border border-slate-300 text-slate-600 hover:text-[#152e52] hover:bg-slate-50 transition-colors cursor-pointer"`

- **Line 249** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="px-3.5 py-2 bg-white border border-slate-300 text-[#152e52] hover:bg-slate-50 font-medium rounded-md text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"`

- **Line 251** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Download className="w-3.5 h-3.5 text-[#152e52]" />`

- **Line 257** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-3.5 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white font-medium rounded-md text-xs flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"`

- **Line 272** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `accentColor="#1d70b8"`

- **Line 279** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #2e7d32
  - *Snippet*: `accentColor="#2e7d32"`

- **Line 286** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `accentColor="#1d70b8"`

- **Line 293** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #2e7d32
  - *Snippet*: `accentColor="#2e7d32"`

- **Line 300** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] mb-4 flex items-center space-x-2">`

- **Line 301** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<MapPin className="w-4 h-4 text-[#1d70b8]" />`

- **Line 309** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `className="p-3.5 bg-[#f8fafc] border border-slate-200 rounded-md flex items-center justify-between"`

- **Line 312** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-serif font-bold text-sm text-[#152e52]">{area.areaName}</p>`

- **Line 320** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]'`

- **Line 334** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52] mb-4 flex items-center space-x-2">`

- **Line 335** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Droplet className="w-4 h-4 text-[#2e7d32] fill-current" />`

- **Line 343** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `className="p-3.5 bg-[#f8fafc] border border-slate-200 rounded-md flex items-center justify-between"`

- **Line 346** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-serif font-bold text-sm text-[#152e52]">{dam.damName}</p>`

- **Line 351** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<p className="font-serif font-bold text-base text-[#2e7d32]">{dam.latestLevelPercent}%</p>`

### File: `frontend/src/pages/admin/BroadcastAlertPage.jsx` (19 findings)

- **Line 113** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 126** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'`

- **Line 138** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-base font-bold text-[#152e52] mb-1 flex items-center space-x-2">`

- **Line 139** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Radio className="w-4 h-4 text-[#1d70b8]" />`

- **Line 155** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 167** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 182** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 202** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md p-3 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] resize-none"`

- **Line 206** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-center justify-between">`

- **Line 208** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<label className="flex items-center space-x-1.5 text-xs text-[#152e52] font-semibold">`

- **Line 209** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Mail className="w-4 h-4 text-[#1d70b8]" />`

- **Line 229** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-base font-bold text-[#152e52] flex items-center space-x-2">`

- **Line 230** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<History className="w-4 h-4 text-[#1d70b8]" />`

- **Line 240** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `className="bg-[#f8fafc] border border-slate-200 rounded-md p-4 shadow-xs"`

- **Line 243** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-xs md:text-sm text-[#152e52]">{alert.title}</h4>`

- **Line 245** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `className={`text-[10px] font-medium px-2 py-0.5 rounded ${`

- **Line 250** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], text-[#1d70b8], border-[#bcd6ea]
  - *Snippet*: `: 'bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea]'`

- **Line 259** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 font-normal">`

- **Line 260** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="text-[#1d70b8] font-medium">{alert.areaName || 'All Kimberley'}</span>`

### File: `frontend/src/pages/admin/ManageDams.jsx` (26 findings)

- **Line 186** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">`

- **Line 190** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 200** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"`

- **Line 212** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'`

- **Line 237** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px], text-[#152e52]
  - *Snippet*: `<span className="text-[10px] font-mono font-bold uppercase text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">`

- **Line 240** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52] mt-1.5">{dam.name}</h3>`

- **Line 250** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-serif font-bold text-[#152e52]">{level.toFixed(1)}%</span>`

- **Line 255** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `level < 30 ? 'bg-red-600' : level < 60 ? 'bg-amber-500' : 'bg-[#2e7d32]'`

- **Line 264** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-2.5 rounded-md border border-slate-200">`

- **Line 266** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-sm font-serif font-bold text-[#152e52] mt-0.5">`

- **Line 270** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-2.5 rounded-md border border-slate-200">`

- **Line 272** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-sm font-serif font-bold text-[#152e52] mt-0.5">`

- **Line 278** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-3 font-normal">`

- **Line 288** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 font-medium text-xs md:text-sm transition-colors cursor-pointer"`

- **Line 290** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Plus className="w-4 h-4 text-[#152e52]" />`

- **Line 304** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">`

- **Line 312** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `Enter official certified water gauge measurement for <strong className="text-[#152e52]">{selectedDam.name}</strong>.`

- **Line 329** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 343** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 361** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"`

- **Line 376** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">`

- **Line 398** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 413** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 429** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 443** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 458** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"`

### File: `frontend/src/pages/admin/ManageRoutes.jsx` (20 findings)

- **Line 155** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">`

- **Line 159** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 169** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"`

- **Line 181** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'`

- **Line 203** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Layers className="w-5 h-5 text-[#152e52] shrink-0" />`

- **Line 205** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-base font-bold text-[#152e52]">{route.name}</h3>`

- **Line 207** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="text-[#1d70b8] font-medium">{route.areaName}</span>`

- **Line 214** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd] self-start sm:self-auto">`

- **Line 228** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-start space-x-3"`

- **Line 230** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<div className="w-6 h-6 rounded-full bg-[#152e52] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">`

- **Line 234** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-xs font-semibold text-[#152e52] truncate">{stop.name}</p>`

- **Line 235** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 mt-0.5 font-mono font-normal">`

- **Line 252** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">`

- **Line 274** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 285** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 303** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="inline-flex items-center space-x-1 text-xs text-[#1d70b8] hover:underline font-medium cursor-pointer"`

- **Line 314** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-center space-x-2"`

- **Line 316** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], text-[10px]
  - *Snippet*: `<span className="w-5 h-5 rounded-full bg-[#152e52] text-white text-[10px] font-bold flex items-center justify-center shrink-0">`

- **Line 325** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 367** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"`

### File: `frontend/src/pages/admin/ManageTrucks.jsx` (24 findings)

- **Line 14** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Sipho Dlamini' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Sipho Dlamini',`

- **Line 25** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Lerato Motsepe' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Lerato Motsepe',`

- **Line 36** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Tshepo Khumalo' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Tshepo Khumalo',`

- **Line 182** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">`

- **Line 186** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 196** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"`

- **Line 208** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'`

- **Line 230** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 235** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span>Total Fleet: <strong className="text-[#152e52] font-semibold">{trucks.length}</strong></span>`

- **Line 237** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span>Active: <strong className="text-[#2e7d32] font-semibold">{trucks.filter((t) => t.status === 'OnTrip').length}</strong></span>`

- **Line 239** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span>Available: <strong className="text-[#1d70b8] font-semibold">{trucks.filter((t) => t.status === 'Available').length}</strong></span>`

- **Line 247** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc], text-[11px]
  - *Snippet*: `<thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">`

- **Line 260** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<td className="py-3 px-4 font-mono font-bold text-[#152e52]">`

- **Line 272** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `<span className="w-2 h-2 rounded-full bg-[#2e7d32]"></span>`

- **Line 285** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"`

- **Line 287** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<UserCheck className="w-3.5 h-3.5 text-[#152e52]" />`

- **Line 303** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">`

- **Line 325** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm uppercase font-mono text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 336** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 355** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"`

- **Line 370** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">`

- **Line 378** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `Allocate a certified driver to operate tanker <strong className="text-[#152e52] font-mono">{selectedTruck.registrationNumber}</strong>.`

- **Line 389** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 410** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"`

### File: `frontend/src/pages/admin/ManageUsers.jsx` (56 findings)

- **Line 33** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Sipho Dlamini' used in UI instead of dynamic state
  - *Snippet*: `fullName: 'Sipho Dlamini',`

- **Line 44** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Lerato Motsepe' used in UI instead of dynamic state
  - *Snippet*: `fullName: 'Lerato Motsepe',`

- **Line 58** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `role: 'Resident',`

- **Line 164** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">`

- **Line 165** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Users className="w-3.5 h-3.5 text-[#1d70b8]" />`

- **Line 168** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 179** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"`

- **Line 193** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52], text-[#152e52]
  - *Snippet*: `? 'border-[#152e52] text-[#152e52]'`

- **Line 205** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52], text-[#152e52]
  - *Snippet*: `? 'border-[#152e52] text-[#152e52]'`

- **Line 217** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52], text-[#152e52]
  - *Snippet*: `? 'border-[#152e52] text-[#152e52]'`

- **Line 228** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `<div className="p-3.5 rounded-md bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] flex items-center space-x-3 text-xs md:text-sm font-medium">`

- **Line 246** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 251** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `{['All', 'Admin', 'Driver', 'Resident'].map((role) => (`

- **Line 257** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `? 'bg-[#152e52] text-white font-semibold shadow-xs'`

- **Line 271** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc], text-[11px]
  - *Snippet*: `<thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">`

- **Line 286** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `<div className="w-8 h-8 rounded-full bg-[#152e52] text-white font-bold text-xs flex items-center justify-center">`

- **Line 290** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-serif font-bold text-[#152e52]">{user.fullName}</p>`

- **Line 297** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md ${`

- **Line 301** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]'`

- **Line 309** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<td className="py-3 px-4 text-xs font-semibold text-[#152e52]">{user.assignedTruck}</td>`

- **Line 327** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-lg text-[#152e52] flex items-center gap-2">`

- **Line 328** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Settings className="w-5 h-5 text-[#1d70b8]" />`

- **Line 337** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `<div className="p-3.5 bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] rounded-md text-xs font-medium flex items-center gap-2">`

- **Line 345** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-5 space-y-4">`

- **Line 346** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-sm text-[#152e52] flex items-center gap-2">`

- **Line 347** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Bell className="w-4 h-4 text-[#2e7d32]" />`

- **Line 354** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52]">SendGrid Email Dispatch Service</p>`

- **Line 355** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-slate-500 text-[11px]">Primary email delivery gateway for OTPs and water alerts.</p>`

- **Line 361** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `emailNotificationsEnabled ? 'bg-[#2e7d32] text-white' : 'bg-slate-200 text-slate-700'`

- **Line 364** | [Category 1: Raw code or enum values shown to users]
  - *Finding*: Raw enum constant 'ACTIVE' rendered directly in UI
  - *Snippet*: `{emailNotificationsEnabled ? 'ACTIVE' : 'INACTIVE'}`

- **Line 364** | [Category 1: Raw code or enum values shown to users]
  - *Finding*: Raw enum constant 'INACTIVE' rendered directly in UI
  - *Snippet*: `{emailNotificationsEnabled ? 'ACTIVE' : 'INACTIVE'}`

- **Line 370** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="font-bold text-[#152e52]">Notification Dry-Run / Console Mode</p>`

- **Line 371** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-slate-500 text-[11px]">Bypass external SMTP and output email logs to server console.</p>`

- **Line 387** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-5 space-y-4">`

- **Line 388** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h4 className="font-serif font-bold text-sm text-[#152e52] flex items-center gap-2">`

- **Line 389** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Server className="w-4 h-4 text-[#1d70b8]" />`

- **Line 410** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-xs font-bold text-[#1d70b8]"`

- **Line 412** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 mt-1">Enforced system-wide (CAT / UTC+2) per requirement 0.4.</p>`

- **Line 424** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-5 py-2.5 bg-[#152e52] hover:bg-[#0f223d] text-white font-bold rounded-md text-xs transition-colors cursor-pointer shadow-xs"`

- **Line 437** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-lg text-[#152e52] flex items-center gap-2">`

- **Line 438** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Activity className="w-5 h-5 text-[#2e7d32]" />`

- **Line 445** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `<span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]">`

- **Line 452** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc], text-[11px]
  - *Snippet*: `<thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">`

- **Line 464** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<td className="py-3 px-4 font-bold text-[#152e52]">`

- **Line 477** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${`

- **Line 480** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]'`

- **Line 498** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">`

- **Line 518** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 530** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 542** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 554** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 558** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `<option value="Resident">Resident (Community Access)</option>`

- **Line 570** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] disabled:opacity-40"`

- **Line 586** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"`

- **Line 588** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 mt-1">Driver will use this password on first sign-in</p>`

- **Line 601** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"`

### File: `frontend/src/pages/driver/DriverActivityPage.jsx` (16 findings)

- **Line 91** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-2xl font-bold text-[#152e52] flex items-center gap-2">`

- **Line 92** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<History className="w-6 h-6 text-[#1d70b8]" />`

- **Line 106** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52], text-[#152e52]
  - *Snippet*: `? 'border-[#152e52] text-[#152e52]'`

- **Line 116** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52], text-[#152e52]
  - *Snippet*: `? 'border-[#152e52] text-[#152e52]'`

- **Line 126** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52], text-[#152e52]
  - *Snippet*: `? 'border-[#152e52] text-[#152e52]'`

- **Line 152** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Truck className="w-4 h-4 text-[#1d70b8]" />`

- **Line 153** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-base font-bold text-[#152e52]">{trip.routeName}</h3>`

- **Line 158** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">`

- **Line 164** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="font-semibold text-[#2e7d32]">`

- **Line 170** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `<span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd] shrink-0 self-start md:self-center flex items-center gap-1">`

- **Line 192** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<MapPin className="w-4 h-4 text-[#2e7d32]" />`

- **Line 193** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-base font-bold text-[#152e52]">{del.locationName}</h3>`

- **Line 196** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">`

- **Line 205** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], text-[#152e52], border-[#bcd6ea]
  - *Snippet*: `<span className="px-3 py-1 rounded-md text-xs font-bold bg-[#eaf4fb] text-[#152e52] border border-[#bcd6ea] block">`

- **Line 233** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500 pt-1">Reported: {prob.reportedAt}</p>`

- **Line 237** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `prob.status === 'Resolved' ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :`

### File: `frontend/src/pages/driver/DriverStopsScreen.jsx` (31 findings)

- **Line 46** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Sipho Dlamini' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Sipho Dlamini',`

- **Line 204** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#152e52]
  - *Snippet*: `<div className="animate-spin w-8 h-8 border-4 border-[#152e52] border-t-transparent rounded-full mx-auto mb-3"></div>`

- **Line 220** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="inline-flex items-center space-x-2 text-xs md:text-sm font-medium text-[#1d70b8] hover:underline cursor-pointer"`

- **Line 239** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] uppercase tracking-wider">`

- **Line 243** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], text-[#152e52], border-[#bcd6ea]
  - *Snippet*: `<span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#eaf4fb] text-[#152e52] border border-[#bcd6ea]">`

- **Line 248** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-xl md:text-2xl font-bold text-[#152e52] mt-1">`

- **Line 259** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32], bg-[#eaf4fb], border-[#bcd6ea], text-[#152e52]
  - *Snippet*: `feedback.type === 'success' ? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]' : 'bg-[#eaf4fb] border-[#bcd6ea] text-[#152e52]'`

- **Line 268** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="text-sm font-bold text-[#152e52] uppercase tracking-wider flex items-center gap-2">`

- **Line 269** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<MapPin className="w-4 h-4 text-[#1d70b8]" />`

- **Line 290** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `? 'border-[#1d70b8] ring-1 ring-[#1d70b8]'`

- **Line 300** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]'`

- **Line 302** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `? 'bg-[#152e52] text-white'`

- **Line 311** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-base font-bold text-[#152e52]">`

- **Line 314** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${`

- **Line 315** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `isCompleted ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :`

- **Line 329** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 flex-wrap">`

- **Line 338** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Clock className="w-3 h-3 text-[#1d70b8]" />`

- **Line 343** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="flex items-center gap-1 text-[#2e7d32]">`

- **Line 344** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />`

- **Line 364** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `<span className="inline-flex items-center space-x-1 px-3 py-2 rounded-md bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd] text-xs font-semibold">`

- **Line 372** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm shadow-xs flex items-center space-x-2 cursor-pointer"`

- **Line 381** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32], bg-[#256629]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#2e7d32] hover:bg-[#256629] text-white font-medium text-xs md:text-sm shadow-xs flex items-center space-x-2 cursor-pointer"`

- **Line 390** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8], bg-[#003078]
  - *Snippet*: `className="px-4 py-2 rounded-md bg-[#1d70b8] hover:bg-[#003078] text-white font-medium text-xs md:text-sm shadow-xs flex items-center space-x-2 cursor-pointer"`

- **Line 408** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52] mb-1">`

- **Line 426** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

- **Line 440** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

- **Line 453** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

- **Line 470** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32], bg-[#256629]
  - *Snippet*: `className="px-5 py-2 text-xs font-semibold bg-[#2e7d32] hover:bg-[#256629] text-white rounded-md shadow-xs cursor-pointer"`

- **Line 484** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52] mb-1 flex items-center gap-2">`

- **Line 500** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

- **Line 520** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

### File: `frontend/src/pages/driver/DriverTripScreen.jsx` (45 findings)

- **Line 255** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<Truck className="w-6 h-6 text-[#152e52] shrink-0" />`

- **Line 258** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-mono text-xs font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">`

- **Line 265** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-lg font-bold text-[#152e52] mt-0.5">`

- **Line 273** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-[11px] text-slate-500 mt-1 font-mono font-normal">`

- **Line 283** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="text-[#152e52] font-bold">`

- **Line 289** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `className="h-full bg-[#2e7d32] transition-all duration-500 rounded-full"`

- **Line 296** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 2.1.3)' present in UI heading/label
  - *Snippet*: `{/* Custom OpenStreetMap SVG Driving Navigation Map (Section 2.1.3) */}`

- **Line 299** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="text-xs font-bold text-[#152e52] uppercase tracking-wider flex items-center gap-1.5">`

- **Line 300** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Navigation className="w-4 h-4 text-[#1d70b8]" />`

- **Line 303** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px], text-[#2e7d32], bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `<span className="text-[11px] font-mono font-bold text-[#2e7d32] bg-[#f2f9f3] px-2 py-0.5 rounded border border-[#b8e3bd]">`

- **Line 313** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center justify-center text-[#1d70b8] mb-1">`

- **Line 316** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<p className="text-[10px] text-slate-500 font-medium uppercase">Speed</p>`

- **Line 317** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-lg font-bold text-[#152e52] font-mono mt-0.5">`

- **Line 323** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<div className="flex items-center justify-center text-[#2e7d32] mb-1">`

- **Line 326** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<p className="text-[10px] text-slate-500 font-medium uppercase">Heading</p>`

- **Line 327** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-lg font-bold text-[#152e52] font-mono mt-0.5">`

- **Line 336** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[10px]
  - *Snippet*: `<p className="text-[10px] text-slate-500 font-medium uppercase">GPS Beacon</p>`

- **Line 337** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-xs font-bold text-[#152e52] mt-1">`

- **Line 348** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'`

- **Line 359** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8]
  - *Snippet*: `<div className="bg-white border-2 border-[#1d70b8] rounded-lg p-6 shadow-xs space-y-4">`

- **Line 360** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center justify-between text-xs text-[#1d70b8] font-bold uppercase tracking-wider">`

- **Line 363** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 2.1.4)' present in UI heading/label
  - *Snippet*: `<span>Next Destination (Section 2.1.4)</span>`

- **Line 365** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], text-[11px]
  - *Snippet*: `<span className="bg-[#152e52] text-white px-2 py-0.5 rounded text-[11px]">`

- **Line 371** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-xl font-bold text-[#152e52]">`

- **Line 375** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Clock className="w-3.5 h-3.5 text-[#1d70b8]" />`

- **Line 381** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] p-4 rounded-md border border-slate-200 space-y-3">`

- **Line 383** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 2.1.7)' present in UI heading/label
  - *Snippet*: `Per-Stop Execution Step (Section 2.1.7)`

- **Line 392** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], border-[#152e52]
  - *Snippet*: `? 'bg-[#152e52] text-white border-[#152e52]'`

- **Line 404** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8], border-[#1d70b8]
  - *Snippet*: `? 'bg-[#1d70b8] text-white border-[#1d70b8]'`

- **Line 414** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32], border-[#2e7d32], bg-[#256629]
  - *Snippet*: `className="py-2 px-2 text-xs font-bold rounded-md border text-center cursor-pointer bg-[#2e7d32] text-white border-[#2e7d32] hover:bg-[#256629]"`

- **Line 422** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd]
  - *Snippet*: `<div className="bg-[#f2f9f3] border border-[#b8e3bd] rounded-lg p-6 text-center space-y-2">`

- **Line 423** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<CheckCircle2 className="w-12 h-12 text-[#2e7d32] mx-auto" />`

- **Line 424** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">All Scheduled Stops Completed!</h3>`

- **Line 432** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">Vehicle Currently at Depot</h3>`

- **Line 440** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white font-bold text-base rounded-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"`

- **Line 457** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 2.2)' present in UI heading/label
  - *Snippet*: `<span>Report Problem (Section 2.2)</span>`

- **Line 476** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="text-xs text-slate-500 hover:text-[#1d70b8] font-medium underline cursor-pointer"`

- **Line 478** | [Category 5: Emoji used as icons, or icons from mixed sets / inconsistent sizes]
  - *Finding*: Emoji character(s) '🚗' used as UI icon
  - *Snippet*: `{isSimulating ? '🚗 Simulated Kimberley Driving Active (Click to Stop)' : '🧪 Click to Simulate Live Driving for Demo'}`

- **Line 493** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<div className="flex items-center space-x-3 text-[#2e7d32]">`

- **Line 496** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">Record Delivery Completion</h3>`

- **Line 545** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32], bg-[#256629]
  - *Snippet*: `className="px-4 py-2 bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold rounded-md"`

- **Line 569** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">Report Driver Problem</h3>`

- **Line 576** | [Category 2: Internal notes or spec references in the UI]
  - *Finding*: Internal specification reference '(Section 2.2.2)' present in UI heading/label
  - *Snippet*: `<label className="block text-xs font-medium text-slate-700 mb-1">Problem Category (Section 2.2.2)</label>`

- **Line 613** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-bold rounded-md disabled:opacity-50"`

- **Line 631** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52]">End Delivery Trip?</h3>`

### File: `frontend/src/pages/driver/DriverVehiclePage.jsx` (22 findings)

- **Line 106** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-2xl font-bold text-[#152e52] flex items-center gap-2">`

- **Line 107** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Truck className="w-6 h-6 text-[#1d70b8]" />`

- **Line 128** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `feedback.type === 'success' ? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]' :`

- **Line 130** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], border-[#bcd6ea], text-[#152e52]
  - *Snippet*: `'bg-[#eaf4fb] border-[#bcd6ea] text-[#152e52]'`

- **Line 141** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="text-2xl font-black font-mono text-[#152e52] tracking-wider px-3 py-1 bg-slate-100 rounded-md border border-slate-300">`

- **Line 145** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], text-[#2e7d32], border-[#b8e3bd]
  - *Snippet*: `vehicle.status === 'Available' ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :`

- **Line 146** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#eaf4fb], text-[#1d70b8], border-[#bcd6ea]
  - *Snippet*: `vehicle.status === 'OnTrip' ? 'bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea]' :`

- **Line 166** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<strong className="text-[#2e7d32]">Correct (`542-KM NC`)</strong>`

- **Line 178** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f8fafc]
  - *Snippet*: `<div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-4 flex flex-col justify-center space-y-2 text-center">`

- **Line 179** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<ShieldCheck className="w-8 h-8 text-[#2e7d32] mx-auto" />`

- **Line 180** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="text-xs font-bold text-[#152e52] uppercase tracking-wider">Safety Certified</h3>`

- **Line 181** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<p className="text-[11px] text-slate-500">`

- **Line 189** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">`

- **Line 190** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<ClipboardCheck className="w-5 h-5 text-[#1d70b8]" />`

- **Line 209** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"`

- **Line 223** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"`

- **Line 237** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"`

- **Line 251** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `className="w-5 h-5 text-[#1d70b8] rounded focus:ring-[#1d70b8]"`

- **Line 265** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

- **Line 273** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="w-full py-3 bg-[#152e52] hover:bg-[#0f223d] text-white text-xs md:text-sm font-bold rounded-md shadow-xs cursor-pointer transition-colors"`

- **Line 284** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif text-lg font-bold text-[#152e52] mb-1 flex items-center gap-2">`

- **Line 303** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"`

### File: `frontend/src/pages/resident/AlertsPage.jsx` (7 findings)

- **Line 56** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 66** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="px-4 py-2.5 bg-[#152e52] hover:bg-[#0f223d] text-white font-medium rounded-md text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"`

- **Line 80** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `accentColor="#1d70b8"`

- **Line 87** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #d97706
  - *Snippet*: `accentColor="#d97706"`

- **Line 94** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #2e7d32
  - *Snippet*: `accentColor="#2e7d32"`

- **Line 110** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52]
  - *Snippet*: `? 'bg-[#152e52] text-white font-semibold shadow-xs'`

- **Line 129** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h3 className="font-serif font-bold text-base text-[#152e52]">{alert.title}</h3>`

### File: `frontend/src/pages/resident/DamsPage.jsx` (5 findings)

- **Line 41** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 56** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #1d70b8
  - *Snippet*: `accentColor="#1d70b8"`

- **Line 63** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #2e7d32
  - *Snippet*: `accentColor="#2e7d32"`

- **Line 70** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded hex colour(s): #2e7d32
  - *Snippet*: `accentColor="#2e7d32"`

- **Line 82** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): ring-[#1d70b8]
  - *Snippet*: `? 'ring-2 ring-[#1d70b8] shadow-sm'`

### File: `frontend/src/pages/resident/LiveTrucksPage.jsx` (13 findings)

- **Line 23** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Sipho Dlamini' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Sipho Dlamini',`

- **Line 40** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Lerato Motsepe' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Lerato Motsepe',`

- **Line 57** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Tshepo Khumalo' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Tshepo Khumalo',`

- **Line 122** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">`

- **Line 123** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Radio className="w-3.5 h-3.5 animate-pulse text-[#2e7d32]" />`

- **Line 126** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 136** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#f2f9f3], border-[#b8e3bd], text-[#2e7d32]
  - *Snippet*: `<div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] text-xs font-medium">`

- **Line 137** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `<span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-ping" />`

- **Line 164** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#1d70b8], ring-[#1d70b8]
  - *Snippet*: `? 'border-[#1d70b8] ring-2 ring-[#1d70b8]/20'`

- **Line 171** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-mono text-xs font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">`

- **Line 174** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px]
  - *Snippet*: `<span className="text-[11px] font-normal text-slate-500">`

- **Line 181** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<div className="flex items-center justify-between text-xs text-[#152e52] font-semibold mb-1">`

- **Line 197** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<span className="text-[#1d70b8] font-medium">ETA: {truck.estimatedArrival}</span>`

### File: `frontend/src/pages/resident/ResidentDashboard.jsx` (26 findings)

- **Line 88** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Sipho Dlamini' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Sipho Dlamini',`

- **Line 98** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Lerato Motsepe' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Lerato Motsepe',`

- **Line 108** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Tshepo Khumalo' used in UI instead of dynamic state
  - *Snippet*: `driverName: 'Tshepo Khumalo',`

- **Line 137** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8]">`

- **Line 138** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<Radio className="w-3.5 h-3.5 animate-pulse text-[#2e7d32]" />`

- **Line 141** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h1 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">`

- **Line 142** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `Welcome back, {user?.fullName || 'Resident'}`

- **Line 144** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): border-[#2e7d32]
  - *Snippet*: `<div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2 mt-1">`

- **Line 145** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<span className="text-[#2e7d32] font-medium text-xs italic">`

- **Line 165** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#152e52], bg-[#0f223d]
  - *Snippet*: `className="bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs px-3.5 py-2 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer"`

- **Line 177** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-2xl font-serif font-bold text-[#152e52]">74.5%</p>`

- **Line 183** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#2e7d32]
  - *Snippet*: `<p className="text-2xl font-serif font-bold text-[#2e7d32]">2 En Route</p>`

- **Line 195** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<p className="text-2xl font-serif font-bold text-[#152e52]">{user?.area || 'Galeshewe'}</p>`

- **Line 204** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif font-bold text-xl text-[#152e52] flex items-center gap-2">`

- **Line 205** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<AlertCircle className="w-5 h-5 text-[#152e52]" />`

- **Line 214** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center gap-1 cursor-pointer"`

- **Line 228** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<span className="font-mono font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">`

- **Line 237** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[11px], text-[#152e52], bg-[#f4f8fb], border-[#bcd6ea]
  - *Snippet*: `<p className="text-[11px] text-[#152e52] font-semibold bg-[#f4f8fb] px-2 py-1 rounded-md border border-[#bcd6ea]">`

- **Line 265** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif font-bold text-xl text-[#152e52] flex items-center gap-2">`

- **Line 266** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Droplet className="w-5 h-5 text-[#1d70b8] fill-current" />`

- **Line 271** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center gap-1"`

- **Line 289** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#152e52]
  - *Snippet*: `<h2 className="font-serif font-bold text-xl text-[#152e52] flex items-center gap-2">`

- **Line 290** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): text-[#1d70b8]
  - *Snippet*: `<Truck className="w-5 h-5 text-[#1d70b8]" />`

- **Line 299** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#1d70b8]
  - *Snippet*: `<span className="w-2.5 h-2.5 rounded-full bg-[#1d70b8]" />`

- **Line 303** | [Category 9: Hardcoded hex colours, radii and font sizes that should come from one shared place]
  - *Finding*: Hardcoded Tailwind arbitrary value(s): bg-[#2e7d32]
  - *Snippet*: `<span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]" />`

- **Line 315** | [Category 4: Text bugs: missing spaces, truncated text, placeholder names or hardcoded driver names/IDs]
  - *Finding*: Hardcoded placeholder or driver name 'Resident' used in UI instead of dynamic state
  - *Snippet*: `<ScheduledOutagesComponent userRole={user?.role || 'Resident'} />`
