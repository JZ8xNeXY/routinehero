"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1", // indigo
    },
    secondary: {
      main: "#ec4899", // pink
    },
  },
  typography: {
    fontFamily: "inherit",
  },
  shape: {
    borderRadius: 12,
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
