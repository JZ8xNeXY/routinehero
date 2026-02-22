# CLAUDE.md — RoutineHero

> AI agent operating instructions for this project.
> Read this file at the start of every session.

---

## Project Overview

**RoutineHero** is a family habit tracking web app with gamification (XP, streaks, characters).
Target: parents with children aged 4–14. Global-first, English UI, LINE notification support.
Stack: Next.js 15 (App Router) · **MUI (Material-UI)** · Supabase · Vercel

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **UI Library**: Material-UI (MUI) v6 + Emotion
- **Styling**: MUI `sx` prop + Tailwind CSS (utilities only)
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **i18n**: next-intl (English/Japanese)
- **Deployment**: Vercel
- **Notifications**: LINE Messaging API

---

## Workflow Rules

### 1. Plan Before You Build
- For ANY task with 3+ steps: write a plan to `tasks/todo.md` first
- Check in with the user before starting implementation
- If something breaks unexpectedly: STOP, re-plan, explain

### 2. Task Tracking
- Mark `tasks/todo.md` items with `[x]` as you complete them
- Add a "## Results" section at the end of each session
- Capture every user correction in `tasks/lessons.md`

### 3. Verification Before Done
- Never say "done" without proving it works
- Run `npm run build` before marking any feature complete
- Check Supabase dashboard to confirm data is being written

### 4. Self-Improvement
- After ANY mistake or correction → update `tasks/lessons.md`
- Review `tasks/lessons.md` at the start of each session

### 5. Code Quality
- Simplicity first: minimal code changes, minimal blast radius
- No temporary fixes — find the root cause
- Ask: "Would a senior engineer approve this?"

---

## Key Commands

```bash
# Dev
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build check
npm run lint         # ESLint
npm run type-check   # TypeScript check

# DB
npx supabase start   # Local Supabase
npx supabase db push # Apply migrations
npx supabase gen types typescript --local > types/supabase.ts
```

---

## MUI Guidelines

### Component Structure
```tsx
import { Box, Typography, Button } from "@mui/material";

export default function MyComponent() {
  return (
    <Box sx={{ p: 3, display: "flex", gap: 2 }}>
      <Typography variant="h5">Title</Typography>
      <Button variant="contained">Action</Button>
    </Box>
  );
}
```

### Theming
- Colors: Primary (indigo `#6366f1`), Secondary (pink `#ec4899`)
- Font: Nunito (400, 600, 700)
- Border radius: 12px (default)
- Edit `components/ThemeRegistry.tsx` to customize

### When to Use Tailwind
- Use MUI `sx` prop for component-specific styles
- Use Tailwind only for quick utilities (e.g., `flex`, `gap-2`)
- Avoid mixing both for the same property (pick one)

---

## Architecture Decisions (ADRs)

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth | Supabase Auth (email) | Simple, free tier sufficient |
| Family model | One account → multiple members | No child login complexity |
| Notifications | LINE Messaging API + Vercel Cron | Best fit for Japan market |
| Payments | Stripe (future) | Standard, global |
| i18n | next-intl | Easy EN/JA toggle |
| UI Library | MUI v6 | Rich components, TypeScript support |

---

## Environment Variables Required

```
# Supabase (Cloud)
NEXT_PUBLIC_SUPABASE_URL=https://mpkaoiqxdgdgkdmtmpct.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# LINE Messaging API
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Supabase Project**:
- Project ID: `mpkaoiqxdgdgkdmtmpct`
- Region: Tokyo (ap-northeast-1)
- Dashboard: https://supabase.com/dashboard/project/mpkaoiqxdgdgkdmtmpct

---

## Do Not

- Do NOT store sensitive data in localStorage
- Do NOT expose SERVICE_ROLE_KEY to the client
- Do NOT skip RLS (Row Level Security) on any table
- Do NOT hardcode user IDs or family IDs
- Do NOT deploy without running `npm run build` first
- Do NOT mix MUI and Tailwind for the same CSS property
