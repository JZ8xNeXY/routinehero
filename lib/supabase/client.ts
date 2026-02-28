import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export function createClient(rememberMe?: boolean) {
  // If rememberMe is not specified, check localStorage for saved preference
  // Default to true if not found (to maintain existing behavior)
  let shouldRemember = rememberMe ?? true;

  if (rememberMe === undefined && typeof window !== "undefined") {
    const savedPreference = localStorage.getItem("rememberMe");
    shouldRemember = savedPreference === "true" || savedPreference === null;
  }

  // Use default cookie-based storage for SSR compatibility
  // The browser client will automatically sync with both cookies and localStorage
  return createBrowserClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // Set cookie lifetime based on rememberMe preference
        maxAge: shouldRemember ? 60 * 60 * 24 * 365 : undefined, // 1 year or session
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
}
