import { Box, Container, Typography, Paper, Button } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal.privacy");
  const tCommon = await getTranslations("common");

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button
          component={Link}
          href="/app/settings"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          {tCommon("back")}
        </Button>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            {t("title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            {t("lastUpdated")}
          </Typography>

          <Box sx={{ "& > *": { mb: 3 } }}>
            <Box>
              <Typography variant="body1" paragraph>
                {t("intro")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("dataCollection")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("dataCollectionText")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("dataUsage")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("dataUsageText")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("dataSecurity")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("dataSecurityText")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("contact")}
              </Typography>
              <Typography variant="body1">
                {t("contactText")}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
