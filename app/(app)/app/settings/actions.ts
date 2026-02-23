"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface UpdateFamilySettingsParams {
  familyId: string;
  familyName: string;
  locale: string;
  timezone: string;
}

export async function updateFamilySettings(params: UpdateFamilySettingsParams) {
  const supabase = (await createClient()) as any;

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify family ownership
  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("id", params.familyId)
    .eq("user_id", user.id)
    .single();

  if (familyError || !family) {
    return { error: "Family not found or access denied" };
  }

  // Validation
  if (!params.familyName || params.familyName.trim().length === 0) {
    return { error: "Family name is required" };
  }

  if (params.familyName.trim().length > 100) {
    return { error: "Family name must be 100 characters or less" };
  }

  // Update family
  const { error: updateError } = await supabase
    .from("families")
    .update({
      family_name: params.familyName.trim(),
      locale: params.locale,
      timezone: params.timezone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.familyId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app");

  return { success: true };
}
