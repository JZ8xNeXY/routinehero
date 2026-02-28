"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Select, MenuItem, FormControl } from "@mui/material";

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
      <Select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        sx={{
          color: "inherit",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.7)",
          },
          ".MuiSvgIcon-root": {
            color: "inherit",
          },
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ja">日本語</MenuItem>
      </Select>
    </FormControl>
  );
}
