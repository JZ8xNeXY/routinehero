import { Box, Typography, Button } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface WelcomeProps {
  onNext: () => void;
}

export default function Welcome({ onNext }: WelcomeProps) {
  const handleClick = () => {
    console.log("Welcome: Let's Get Started clicked");
    onNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        py: 4,
      }}
    >
      <EmojiEventsIcon sx={{ fontSize: 80, color: "primary.main" }} />

      <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center">
        Welcome to RoutineHero!
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth="sm">
        Let&apos;s set up your family&apos;s habit tracking system. This will only take a few minutes.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          You&apos;ll be able to:
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
          <li>Track daily habits for your entire family (parents and children)</li>
          <li>Earn XP and build streaks</li>
          <li>Choose fun characters for kids</li>
          <li>Get reminders via LINE</li>
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleClick}
        sx={{ mt: 3 }}
      >
        Let&apos;s Get Started
      </Button>
    </Box>
  );
}
