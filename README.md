# Move Contract Auditor

Lightweight AI-powered Move smart contract auditor.

## What it is
Upload a `.move` / `.mv` file or paste your Move code, then run a security audit powered by configured AI backends. The app stores the generated report in localStorage and shows a friendly report UI.

## Key features
- Web UI to upload or paste Move contracts and run audits.
- API endpoint that orchestrates multiple LLM backends and returns a structured JSON audit.
- Keyboard shortcuts: Meta/Ctrl+Enter to run audit, Meta/Ctrl+K to clear textarea.

## Quick start
1. Install deps:
   - pnpm: `pnpm install`
   - npm: `npm install`
2. Start dev server:
   - pnpm: `pnpm dev`
   - npm: `npm run dev`
3. Open http://localhost:3000 and go to the Upload page.

## Important files
- UI: [`UploadPage`](app/upload/page.tsx) — [app/upload/page.tsx](app/upload/page.tsx)  
  (handles file drag/drop, paste, run audit, keyboard shortcuts, and stores report in localStorage)
- API: [`POST`](app/api/audit/route.ts) — [app/api/audit/route.ts](app/api/audit/route.ts)  
  (tries multiple providers and returns the audit JSON)
- Report viewer: [`ReportPage`](app/report/page.tsx) — [app/report/page.tsx](app/report/page.tsx)
- Root layout: [`RootLayout`](app/layout.tsx) — [app/layout.tsx](app/layout.tsx)
- Package scripts: [package.json](package.json)

## Environment
Create a `.env` with provider keys as needed. Common vars used:
- OPENROUTER_API_KEY
- OPENROUTER_MODEL
- GOOGLE_API_KEY
- OLLAMA_BASE_URL
- OLLAMA_MODEL

See the API implementation for exact usage: [app/api/audit/route.ts](app/api/audit/route.ts)

## How it works (brief)
- Client posts code to `/api/audit` (`POST` in [app/api/audit/route.ts](app/api/audit/route.ts)).
- The server tries configured providers and returns a strict JSON audit.
- Client stores the report under `move_audit_report` in localStorage and navigates to the loading/report screens.

## Contributing
Open a PR with improvements to the UI or backend heuristics. Keep responses strictly JSON from providers for reliable parsing.
