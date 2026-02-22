import { Box, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <Typography variant="h3" component="h1" fontWeight="bold">
        RoutineHero
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Family habit tracking with gamification
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          component={Link}
          href="/signup"
          variant="contained"
          size="large"
        >
          Get Started
        </Button>
        <Button
          component={Link}
          href="/login"
          variant="outlined"
          size="large"
        >
          Sign In
        </Button>
      </Stack>
    </Box>
  );
}
