"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CreateMemberParams {
  familyId: string;
  name: string;
  role: "parent" | "child";
  age?: number;
  characterId?: string | null;
}

interface UpdateMemberParams {
  memberId: string;
  name: string;
  age?: number;
  characterId?: string | null;
  avatarUrl?: string | null;
}

interface DeleteMemberParams {
  memberId: string;
  familyId: string;
}

export async function createMember(params: CreateMemberParams) {
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

  // Get max display_order
  const { data: maxOrderData } = await supabase
    .from("members")
    .select("display_order")
    .eq("family_id", params.familyId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxOrderData?.display_order || 0) + 1;

  // Insert member
  const { data: newMember, error: insertError } = await supabase
    .from("members")
    .insert({
      family_id: params.familyId,
      name: params.name,
      role: params.role,
      age: params.age || 0,
      character_id: params.characterId || null,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/app/members");
  revalidatePath("/app");

  return { success: true, member: newMember };
}

export async function updateMember(params: UpdateMemberParams) {
  const supabase = (await createClient()) as any;

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify member exists and user owns the family
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("*, families!inner(*)")
    .eq("id", params.memberId)
    .single();

  if (memberError || !member || member.families.user_id !== user.id) {
    return { error: "Member not found or access denied" };
  }

  // Update member
  const updateData: any = {
    name: params.name,
  };

  // Only update age and character if provided
  if (params.age !== undefined) {
    updateData.age = params.age;
  }
  if (params.characterId !== undefined) {
    updateData.character_id = params.characterId;
  }
  if (params.avatarUrl !== undefined) {
    updateData.avatar_url = params.avatarUrl;
  }

  const { error: updateError } = await supabase
    .from("members")
    .update(updateData)
    .eq("id", params.memberId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/app/members");
  revalidatePath("/app");

  return { success: true };
}

export async function deleteMember(params: DeleteMemberParams) {
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

  // Check minimum member count (at least 1 member required)
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id")
    .eq("family_id", params.familyId);

  if (membersError || !members || members.length <= 1) {
    return { error: "Cannot delete the last family member" };
  }

  // Get habit_logs count for this member (for warning purposes)
  const { count: logCount } = await supabase
    .from("habit_logs")
    .select("*", { count: "exact", head: true })
    .eq("member_id", params.memberId);

  // Cleanup habits.member_ids array (remove this member from all habits)
  const { error: cleanupError } = await supabase.rpc("remove_member_from_habits", {
    target_member_id: params.memberId,
    target_family_id: params.familyId,
  });

  // If RPC doesn't exist, do it manually
  if (cleanupError) {
    // Fallback: manual array cleanup
    const { data: habitsToUpdate } = await supabase
      .from("habits")
      .select("id, member_ids")
      .eq("family_id", params.familyId);

    if (habitsToUpdate) {
      for (const habit of habitsToUpdate) {
        if (habit.member_ids && habit.member_ids.includes(params.memberId)) {
          const updatedMemberIds = habit.member_ids.filter(
            (id: string) => id !== params.memberId
          );

          await supabase
            .from("habits")
            .update({ member_ids: updatedMemberIds })
            .eq("id", habit.id);
        }
      }
    }
  }

  // Delete member (habit_logs will be CASCADE deleted)
  const { error: deleteError } = await supabase
    .from("members")
    .delete()
    .eq("id", params.memberId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath("/app/members");
  revalidatePath("/app");

  return {
    success: true,
    deletedLogsCount: logCount || 0,
  };
}
