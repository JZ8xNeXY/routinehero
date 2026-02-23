"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CreateHabitParams {
  familyId: string;
  title: string;
  icon: string;
  xpReward: number;
  frequency: string;
  timeOfDay?: string | null;
  daysOfWeek?: number[] | null;
  memberIds: string[];
}

interface UpdateHabitParams {
  habitId: string;
  title: string;
  icon: string;
  xpReward: number;
  timeOfDay?: string | null;
  frequency?: string;
  daysOfWeek?: number[] | null;
  memberIds: string[];
}

interface DeleteHabitParams {
  habitId: string;
  familyId: string;
}

interface ReactivateHabitParams {
  habitId: string;
  familyId: string;
}

export async function createHabit(params: CreateHabitParams) {
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

  // Validate member_ids belong to this family
  if (params.memberIds.length === 0) {
    return { error: "At least one member must be assigned to the habit" };
  }

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id")
    .eq("family_id", params.familyId)
    .in("id", params.memberIds);

  if (membersError || !members || members.length !== params.memberIds.length) {
    return { error: "Invalid member IDs provided" };
  }

  // Get max display_order
  const { data: maxOrderData } = await supabase
    .from("habits")
    .select("display_order")
    .eq("family_id", params.familyId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxOrderData?.display_order || 0) + 1;

  // Insert habit
  const { data: newHabit, error: insertError } = await supabase
    .from("habits")
    .insert({
      family_id: params.familyId,
      title: params.title,
      icon: params.icon,
      xp_reward: params.xpReward,
      frequency: params.frequency,
      time_of_day: params.timeOfDay || null,
      days_of_week: params.daysOfWeek || null,
      member_ids: params.memberIds,
      is_active: true,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/app/habits");
  revalidatePath("/app");

  return { success: true, habit: newHabit };
}

export async function updateHabit(params: UpdateHabitParams) {
  const supabase = (await createClient()) as any;

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify habit exists and user owns the family
  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("*, families!inner(*)")
    .eq("id", params.habitId)
    .single();

  if (habitError || !habit || habit.families.user_id !== user.id) {
    return { error: "Habit not found or access denied" };
  }

  // Validate member_ids belong to this family
  if (params.memberIds.length === 0) {
    return { error: "At least one member must be assigned to the habit" };
  }

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id")
    .eq("family_id", habit.family_id)
    .in("id", params.memberIds);

  if (membersError || !members || members.length !== params.memberIds.length) {
    return { error: "Invalid member IDs provided" };
  }

  // Update habit
  const updateData: any = {
    title: params.title,
    icon: params.icon,
    xp_reward: params.xpReward,
    time_of_day: params.timeOfDay || null,
    member_ids: params.memberIds,
  };

  if (params.frequency !== undefined) {
    updateData.frequency = params.frequency;
    updateData.days_of_week = params.daysOfWeek || null;
  }

  const { error: updateError } = await supabase
    .from("habits")
    .update(updateData)
    .eq("id", params.habitId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/app/habits");
  revalidatePath("/app");

  return { success: true };
}

export async function deleteHabit(params: DeleteHabitParams) {
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

  // Soft delete: set is_active = false
  const { error: deleteError } = await supabase
    .from("habits")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", params.habitId)
    .eq("family_id", params.familyId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath("/app/habits");
  revalidatePath("/app");

  return { success: true };
}

export async function reactivateHabit(params: ReactivateHabitParams) {
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

  // Reactivate habit: set is_active = true
  const { error: reactivateError } = await supabase
    .from("habits")
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq("id", params.habitId)
    .eq("family_id", params.familyId);

  if (reactivateError) {
    return { error: reactivateError.message };
  }

  revalidatePath("/app/habits");
  revalidatePath("/app");

  return { success: true };
}
