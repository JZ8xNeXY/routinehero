import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  // Get locale from middleware header
  const headersList = await headers();
  let locale = headersList.get("x-next-intl-locale") || "ja";

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    locale = "ja";
  }

  // Load messages for this locale with explicit paths
  let messages = {};
  try {
    if (locale === "en") {
      messages = (await import("@/messages/en.json")).default;
    } else {
      messages = (await import("@/messages/ja.json")).default;
    }
  } catch (error) {
    console.error("Failed to load messages:", error);
    messages = (await import("@/messages/ja.json")).default;
  }

  return {
    locale,
    messages,
  };
});
