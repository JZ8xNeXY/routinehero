"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

  // Set locale cookie for immediate effect
  (await cookies()).set("NEXT_LOCALE", params.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  revalidatePath("/app/settings");
  revalidatePath("/app");

  return { success: true };
}

// Generate a 6-digit token for LINE linking
export async function generateLineLinkToken() {
  const supabase = (await createClient()) as any;

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's family
  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (familyError || !family) {
    return { error: "Family not found" };
  }

  // Generate random 6-digit token
  const token = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration to 10 minutes from now
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // Delete any existing tokens for this family
  await supabase
    .from("line_link_tokens")
    .delete()
    .eq("family_id", family.id);

  // Insert new token
  const { error: insertError } = await supabase
    .from("line_link_tokens")
    .insert({
      token,
      family_id: family.id,
      expires_at: expiresAt.toISOString(),
    });

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true, token };
}

// Get LINE connection status
export async function getLineSettings() {
  const supabase = (await createClient()) as any;

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's family with LINE settings
  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("id, line_settings(*)")
    .eq("user_id", user.id)
    .single();

  if (familyError || !family) {
    return { error: "Family not found" };
  }

  const lineSettings = family.line_settings?.[0];

  return {
    success: true,
    isLinked: !!lineSettings?.line_user_id,
    lineUserId: lineSettings?.line_user_id || null,
    notificationsEnabled: lineSettings?.notifications_enabled || false,
  };
}

// Unlink LINE account
export async function unlinkLine() {
  const supabase = (await createClient()) as any;

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's family
  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (familyError || !family) {
    return { error: "Family not found" };
  }

  // Update line_settings to remove connection
  const { error: updateError } = await supabase
    .from("line_settings")
    .update({
      line_user_id: null,
      notifications_enabled: false,
      updated_at: new Date().toISOString(),
    })
    .eq("family_id", family.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/app/settings");

  return { success: true };
}
