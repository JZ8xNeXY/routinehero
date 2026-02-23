import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";

interface NextMissionCardProps {
  remainingCount: number;
  nextMissionLabel: string | null;
}

export default function NextMissionCard({
  remainingCount,
  nextMissionLabel,
}: NextMissionCardProps) {
  return (
    <Card
      sx={{
        mb: 3,
        color: "common.white",
        background:
          "linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(37,99,235,1) 100%)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <div>
            <Typography variant="overline" sx={{ opacity: 0.9 }}>
              Next Mission
            </Typography>
            <Typography variant="h6" fontWeight="700">
              {nextMissionLabel || "All missions complete for today"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {remainingCount === 0
                ? "Great work. Your family has completed all assigned habits."
                : `${remainingCount} mission${remainingCount === 1 ? "" : "s"} remaining`}
            </Typography>
          </div>
          <Chip
            icon={<FlagCircleIcon />}
            label={`${remainingCount} left`}
            color={remainingCount === 0 ? "success" : "secondary"}
            sx={{
              color: "common.white",
              bgcolor: remainingCount === 0 ? "success.main" : "secondary.main",
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
