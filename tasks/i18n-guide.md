# Japanese Translation (i18n) Guide

## Overview

RoutineHero now supports Japanese translation using next-intl. The app automatically detects the user's locale and displays content in their preferred language (English or Japanese).

## How It Works

1. **Automatic Detection**: The middleware detects the user's preferred language from their browser settings
2. **Cookie Storage**: Language preference is stored in a cookie for persistence
3. **Dynamic Content**: All UI text is loaded from translation files based on the current locale

## Supported Languages

- English (en) - Default
- Japanese (ja) - 日本語

## Translation Files

- `/messages/en.json` - English translations
- `/messages/ja.json` - Japanese translations

## Language Switcher Component

A `LanguageSwitcher` component is available at `/components/LanguageSwitcher.tsx`.

### Usage Example

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function MyPage() {
  return (
    <div>
      <LanguageSwitcher />
      {/* rest of your content */}
    </div>
  );
}
```

## Using Translations in Components

### Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("common");

  return (
    <button>{t("save")}</button> // "Save" or "保存"
  );
}
```

### Server Components

```tsx
import { useTranslations } from "next-intl";

export default function MyServerComponent() {
  const t = useTranslations("dashboard");

  return (
    <h1>{t("title")}</h1> // "Dashboard" or "ダッシュボード"
  );
}
```

## Translation Structure

The translation files are organized by namespace:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    ...
  },
  "dashboard": {
    "title": "Dashboard",
    ...
  },
  "members": {
    "title": "Family Members",
    ...
  }
}
```

## Adding New Translations

1. Add the key to `/messages/en.json`:
```json
{
  "myNamespace": {
    "myKey": "My English Text"
  }
}
```

2. Add the Japanese translation to `/messages/ja.json`:
```json
{
  "myNamespace": {
    "myKey": "私の日本語テキスト"
  }
}
```

3. Use in your component:
```tsx
const t = useTranslations("myNamespace");
<span>{t("myKey")}</span>
```

## Translations with Parameters

```tsx
// In messages/en.json
{
  "leaderboard": {
    "nextLevel": "Next level: {xp} XP"
  }
}

// In your component
const t = useTranslations("leaderboard");
<span>{t("nextLevel", { xp: 100 })}</span>
// Output: "Next level: 100 XP"
```

## TODO: Add Language Switcher to App

The LanguageSwitcher component should be added to:

1. **Settings Page** (`/app/settings/page.tsx`)
   - Add as a section in SettingsForm component
   - Allow users to explicitly choose their language

2. **Dashboard Navigation** (`/components/dashboard/DashboardNav.tsx`)
   - Add to the drawer menu for quick access

3. **Login/Signup Pages**
   - Add to header for language selection before authentication

## Current Status

✅ Infrastructure Setup
- [x] next-intl installed and configured
- [x] Middleware configured for locale detection
- [x] Translation files created (EN + JA)
- [x] LanguageSwitcher component created
- [x] Build successful with dynamic rendering

❌ Not Yet Implemented
- [ ] LanguageSwitcher added to Settings page
- [ ] LanguageSwitcher added to Dashboard navigation
- [ ] LanguageSwitcher added to auth pages
- [ ] Actual translations in components (currently showing hardcoded text)

## Next Steps to Complete i18n

1. Add LanguageSwitcher to Settings page
2. Replace hardcoded text with `useTranslations()` calls in:
   - Dashboard components
   - Member components
   - Habit components
   - Auth components
   - Onboarding components
3. Test language switching
4. Update family settings to store preferred language in database

## Testing

1. Change browser language to Japanese
2. Visit the app
3. Verify Japanese content is displayed
4. Use LanguageSwitcher to toggle between EN/JA
5. Verify preference is persisted in cookie

## Notes

- All pages are rendered dynamically to support locale detection
- Middleware handles locale routing with `localePrefix: "as-needed"`
- Default locale is English
- Language preference is stored in `NEXT_LOCALE` cookie
