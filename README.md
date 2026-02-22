# RoutineHero

Family habit tracking web app with gamification (XP, streaks, characters).

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Material-UI (MUI) v6**
- **Supabase** (Auth, Database, RLS)
- **Vercel** (Deployment)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout with MUI theme
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # Reusable components
│   └── ThemeRegistry.tsx # MUI theme provider
├── lib/                 # Utilities and configs
├── types/               # TypeScript types
└── CLAUDE.md           # AI agent instructions
```

## Development

```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Full development guidelines
- [tasks/todo.md](./tasks/todo.md) - Task tracking
- [tasks/lessons.md](./tasks/lessons.md) - Lessons learned
