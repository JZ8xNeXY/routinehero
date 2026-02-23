import { Box, Container, Typography, Paper, Button } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const dynamic = "force-dynamic";

export default function TermsPage() {
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
          Back to Settings
        </Button>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            Terms of Service
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ "& > *": { mb: 3 } }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body1" paragraph>
                By accessing and using RoutineHero, you accept and agree to be bound by the
                terms and provision of this agreement.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                2. Use License
              </Typography>
              <Typography variant="body1" paragraph>
                Permission is granted to use RoutineHero for personal, non-commercial
                family habit tracking purposes. You may not:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">Use the service for any illegal purpose</Typography>
                </li>
                <li>
                  <Typography variant="body1">Attempt to gain unauthorized access to the service</Typography>
                </li>
                <li>
                  <Typography variant="body1">Share your account credentials with others</Typography>
                </li>
              </ul>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                3. User Account
              </Typography>
              <Typography variant="body1" paragraph>
                You are responsible for maintaining the confidentiality of your account and
                password. You agree to accept responsibility for all activities that occur
                under your account.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                4. Content Ownership
              </Typography>
              <Typography variant="body1" paragraph>
                You retain all rights to the content you create and upload to RoutineHero.
                By using our service, you grant us a license to store and display your
                content as necessary to provide the service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                5. Service Availability
              </Typography>
              <Typography variant="body1" paragraph>
                We strive to keep RoutineHero available at all times, but we do not guarantee
                uninterrupted access. We may suspend or terminate the service for maintenance
                or other reasons.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                6. Limitation of Liability
              </Typography>
              <Typography variant="body1" paragraph>
                RoutineHero is provided &quot;as is&quot; without warranties of any kind. We shall not
                be liable for any damages arising from the use of or inability to use the service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                7. Changes to Terms
              </Typography>
              <Typography variant="body1" paragraph>
                We reserve the right to modify these terms at any time. We will notify users
                of any significant changes via email or in-app notification.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                8. Contact
              </Typography>
              <Typography variant="body1">
                Questions about the Terms of Service should be sent to us through the{" "}
                <Link href="/contact" style={{ color: "inherit", textDecoration: "underline" }}>
                  Contact Support
                </Link>{" "}
                page.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
