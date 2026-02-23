# Google OAuth Setup Checklist

## Google Cloud Console

- [ ] Create new project (or select existing)
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 Client ID (Web application)
- [ ] Add authorized redirect URI: `https://mpkaoiqxdgdgkdmtmpct.supabase.co/auth/v1/callback`
- [ ] Copy Client ID
- [ ] Copy Client Secret

## Supabase Dashboard

- [ ] Go to Authentication > Providers
- [ ] Enable "Google" provider
- [ ] Paste Client ID
- [ ] Paste Client Secret
- [ ] Save settings

## Environment Variables (Optional)

The Service Role Key is commented out in `.env.local`. It's not currently needed for Google OAuth, but if you need it later:

- [ ] Go to Supabase Dashboard > Settings > API
- [ ] Copy the `service_role` key (secret)
- [ ] Uncomment and paste into `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] **WARNING**: Never commit this key or expose it to the client

## URL Configuration (Supabase)

- [ ] Go to Authentication > URL Configuration
- [ ] Set Site URL: `http://localhost:3000` (dev) or your Vercel URL (prod)
- [ ] Add redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/**`
- [ ] Save settings

## Testing

- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:3000/login
- [ ] Click "Continue with Google"
- [ ] Complete Google sign-in flow
- [ ] Verify redirect to `/onboarding` (new user) or `/app` (existing user)
- [ ] Check Supabase Dashboard > Authentication > Users to confirm user created

## Troubleshooting

If you encounter errors:

1. **"redirect_uri_mismatch"**: Check that the redirect URI in Google Cloud Console matches exactly
2. **"Invalid login credentials"**: Verify Client ID and Secret are correct in Supabase
3. **Redirect loop**: Check middleware.ts and callback route logic
4. **"User already registered"**: This is expected if the email already exists via email/password signup

---

## Reference Links

- Google Cloud Console: https://console.cloud.google.com/
- Supabase Project Dashboard: https://supabase.com/dashboard/project/mpkaoiqxdgdgkdmtmpct
- Supabase Auth Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
