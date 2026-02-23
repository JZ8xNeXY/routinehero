import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: "RoutineHero",
  description: "Family habit tracking with gamification",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale from headers set by middleware
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") || "en";

  // Load messages directly
  let messages = {};
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Failed to load messages:", error);
    // Fallback to English
    messages = (await import("@/messages/en.json")).default;
  }

  return (
    <html lang={locale}>
      <body style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
