# DebugGhost — Copilot Instructions

## Project Identity
DebugGhost is a Socratic AI coding tutor. It watches users code in a
browser editor, detects when they are stuck, and interrogates them with
AI-generated questions instead of fixing their bugs. It builds a personal
Blind Spot Radar Chart showing recurring cognitive weak points.

## Commands
- `npm run dev` — start dev server at localhost:5173
- `npm run build` — production build
- `npm run lint` — lint check

## Stack (DO NOT change)
- React 18 + Vite + TailwindCSS + Framer Motion
- Monaco Editor (@monaco-editor/react)
- Recharts (radar chart)
- Axios for HTTP calls
- Code execution: Piston API (https://emkc.org/api/v2/piston) — no auth
- AI: OpenRouter API (free tier)
  - Model 1: meta-llama/llama-3.3-70b-instruct:free (taxonomy + questions)
  - Model 2: google/gemini-2.0-flash-exp:free (answer evaluation)
- Persistence: localStorage only — no database
- Deploy target: Vercel free tier

## Architecture Laws (NEVER violate)
- fingerprint.js is the ONLY file that reads/writes localStorage
- openRouterApi.js is the ONLY file that calls OpenRouter
- pistonApi.js is the ONLY file that calls Piston API
- GhostModal MUST NEVER reveal the bug fix in questions 1, 2, or 3
- Error context sent to AI: max 30 lines around the error line only
- All OpenRouter calls MUST fall back to fallbackQuestions.js on failure
- ES modules only — no CommonJS require()
- Functional React components only — no class components
- All Tailwind classes inline on JSX — no separate CSS files except index.css
- All AI prompt strings live in src/prompts/ only

## File Structure to Build
src/
├── components/
│ ├── Editor.jsx
│ ├── GhostModal.jsx
│ ├── SessionSummary.jsx
│ ├── BlindSpotChart.jsx
│ ├── ControlBar.jsx
│ └── GhostAvatar.jsx
├── hooks/
│ ├── useStuckDetector.js
│ ├── useSession.js
│ └── useOpenRouter.js
├── services/
│ ├── pistonApi.js
│ ├── openRouterApi.js
│ └── fingerprint.js
├── prompts/
│ ├── taxonomy.prompt.js
│ ├── socratic.prompt.js
│ └── evaluate.prompt.js
├── data/
│ └── fallbackQuestions.js
├── utils/
│ └── errorParser.js
├── App.jsx
├── main.jsx
└── index.css

text

## Styling Rules
- Dark mode only. Body background: #0d0d0d
- Accent color: #8b5cf6 (purple)
- Code font: JetBrains Mono (Google Fonts)
- All animations via Framer Motion
- No light mode toggle ever

## Commit Convention
- Phase completions: "Phase N: description"
- Bug fixes: "fix: description"
- New features: "feat: description"