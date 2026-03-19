# DebugGhost 👻
> The AI that teaches by NOT giving you the answer.

## What it does
DebugGhost watches you code, detects when you're stuck, and instead of fixing your bug — interrogates you with Socratic questions until you reason your way to the solution yourself. It then builds a personal Blind Spot Radar Chart of your recurring cognitive weak points.

## Quick Start
1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and add your OpenRouter API key (free at openrouter.ai)
4. Run `npm run dev`

## Stack
React + Vite + Monaco Editor + Framer Motion + Recharts + OpenRouter AI + Piston API

## How the AI works
- Classifies your error by cognitive origin (not just error type)
- Generates Socratic questions calibrated to your specific misunderstanding
- Evaluates your answers and escalates or affirms
- Builds a personal blind spot map over sessions
