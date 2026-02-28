import { Box, Container, Typography, Paper, Button } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const t = await getTranslations("legal.terms");
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
                {t("service")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("serviceText")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("userResponsibility")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("userResponsibilityText")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("prohibited")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("prohibitedText")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("termination")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("terminationText")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {t("changes")}
              </Typography>
              <Typography variant="body1" paragraph>
                {t("changesText")}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
