# tasks/lessons.md

> Updated after every user correction.
> Review at session start to avoid repeating mistakes.

---

## Rules Learned

### 2026-02-22 — Signup may not create an immediate session
**Context**: Email signup can return `session: null` depending on auth settings (email confirmation required).
**Action**: Stopped unconditional redirect to onboarding and show confirmation guidance instead.
**Rule**: Never assume `signUp()` authenticates immediately; branch on `data.session`.

### 2026-02-22 — App Router route group path mismatch
**Context**: `app/(app)/page.tsx` was used while auth flow redirected to `/app`
**Action**: Moved dashboard page to `app/(app)/app/page.tsx` so URL and middleware match
**Rule**: In App Router, route groups `(...)` do not appear in URL paths. Always verify final URL mapping.

### 2026-02-22 — Empty Supabase types block strict TypeScript builds
**Issue**: `types/supabase.ts` was empty, causing imports to fail in build
**Solution**: Regenerated types with `npx supabase gen types typescript --local > types/supabase.ts`
**Rule**: After schema updates, regenerate `types/supabase.ts` before feature work or build checks.

### 2026-02-22 — User preference for MUI over shadcn/ui
**Context**: User requested to use MUI instead of the originally planned shadcn/ui
**Action**: Switched UI library to Material-UI v6
**Rule**: Always confirm UI library preference before starting. Don't assume based on initial plans.

### 2026-02-22 — create-next-app conflicts with existing files
**Issue**: `create-next-app` cannot run in a directory with existing files (including `.claude/`)
**Solution**: Manually create Next.js project structure with all required config files
**Rule**: For projects with existing setup files, prefer manual initialization over `create-next-app`

### 2026-02-23 — Post-login redirect fails with router.push
**Issue**: After successful login, `router.push("/app")` + `router.refresh()` didn't redirect to dashboard
**Cause**: Client-side routing doesn't trigger server middleware re-execution, so middleware still sees old (unauthenticated) session
**Solution**: Use `window.location.href = "/app"` to force full page reload, ensuring middleware reads fresh session cookies
**Rule**: After auth state changes (login/signup/onboarding), use `window.location.href` instead of `router.push()` to ensure server-side session sync

---

## Template

```
### [Date] — [Short description]
**Mistake**: What went wrong
**Fix**: What was done instead
**Rule**: Never do X, always do Y
```

---

## Example (for reference)

```
### 2026-02-22 — RLS missing on new table
**Mistake**: Created a table without enabling Row Level Security
**Fix**: Added `alter table X enable row level security` + policy
**Rule**: EVERY new table MUST have RLS enabled before any other work
```
