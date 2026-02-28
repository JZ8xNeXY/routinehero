import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BillingContent from "@/components/settings/BillingContent";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: familyData } = await supabase
    .from("families")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!familyData) {
    redirect("/onboarding");
  }

  return <BillingContent family={familyData} />;
}
