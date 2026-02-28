"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Dialog,
  Typography,
  Stack,
  Button,
  Zoom,
} from "@mui/material";
import { keyframes } from "@mui/system";
import StarsIcon from "@mui/icons-material/Stars";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTranslations } from "next-intl";

// Animations
const floatUp = keyframes`
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-150px) scale(1.5);
    opacity: 0;
  }
`;

const sparkle = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

interface CelebrationEffectsProps {
  // Props will be passed from parent
}

export default function CelebrationEffects() {
  const tc = useTranslations("celebration");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [showXpPopup, setShowXpPopup] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const xpText = searchParams.get("xp");
  const member = searchParams.get("member");
  const levelUp = searchParams.get("levelUp");
  const newLevel = searchParams.get("newLevel");

  const parsedXp = useMemo(() => Number(xpText ?? "0"), [xpText]);

  const clearFeedbackParams = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("xp");
    next.delete("member");
    next.delete("habit");
    next.delete("levelUp");
    next.delete("newLevel");

    const target = next.size > 0 ? `${pathname}?${next.toString()}` : pathname;
    router.replace(target);
  }, [searchParams, pathname, router]);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudioLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (xpText && parsedXp > 0 && audioLoaded) {
      // Play completion sound
      playCompletionSound();
      setShowXpPopup(true);

      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setShowXpPopup(false);
        if (!levelUp) {
          clearFeedbackParams();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [xpText, parsedXp, audioLoaded, levelUp, clearFeedbackParams]);

  useEffect(() => {
    if (levelUp === "true" && audioLoaded) {
      // Play level up sound
      playLevelUpSound();
      setShowLevelUp(true);
    }
  }, [levelUp, audioLoaded]);

  // Generate completion sound using Web Audio API
  const playCompletionSound = () => {
    if (typeof window === "undefined") return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create a pleasant "ding" sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (err) {
      console.log("Audio playback failed:", err);
    }
  };

  // Generate level up fanfare using Web Audio API
  const playLevelUpSound = () => {
    if (typeof window === "undefined") return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create a fanfare with three ascending notes
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        const startTime = audioContext.currentTime + (index * 0.15);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
      });
    } catch (err) {
      console.log("Audio playback failed:", err);
    }
  };

  const handleLevelUpClose = () => {
    setShowLevelUp(false);
    clearFeedbackParams();
  };

  return (
    <>
      {/* XP Popup Animation */}
      {showXpPopup && parsedXp > 0 && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {/* Main XP number */}
          <Box
            sx={{
              animation: `${floatUp} 2s ease-out forwards`,
              fontSize: { xs: "4rem", sm: "6rem" },
              fontWeight: "bold",
              color: "#fbbf24",
              textShadow: "0 0 20px rgba(251, 191, 36, 0.5), 0 4px 8px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <StarsIcon sx={{ fontSize: "inherit", color: "#fbbf24" }} />
            +{parsedXp} XP
          </Box>

          {/* Sparkle effects */}
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 20,
                height: 20,
                background: "linear-gradient(45deg, #fbbf24, #f59e0b)",
                borderRadius: "50%",
                animation: `${sparkle} 1s ease-in-out infinite`,
                animationDelay: `${i * 0.125}s`,
                transform: `rotate(${i * 45}deg) translateX(80px)`,
              }}
            />
          ))}
        </Box>
      )}

      {/* Level Up Modal */}
      <Dialog
        open={showLevelUp}
        onClose={handleLevelUpClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 4,
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ p: 4, textAlign: "center", position: "relative" }}>
          {/* Confetti effect */}
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: "-20px",
                left: `${Math.random() * 100}%`,
                width: 10,
                height: 10,
                background: ["#fbbf24", "#f59e0b", "#ec4899", "#8b5cf6"][i % 4],
                borderRadius: "50%",
                animation: `${floatUp} ${2 + Math.random() * 2}s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Trophy icon */}
          <Box
            sx={{
              animation: `${bounce} 0.6s ease-in-out infinite`,
              display: "inline-block",
              mb: 2,
            }}
          >
            <EmojiEventsIcon
              sx={{
                fontSize: "8rem",
                color: "#fbbf24",
                filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))",
              }}
            />
          </Box>

          <Typography
            variant="h3"
            fontWeight="bold"
            mb={1}
            sx={{
              textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            {tc("levelUp")}
          </Typography>

          <Typography variant="h4" mb={1}>
            {member || "Member"}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" sx={{ opacity: 0.7 }}>
              Level {parseInt(newLevel || "1") - 1}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              →
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#fbbf24",
                textShadow: "0 0 10px rgba(251, 191, 36, 0.6)",
              }}
            >
              Level {newLevel || "1"}
            </Typography>
          </Stack>

          <Typography variant="body1" mb={3} sx={{ opacity: 0.9 }}>
            🎉 {tc("congratulations")}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleLevelUpClose}
            sx={{
              bgcolor: "white",
              color: "#667eea",
              fontWeight: "bold",
              fontSize: "1.1rem",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "#f3f4f6",
              },
            }}
          >
            {tc("awesome")}
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
