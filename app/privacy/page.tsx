import { Box, Container, Typography, Paper, Button } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const dynamic = "force-dynamic";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ "& > *": { mb: 3 } }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                1. Information We Collect
              </Typography>
              <Typography variant="body1" paragraph>
                We collect information you provide directly to us when you create an account,
                including your email address, family name, and habit tracking data.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                2. How We Use Your Information
              </Typography>
              <Typography variant="body1" paragraph>
                We use the information we collect to:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">Provide, maintain, and improve our services</Typography>
                </li>
                <li>
                  <Typography variant="body1">Send you technical notices and support messages</Typography>
                </li>
                <li>
                  <Typography variant="body1">Track and analyze usage patterns</Typography>
                </li>
              </ul>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                3. Data Security
              </Typography>
              <Typography variant="body1" paragraph>
                We use industry-standard security measures to protect your data, including
                encryption and secure authentication through Supabase.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                4. Data Sharing
              </Typography>
              <Typography variant="body1" paragraph>
                We do not sell your personal information. We may share your information only:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">With your consent</Typography>
                </li>
                <li>
                  <Typography variant="body1">To comply with legal obligations</Typography>
                </li>
                <li>
                  <Typography variant="body1">With service providers who assist us in operating our service</Typography>
                </li>
              </ul>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                5. Your Rights
              </Typography>
              <Typography variant="body1" paragraph>
                You have the right to:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">Access your personal data</Typography>
                </li>
                <li>
                  <Typography variant="body1">Request deletion of your data</Typography>
                </li>
                <li>
                  <Typography variant="body1">Export your data</Typography>
                </li>
                <li>
                  <Typography variant="body1">Opt-out of marketing communications</Typography>
                </li>
              </ul>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                6. Contact Us
              </Typography>
              <Typography variant="body1">
                If you have any questions about this Privacy Policy, please contact us through
                the{" "}
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
