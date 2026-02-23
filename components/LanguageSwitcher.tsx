"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // Store the preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // Navigate to the same page with new locale
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/(en|ja)/, `/${newLocale}`);
    router.push(newPath === currentPath ? `/${newLocale}${currentPath}` : newPath);
    router.refresh();
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Language</InputLabel>
      <Select
        value={locale}
        label="Language"
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ja">日本語</MenuItem>
      </Select>
    </FormControl>
  );
}
