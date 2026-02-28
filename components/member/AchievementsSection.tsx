"use client";

import { Box, Paper, Typography, Grid, Stack, Chip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
  progress: number;
}

interface AchievementsSectionProps {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  level: number;
}

export default function AchievementsSection({
  totalXP,
  currentStreak,
  longestStreak,
  totalCompleted,
  level,
}: AchievementsSectionProps) {
  const achievements: Achievement[] = [
    {
      id: "first_step",
      title: "はじめの一歩",
      description: "初めての習慣完了",
      icon: "🎯",
      requirement: 1,
      unlocked: totalCompleted >= 1,
      progress: Math.min(totalCompleted, 1),
    },
    {
      id: "habit_master",
      title: "習慣マスター",
      description: "10個の習慣を完了",
      icon: "⭐",
      requirement: 10,
      unlocked: totalCompleted >= 10,
      progress: Math.min(totalCompleted, 10),
    },
    {
      id: "century",
      title: "センチュリー",
      description: "100個の習慣を完了",
      icon: "💯",
      requirement: 100,
      unlocked: totalCompleted >= 100,
      progress: Math.min(totalCompleted, 100),
    },
    {
      id: "streak_3",
      title: "3日連続",
      description: "3日間連続で習慣を完了",
      icon: "🔥",
      requirement: 3,
      unlocked: longestStreak >= 3,
      progress: Math.min(longestStreak, 3),
    },
    {
      id: "streak_7",
      title: "1週間連続",
      description: "7日間連続で習慣を完了",
      icon: "🌟",
      requirement: 7,
      unlocked: longestStreak >= 7,
      progress: Math.min(longestStreak, 7),
    },
    {
      id: "streak_30",
      title: "1ヶ月連続",
      description: "30日間連続で習慣を完了",
      icon: "🏆",
      requirement: 30,
      unlocked: longestStreak >= 30,
      progress: Math.min(longestStreak, 30),
    },
    {
      id: "level_5",
      title: "レベル5到達",
      description: "レベル5に到達",
      icon: "🎖️",
      requirement: 5,
      unlocked: level >= 5,
      progress: Math.min(level, 5),
    },
    {
      id: "xp_1000",
      title: "XPコレクター",
      description: "1000 XPを獲得",
      icon: "💎",
      requirement: 1000,
      unlocked: totalXP >= 1000,
      progress: Math.min(totalXP, 1000),
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          🏅 実績・バッジ
        </Typography>
        <Chip
          label={`${unlockedCount}/${achievements.length} 達成`}
          color="primary"
          size="small"
        />
      </Stack>

      <Grid container spacing={2}>
        {achievements.map((achievement) => (
          <Grid item xs={6} sm={4} md={3} key={achievement.id}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                border: 1,
                borderColor: achievement.unlocked ? "primary.main" : "divider",
                bgcolor: achievement.unlocked ? "primary.50" : "grey.50",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s",
                "&:hover": {
                  transform: achievement.unlocked ? "scale(1.05)" : "none",
                },
              }}
            >
              {!achievement.unlocked && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  <LockIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </Box>
              )}

              <Typography
                variant="h2"
                sx={{
                  filter: achievement.unlocked ? "none" : "grayscale(1)",
                  opacity: achievement.unlocked ? 1 : 0.3,
                }}
              >
                {achievement.icon}
              </Typography>

              <Typography
                variant="subtitle2"
                fontWeight="bold"
                mt={1}
                sx={{
                  color: achievement.unlocked ? "text.primary" : "text.disabled",
                }}
              >
                {achievement.title}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.5,
                  minHeight: 32,
                }}
              >
                {achievement.description}
              </Typography>

              {!achievement.unlocked && (
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 4,
                      bgcolor: "grey.300",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${
                          (achievement.progress / achievement.requirement) * 100
                        }%`,
                        height: "100%",
                        bgcolor: "primary.main",
                        transition: "width 0.3s",
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    {achievement.progress}/{achievement.requirement}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
