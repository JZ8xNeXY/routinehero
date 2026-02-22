# tasks/lessons.md

> Updated after every user correction.
> Review at session start to avoid repeating mistakes.

---

## Rules Learned

### 2026-02-22 — User preference for MUI over shadcn/ui
**Context**: User requested to use MUI instead of the originally planned shadcn/ui
**Action**: Switched UI library to Material-UI v6
**Rule**: Always confirm UI library preference before starting. Don't assume based on initial plans.

### 2026-02-22 — create-next-app conflicts with existing files
**Issue**: `create-next-app` cannot run in a directory with existing files (including `.claude/`)
**Solution**: Manually create Next.js project structure with all required config files
**Rule**: For projects with existing setup files, prefer manual initialization over `create-next-app`

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
