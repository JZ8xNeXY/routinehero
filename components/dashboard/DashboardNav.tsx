"use client";

import { useState } from "react";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function DashboardNav() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = useTranslations("nav");

  const menuItems = [
    {
      key: "leaderboard",
      icon: <EmojiEventsIcon />,
      href: "/app/leaderboard",
    },
    {
      key: "members",
      icon: <PeopleIcon />,
      href: "/app/members",
    },
    {
      key: "habits",
      icon: <ChecklistIcon />,
      href: "/app/habits",
    },
    {
      key: "settings",
      icon: <SettingsIcon />,
      href: "/app/settings",
    },
  ];

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={() => setDrawerOpen(true)}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 280 }}
          role="presentation"
        >
          <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
            <Typography variant="h6" fontWeight="bold">
              {t("menu")}
            </Typography>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={t(item.key as any)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          {/* Language Switcher */}
          <Box sx={{ p: 2 }}>
            <LanguageSwitcher />
          </Box>

          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={async () => {
                  setDrawerOpen(false);
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={t("signOut")} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
