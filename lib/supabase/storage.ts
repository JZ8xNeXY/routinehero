import { createClient } from "@/lib/supabase/client";

export async function uploadMemberAvatar(
  file: File,
  memberId: string
): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${memberId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("member-avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("member-avatars").getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { error: error.message || "Failed to upload image" };
  }
}

export async function deleteMemberAvatar(
  avatarUrl: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Extract file path from URL
    const urlParts = avatarUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from("member-avatars")
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { error: error.message || "Failed to delete image" };
  }
}
