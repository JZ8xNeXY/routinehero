"use client";

import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LandingHeader() {
  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: "transparent",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
              }}
            >
              RoutineHero
            </Typography>
          </Box>
        </Link>

        {/* Language Switcher */}
        <Box>
          <LanguageSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
