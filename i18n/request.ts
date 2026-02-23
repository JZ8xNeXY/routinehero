import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  // Locale is set by middleware and passed via headers
  // Messages are loaded directly in the root layout
  // We just return defaults here to satisfy next-intl requirements
  return {
    locale: "en",
    messages: {},
  };
});
