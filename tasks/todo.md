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

### Supabase
- [ ] Create project at supabase.com
- [ ] Create `supabase/migrations/001_families.sql`
- [ ] Create `supabase/migrations/002_members.sql`
- [ ] Create `supabase/migrations/003_habits.sql`
- [ ] Create `supabase/migrations/004_habit_logs.sql`
- [ ] Create `supabase/migrations/005_line_settings.sql`
- [ ] Run migrations
- [ ] Generate types: `npx supabase gen types typescript --local > types/supabase.ts`

### Auth
- [ ] `lib/supabase/client.ts`
- [ ] `lib/supabase/server.ts`
- [ ] `middleware.ts` (auth guard)
- [ ] `app/(auth)/login/page.tsx` (MUI)
- [ ] `app/(auth)/signup/page.tsx` (MUI)

### Onboarding
- [ ] `app/onboarding/page.tsx` (flow shell)
- [ ] `components/onboarding/steps/Welcome.tsx` (MUI)
- [ ] `components/onboarding/steps/ParentSetup.tsx` (MUI)
- [ ] `components/onboarding/steps/AddKids.tsx` (MUI)
- [ ] `components/onboarding/steps/CharacterSelect.tsx` (MUI)
- [ ] `components/onboarding/steps/HabitSelect.tsx` (MUI)
- [ ] Supabase write on completion

### Dashboard
- [ ] `app/(app)/page.tsx`
- [ ] `components/dashboard/NextMissionCard.tsx` (MUI Card)
- [ ] `components/member/FamilyStatusBar.tsx` (MUI)
- [ ] `components/habit/HabitCard.tsx` (MUI Card)
- [ ] `components/dashboard/XPPopup.tsx` (MUI Dialog/Snackbar)
- [ ] habit_logs read/write

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

**Status**: ✅ Next.js + MUI project successfully initialized

**Working**:
- Dev server running on http://localhost:3000
- MUI theme applied (indigo/pink colors, Nunito font)
- TypeScript, ESLint configured

**Next Steps**:
1. Create `.env.local` with Supabase credentials
2. Set up Supabase project and migrations
3. Implement authentication
