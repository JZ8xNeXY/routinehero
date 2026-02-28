"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type Family = {
  id: string;
  plan: string;
  stripe_customer_id: string | null;
  plan_status: string | null;
  subscription_end_date: string | null;
};

export default function BillingContent({ family }: { family: Family }) {
  const t = useTranslations("settings.billing");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = family.plan === "premium";
  const hasActiveSubscription = family.stripe_customer_id && family.plan_status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          {t("title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("subtitle")}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" mb={1}>
                {t("currentPlan")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  label={isPremium ? t("premiumPlan") : t("freePlan")}
                  color={isPremium ? "primary" : "default"}
                  size="medium"
                />
                {hasActiveSubscription && (
                  <Chip
                    label={t("active")}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {isPremium && family.subscription_end_date && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t("renewsOn")}{" "}
                  {new Date(family.subscription_end_date).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            <Box>
              {!isPremium ? (
                <>
                  <Typography variant="h5" fontWeight="bold" mb={1}>
                    ¥500<Typography component="span" variant="body1">/月</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {t("premiumFeatures")}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleUpgrade}
                    disabled={loading}
                    fullWidth
                    sx={{ maxWidth: 300 }}
                  >
                    {loading ? <CircularProgress size={24} /> : t("upgradeToPremium")}
                  </Button>
                </>
              ) : hasActiveSubscription ? (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleManageBilling}
                  disabled={loading}
                  fullWidth
                  sx={{ maxWidth: 300 }}
                >
                  {loading ? <CircularProgress size={24} /> : t("manageBilling")}
                </Button>
              ) : null}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
