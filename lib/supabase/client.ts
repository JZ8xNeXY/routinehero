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

  // Use localStorage if shouldRemember is true, otherwise use sessionStorage
  const storage = shouldRemember ? localStorage : sessionStorage;

  return createBrowserClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: storage as any,
        storageKey: "sb-auth-token",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}
