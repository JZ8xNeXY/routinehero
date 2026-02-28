import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Button, Container, Paper, Stack, Typography, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import SettingsForm from "@/components/settings/SettingsForm";
import LineLinkSection from "@/components/settings/LineLinkSection";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

type FamilyRow = Database["public"]["Tables"]["families"]["Row"];

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  const supabase = (await createClient()) as any;

  // Auth check
  let user: { id: string; email?: string } | null = null;
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

  const family = familyData as FamilyRow;

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
            {t("backToDashboard")}
          </Button>
        </Stack>

        <Typography variant="h4" fontWeight="bold" mb={1}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          {t("subtitle")}
        </Typography>

        <Stack spacing={4}>
          {/* Account Info */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("accountInfo")}
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t("email")}
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {user.email}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Family Settings */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              {t("familySettings")}
            </Typography>
            <SettingsForm family={family} />
          </Paper>

          {/* LINE Notifications */}
          <LineLinkSection />

          {/* Legal & Support */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("legalSupport")}
            </Typography>
            <Stack spacing={2}>
              <Button
                component={Link}
                href="/privacy"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: "flex-start" }}
              >
                {t("privacy")}
              </Button>
              <Button
                component={Link}
                href="/terms"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: "flex-start" }}
              >
                {t("terms")}
              </Button>
              <Button
                component={Link}
                href="/contact"
                variant="outlined"
                fullWidth
                sx={{ justifyContent: "flex-start" }}
              >
                {t("contactSupport")}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}
