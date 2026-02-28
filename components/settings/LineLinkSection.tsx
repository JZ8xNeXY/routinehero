"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTranslations } from "next-intl";
import {
  generateLineLinkToken,
  getLineSettings,
  unlinkLine,
} from "@/app/(app)/app/settings/actions";

export default function LineLinkSection() {
  const t = useTranslations("settings");
  const [loading, setLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [lineUserId, setLineUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  // Load LINE settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError(null);

    const result = await getLineSettings();

    if (result.error) {
      setError(result.error);
    } else {
      setIsLinked(result.isLinked || false);
      setLineUserId(result.lineUserId);
    }

    setLoading(false);
  }

  async function handleGenerateToken() {
    setGenerating(true);
    setError(null);
    setToken(null);

    const result = await generateLineLinkToken();

    if (result.error) {
      setError(result.error);
    } else if (result.token) {
      setToken(result.token);
    }

    setGenerating(false);
  }

  async function handleUnlink() {
    if (!confirm(t("lineLinkUnlinkConfirm"))) {
      return;
    }

    setUnlinking(true);
    setError(null);

    const result = await unlinkLine();

    if (result.error) {
      setError(result.error);
    } else {
      setIsLinked(false);
      setLineUserId(null);
      setToken(null);
    }

    setUnlinking(false);
  }

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("lineLinkTitle")}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("lineLinkDescription")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLinked ? (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            {t("lineLinkConnected")}
          </Alert>

          {lineUserId && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("lineLinkUserId")}:{" "}
              {lineUserId.substring(0, 5)}...{lineUserId.substring(lineUserId.length - 3)}
            </Typography>
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={handleUnlink}
            disabled={unlinking}
          >
            {unlinking ? <CircularProgress size={24} /> : t("lineLinkUnlink")}
          </Button>
        </>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            {t("lineLinkNotConnected")}
          </Alert>

          {/* Step 1: Add LINE bot as friend */}
          <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              {t("lineLinkStep1")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("lineLinkStep1Description")}
            </Typography>
            <Button
              variant="outlined"
              href={process.env.NEXT_PUBLIC_LINE_BOT_URL || "https://line.me/R/ti/p/@your-bot-id"}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
            >
              {t("lineLinkAddFriend")}
            </Button>
          </Box>

          {/* Step 2: Generate and send code */}
          {token ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  mb: 2,
                  color: "primary.main",
                }}
              >
                {token}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                {t("lineLinkInstructions")}
              </Typography>

              <Button
                variant="text"
                size="small"
                onClick={() => setToken(null)}
                sx={{ mt: 2 }}
              >
                {t("lineLinkClose")}
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleGenerateToken}
              disabled={generating}
            >
              {generating ? <CircularProgress size={24} /> : t("lineLinkGenerate")}
            </Button>
          )}
        </>
      )}
    </Paper>
  );
}
