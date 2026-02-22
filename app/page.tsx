import { Box, Typography, Button } from "@mui/material";

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
      <Button variant="contained" size="large">
        Get Started
      </Button>
    </Box>
  );
}
