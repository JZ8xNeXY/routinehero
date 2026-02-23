import {
  Paper,
  Box,
  Typography,
  Avatar,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { Database } from "@/types/supabase";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

interface MemberLeaderboardProps {
  members: MemberRow[];
}

// Calculate level from XP (example progression)
function getLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 4000) return 6;
  if (xp < 8000) return 7;
  if (xp < 16000) return 8;
  return 9;
}

// Get XP required for next level
function getXpForNextLevel(level: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000];
  return thresholds[level] || thresholds[thresholds.length - 1];
}

// Get progress to next level (0-100)
function getLevelProgress(xp: number, level: number): number {
  const currentThreshold = getXpForNextLevel(level - 1);
  const nextThreshold = getXpForNextLevel(level);
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export default function MemberLeaderboard({ members }: MemberLeaderboardProps) {
  // Sort members by XP (descending)
  const sortedMembers = [...members].sort((a, b) => b.total_xp - a.total_xp);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <EmojiEventsIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Family Leaderboard
        </Typography>
      </Box>

      <Stack spacing={2}>
        {sortedMembers.map((member, index) => {
          const level = getLevel(member.total_xp);
          const progress = getLevelProgress(member.total_xp, level);
          const xpForNext = getXpForNextLevel(level);

          return (
            <Box
              key={member.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: index === 0 ? "primary.50" : "grey.50",
                border: 1,
                borderColor: index === 0 ? "primary.main" : "divider",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={member.avatar_url || undefined}
                    sx={{
                      width: 56,
                      height: 56,
                      border: index === 0 ? 3 : 2,
                      borderColor: index === 0 ? "primary.main" : "divider",
                    }}
                  >
                    {member.name[0]?.toUpperCase()}
                  </Avatar>
                  {index === 0 && (
                    <EmojiEventsIcon
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        color: "#fbbf24",
                        fontSize: 24,
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    <Typography variant="body1" fontWeight="bold">
                      {member.name}
                    </Typography>
                    {index === 0 && (
                      <Chip
                        label="MVP"
                        size="small"
                        color="primary"
                        sx={{ height: 20 }}
                      />
                    )}
                    <Chip
                      label={`Lv ${level}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20 }}
                    />
                  </Stack>

                  <Box sx={{ mb: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.5}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {member.total_xp} XP
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Next: {xpForNext} XP
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 1,
                          bgcolor: index === 0 ? "primary.main" : "secondary.main",
                        },
                      }}
                    />
                  </Box>

                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Streak
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        🔥 {member.current_streak} days
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Best
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        ⭐ {member.longest_streak} days
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {sortedMembers.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No members yet
        </Typography>
      )}
    </Paper>
  );
}
