import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Button, Container, Paper, Stack, Typography, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import MemberForm from "@/components/member/MemberForm";
import MemberList from "@/components/member/MemberList";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

export default async function MembersPage() {
  const t = await getTranslations("members");
  const tSettings = await getTranslations("settings");
  const supabase = (await createClient()) as any;

  // Auth check
  let user: { id: string } | null = null;
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  // Get family
  const { data: familyData, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (familyError || !familyData) {
    redirect("/login");
  }

  // Get members
  const { data: memberData, error: membersError } = await supabase
    .from("members")
    .select("*")
    .eq("family_id", familyData.id)
    .order("display_order");

  const members = (membersError ? [] : memberData || []) as MemberRow[];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Button
            component={Link}
            href="/app"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            {tSettings("backToDashboard")}
          </Button>
        </Stack>

        <Typography variant="h4" fontWeight="bold" mb={1}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          {t("subtitle")}
        </Typography>

        <Stack spacing={4}>
          {/* Add Member Form */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <MemberForm familyId={familyData.id} />
          </Paper>

          <Divider />

          {/* Member List */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <MemberList members={members} familyId={familyData.id} />
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}
