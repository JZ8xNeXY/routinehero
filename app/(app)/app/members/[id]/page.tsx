import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];
type HabitLogRow = Database["public"]["Tables"]["habit_logs"]["Row"];

// Calculate level from XP
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

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = (await createClient()) as any;

  // Auth check
  let user: { id: string } | null = null;
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  // Get family
  const { data: familyData, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (familyError || !familyData) {
    redirect("/login");
  }

  // Get member
  const { data: memberData, error: memberError } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .eq("family_id", familyData.id)
    .single();

  if (memberError || !memberData) {
    redirect("/app/members");
  }

  const member = memberData as MemberRow;

  // Get recent habit logs
  const { data: logsData } = await supabase
    .from("habit_logs")
    .select("*, habits(title, icon)")
    .eq("member_id", member.id)
    .order("date", { ascending: false })
    .limit(10);

  const recentLogs = (logsData || []) as (HabitLogRow & {
    habits: { title: string; icon: string };
  })[];

  const level = getLevel(member.total_xp);
  const progress = getLevelProgress(member.total_xp, level);
  const xpForNext = getXpForNextLevel(level);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Button
            component={Link}
            href="/app/members"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to Members
          </Button>
        </Stack>

        {/* Profile Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Stack direction="row" spacing={3} alignItems="center" mb={3}>
            <Avatar
              src={member.avatar_url || undefined}
              sx={{ width: 120, height: 120, border: 3, borderColor: "primary.main" }}
            >
              <Typography variant="h2">{member.name[0]?.toUpperCase()}</Typography>
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" mb={1}>
                {member.name}
              </Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip
                  label={member.role === "parent" ? "Parent" : `Age ${member.age}`}
                  variant="outlined"
                />
                <Chip label={`Level ${level}`} color="primary" />
              </Stack>
            </Box>
          </Stack>

          {/* XP Progress */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" fontWeight="600">
                {member.total_xp} XP
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next level: {xpForNext} XP
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: 2,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 2,
                  bgcolor: "primary.main",
                },
              }}
            />
          </Box>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <StarIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {member.total_xp}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total XP
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 48, color: "#f97316", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {member.current_streak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <EmojiEventsIcon sx={{ fontSize: 48, color: "#fbbf24", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {member.longest_streak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Best Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Recent Activity
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {recentLogs.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No activity yet. Complete some habits to see them here!
            </Typography>
          ) : (
            <Stack spacing={2}>
              {recentLogs.map((log) => (
                <Box
                  key={log.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "grey.50",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h5">{log.habits.icon}</Typography>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {log.habits.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={`+${log.xp_earned} XP`} color="success" size="small" />
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
