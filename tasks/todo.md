# tasks/todo.md

> Claude Code: read this at session start. Update as you go.

---

## Current Session: Initial Setup with MUI

### Environment ✅
- [x] Create Next.js 15 project structure
- [x] Install dependencies (MUI, Supabase, next-intl)
- [x] Configure TypeScript, Tailwind, ESLint
- [x] Set up MUI theme (`components/ThemeRegistry.tsx`)
- [x] Create basic app structure (`app/layout.tsx`, `app/page.tsx`)
- [x] Start dev server (http://localhost:3000)
- [x] Create `.env.local` with Supabase credentials
- [x] Test build (`npm run build`)
- [x] Initialize git repository
- [x] Create initial commit
- [x] Create GitHub repository and push

### Supabase ✅
- [x] Start local Supabase
- [x] Create `supabase/migrations/001_families.sql`
- [x] Create `supabase/migrations/002_members.sql`
- [x] Create `supabase/migrations/003_habits.sql`
- [x] Create `supabase/migrations/004_habit_logs.sql`
- [x] Create `supabase/migrations/005_line_settings.sql`
- [x] Run migrations
- [x] Generate types: `npx supabase gen types typescript --local > types/supabase.ts`
- [x] Update `.env.local` with connection info

### Auth ✅
- [x] `lib/supabase/client.ts`
- [x] `lib/supabase/server.ts`
- [x] `middleware.ts` (auth guard)
- [x] `app/(auth)/login/page.tsx` (MUI)
- [x] `app/(auth)/signup/page.tsx` (MUI)
- [x] Update home page with auth links
- [x] Test build

### Onboarding
- [x] `app/onboarding/page.tsx` (flow shell)
- [x] `components/onboarding/steps/Welcome.tsx` (MUI)
- [x] `components/onboarding/steps/ParentSetup.tsx` (MUI)
- [x] `components/onboarding/steps/AddKids.tsx` (MUI)
- [x] `components/onboarding/steps/CharacterSelect.tsx` (MUI)
- [x] `components/onboarding/steps/HabitSelect.tsx` (MUI)
- [x] Supabase write on completion

### Dashboard
- [x] `app/(app)/app/page.tsx`
- [x] `components/dashboard/NextMissionCard.tsx` (MUI Card)
- [x] `components/member/FamilyStatusBar.tsx` (MUI)
- [x] `components/habit/HabitCard.tsx` (MUI Card)
- [x] `components/dashboard/XPPopup.tsx` (MUI Dialog/Snackbar)
- [x] habit_logs read/write

---

## Backlog

- [ ] Weekly report page (MUI Charts)
- [ ] Settings page (MUI Form components)
- [ ] LINE integration
- [ ] Paywall / Stripe
- [ ] i18n setup (next-intl)

---

## Completed ✅

### 2026-02-22 — Initial Setup
- Created Next.js 15 project with TypeScript
- Installed MUI v6 + Emotion
- Set up Tailwind CSS (utilities)
- Configured ThemeRegistry with custom theme
- Created basic home page
- Dev server running on localhost:3000

---

## Results

### 2026-02-22 — Session 1: Environment + Supabase + Auth

**Completed**:
- ✅ Next.js 15 + MUI + TypeScript project created
- ✅ Local Supabase running (Docker)
- ✅ Database schema created with RLS enabled
- ✅ Authentication implemented (login/signup pages)
- ✅ Middleware for route protection
- ✅ Build tested successfully
- ✅ Committed and pushed to GitHub

**Working URLs**:
- Dev server: http://localhost:3000
- Supabase Studio: http://127.0.0.1:54323
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup

**Next Steps**:
1. Create onboarding flow
2. Build dashboard
3. Implement habit tracking features

### 2026-02-22 — Session 2: Onboarding + Dashboard

**Completed**:
- ✅ Regenerated `types/supabase.ts` and fixed build blocker
- ✅ Implemented onboarding flow and Supabase writes
- ✅ Fixed dashboard route to `/app`
- ✅ Added dashboard components (`NextMissionCard`, `FamilyStatusBar`, `HabitCard`, `XPPopup`)
- ✅ Implemented habit completion writes to `habit_logs` with duplicate-safe handling
- ✅ Implemented today's `habit_logs` read on dashboard
- ✅ Build tested successfully (`npm run build`)

**Working URLs**:
- Dashboard: http://localhost:3000/app
- Onboarding: http://localhost:3000/onboarding

### 2026-02-23 — Session 3: Google OAuth Setup

**Completed**:
- ✅ Verified existing Google OAuth implementation (code is ready)
- ✅ Created setup checklist (`tasks/google-oauth-setup.md`)
- ✅ Build tested successfully (`npm run build`)

**Action Required** (Manual Setup):
1. Configure Google Cloud Console (create OAuth client)
2. Enable Google provider in Supabase Dashboard
3. Test Google sign-in flow

**Setup Guide**: See `tasks/google-oauth-setup.md` for step-by-step instructions

**Code Status**:
- ✅ Google sign-in button implemented (`/login`, `/signup`)
- ✅ OAuth callback handler (`/auth/callback`)
- ✅ Proper redirect logic (onboarding vs dashboard)
- ⏳ **Pending**: Supabase Dashboard configuration

**Bug Fixes**:
- ✅ Fixed post-login redirect issue (changed from `router.push` to `window.location.href`)
- ✅ Applied fix to login, signup, and onboarding completion flows
