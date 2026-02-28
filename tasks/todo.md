# Monetization & Polish Implementation Tasks

## Phase 1: Japanese-First UI ✅
- [x] Change middleware.ts default locale to "ja"
- [x] Change i18n/request.ts default locale to "ja"
- [x] Create components/landing/LandingHeader.tsx with LanguageSwitcher
- [x] Add LandingHeader to app/page.tsx
- [x] Add LanguageSwitcher to authenticated app area
- [x] Test: Default language is Japanese
- [x] Test: Language switcher visible and works
- [x] Build test passed

## Phase 2: Landing Page Polish ✅
- [x] Take product screenshot for hero section
- [x] Replace gray placeholder in HeroSection.tsx
- [x] Update SocialProofSection with honest beta messaging
- [ ] Add OG image for social sharing (nice-to-have, skipped for prototype)
- [x] Test: Hero section shows real product
- [x] Test: Images load on mobile and desktop
- [x] Build test passed

## Phase 3: BGM System ✅
- [x] Create lib/sounds.ts with SoundManager class
- [x] Create components/BGMPlayer.tsx
- [x] Add placeholder public/sounds/bgm-ambient.mp3 (silent, needs replacement)
- [x] Add BGMPlayer to authenticated layout
- [x] Add BGM translation keys to messages files
- [x] Build test passed
- [ ] Test: BGM plays after user interaction (needs real audio file)
- [x] Test: Preference persists across sessions (localStorage implemented)

## Phase 4: Stripe Payment Flow ✅
- [x] Install stripe and @stripe/stripe-js packages
- [x] Create lib/stripe/server.ts
- [x] Create lib/stripe/client.ts
- [x] Create app/api/stripe/checkout/route.ts
- [x] Create app/api/stripe/webhook/route.ts
- [x] Create app/api/stripe/portal/route.ts
- [x] Create app/(app)/app/settings/billing/page.tsx with BillingContent component
- [x] Update PricingSection.tsx with checkout flow
- [x] Add billing translation keys (en/ja)
- [x] Create .env.local.example with Stripe variables
- [x] Add database migration (006_stripe_columns.sql)
- [x] Build test passed
- [ ] Test: Checkout flow works end-to-end (needs real Stripe keys)
- [ ] Test: Webhook processes events correctly (needs Stripe CLI)

## Phase 5: Feature Gating ⏳
- [ ] Create lib/plan-limits.ts
- [ ] Create lib/plan.ts with helper functions
- [ ] Create components/UpgradePrompt.tsx
- [ ] Update app/(app)/app/actions.ts with plan checks
- [ ] Update DashboardContent.tsx with upgrade banner
- [ ] Update BGMPlayer.tsx to gate BGM feature
- [ ] Update HabitCard.tsx to enforce habit limit
- [ ] Test: Free plan limits enforced
- [ ] Test: Premium users have no restrictions

## Phase 6: Verification & Polish
- [ ] Run npm run build and fix errors
- [ ] Visual QA checklist
- [ ] Payment flow test
- [ ] Sound test
- [ ] i18n test
- [ ] Performance test (Lighthouse)
- [ ] Security review

---

## Session Notes
Started: 2026-02-26
Current Phase: 5 (Feature Gating)

### Phase 1 Complete (30 min)
- ✅ Japanese is now the default language
- ✅ Language switcher added to landing header (transparent, top-right)
- ✅ Language switcher added to dashboard drawer menu
- ✅ Build test passed

### Phase 2 Complete (45 min)
- ✅ Moved existing screenshot to public/images/dashboard-hero.png
- ✅ Replaced gray placeholder with real product image
- ✅ Updated SocialProof stats to show honest beta messaging
- ✅ Added "Beta Tester" attribution to testimonials
- ✅ Build test passed
- 📝 OG image skipped (nice-to-have for later)

### Phase 3 Complete (30 min)
- ✅ Created SoundManager class with localStorage persistence
- ✅ Created BGMPlayer floating action button (bottom-right)
- ✅ Added app/(app)/layout.tsx to include BGMPlayer in all authenticated pages
- ✅ Added BGM translation keys (bgmOn/bgmOff)
- ✅ Created silent MP3 placeholder (12KB)
- ✅ Build test passed
- 📝 README.md with instructions to download royalty-free BGM
- ⚠️ User needs to replace silent placeholder with real ambient music

### Phase 4 Complete (90 min)
- ✅ Installed Stripe packages (stripe + @stripe/stripe-js)
- ✅ Created complete Stripe integration:
  - lib/stripe/server.ts (checkout sessions, portal)
  - lib/stripe/client.ts (client-side helper)
  - API routes: /api/stripe/checkout, /webhook, /portal
  - Billing page: /app/settings/billing with BillingContent component
- ✅ Updated PricingSection with dynamic checkout (detects login state)
- ✅ Added database migration for Stripe columns (families table)
- ✅ Created .env.local.example with all required variables
- ✅ Added comprehensive billing translations (en/ja)
- ✅ Build test passed with all TypeScript errors resolved
- ⚠️ User needs to:
  1. Create Stripe account and get API keys
  2. Create ¥500/month subscription product
  3. Set environment variables in .env.local
  4. Run migration: npx supabase db push
  5. Test with Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe/webhook
