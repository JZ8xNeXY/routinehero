"use client";

import { useEffect, useState } from "react";
import { Fab, Tooltip } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import { soundManager } from "@/lib/sounds";
import { useTranslations } from "next-intl";

export default function BGMPlayer() {
  const t = useTranslations("common");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load BGM on mount
    soundManager.loadBGM("/sounds/bgm-ambient.mp3");
    setIsLoaded(true);
    setIsPlaying(soundManager.getIsPlaying());
  }, []);

  const handleToggle = async () => {
    const playing = await soundManager.toggleBGM();
    setIsPlaying(playing);
  };

  if (!isLoaded) return null;

  return (
    <Tooltip title={isPlaying ? t("bgmOn") : t("bgmOff")} placement="left">
      <Fab
        color={isPlaying ? "primary" : "default"}
        aria-label="toggle background music"
        onClick={handleToggle}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
      </Fab>
    </Tooltip>
  );
}
