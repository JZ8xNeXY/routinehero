# Setup Guide

## Supabase Cloud Project

**Project Details**:
- Project ID: `mpkaoiqxdgdgkdmtmpct`
- Region: Tokyo (ap-northeast-1)
- URL: https://mpkaoiqxdgdgkdmtmpct.supabase.co
- Dashboard: https://supabase.com/dashboard/project/mpkaoiqxdgdgkdmtmpct

## Google OAuth Setup

### 1. Google Cloud Console

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. **APIs & Services** → **OAuth consent screen**
   - User Type: External
   - App name: RoutineHero
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
   - Scopes: `email`, `profile`, `openid`

4. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: Web application
   - Name: RoutineHero
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://your-domain.vercel.app` (production)
   - Authorized redirect URIs:
     - `https://mpkaoiqxdgdgkdmtmpct.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

### 2. Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/mpkaoiqxdgdgkdmtmpct/auth/providers
2. Find **Google** provider
3. Enable it
4. Paste:
   - Client ID (from Google Console)
   - Client Secret (from Google Console)
5. Save

### 3. Test Authentication

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/login
3. Click "Continue with Google"
4. Sign in with your Google account
5. Should redirect to `/onboarding`

## Database Schema

All migrations are applied to the cloud project:
- ✅ `001_families` - Family accounts
- ✅ `002_members` - Family members (parent + kids)
- ✅ `003_habits` - Habit templates
- ✅ `004_habit_logs` - Completion records with XP/streak tracking
- ✅ `005_line_settings` - LINE notification preferences

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Supabase (Cloud)
NEXT_PUBLIC_SUPABASE_URL=https://mpkaoiqxdgdgkdmtmpct.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2FvaXF4ZGdkZ2tkbXRtcGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDUzNDMsImV4cCI6MjA4NzMyMTM0M30.BcwS6HpCvHF1_42YRdyX2NcLaJAqM5jgfBkxYDT6bFM
SUPABASE_SERVICE_ROLE_KEY=<get-from-supabase-dashboard>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## Deployment (Vercel)

1. Connect GitHub repository
2. Add environment variables
3. Deploy

**Important**: Update Google OAuth redirect URIs with production URL after deployment.
