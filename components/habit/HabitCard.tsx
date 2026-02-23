import { Card, CardContent, Button, Chip, Stack, Typography, Avatar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import type { Database } from "@/types/supabase";
import { completeHabitForMember } from "@/app/(app)/app/actions";

type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
type MemberRow = Database["public"]["Tables"]["members"]["Row"];

interface HabitCardProps {
  habit: HabitRow;
  members: MemberRow[];
  completedMemberIds: string[];
}

export default function HabitCard({
  habit,
  members,
  completedMemberIds,
}: HabitCardProps) {
  const assignedMembers = members.filter((member) => habit.member_ids.includes(member.id));
  const completedCount = assignedMembers.filter((member) =>
    completedMemberIds.includes(member.id)
  ).length;

  return (
    <Card sx={{ border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5">{habit.icon || "✅"}</Typography>
            <div>
              <Typography variant="subtitle1" fontWeight="700">
                {habit.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {habit.time_of_day && `⏰ ${habit.time_of_day} · `}
                {habit.xp_reward} XP / completion
              </Typography>
            </div>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={0.5}>
              {assignedMembers.map((member) => (
                <Avatar
                  key={member.id}
                  src={member.avatar_url || undefined}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: "0.75rem",
                    border: completedMemberIds.includes(member.id) ? "2px solid" : "none",
                    borderColor: "success.main"
                  }}
                >
                  {member.name[0]?.toUpperCase()}
                </Avatar>
              ))}
            </Stack>
            <Chip
              size="small"
              color={completedCount === assignedMembers.length ? "success" : "default"}
              label={`${completedCount}/${assignedMembers.length}`}
            />
          </Stack>
        </Stack>

        <Stack spacing={1}>
          {assignedMembers.map((member) => {
            const completed = completedMemberIds.includes(member.id);
            const action = completeHabitForMember.bind(null, {
              habitId: habit.id,
              memberId: member.id,
              memberName: member.name,
            });

            return (
              <Stack
                key={member.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor: completed ? "success.50" : "grey.50",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    src={member.avatar_url || undefined}
                    sx={{ width: 32, height: 32 }}
                  >
                    {member.name[0]?.toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" fontWeight={600}>
                    {member.name}
                  </Typography>
                </Stack>

                {completed ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    disabled
                    startIcon={<CheckCircleIcon />}
                  >
                    Completed
                  </Button>
                ) : (
                  <form action={action}>
                    <Button
                      type="submit"
                      size="small"
                      variant="outlined"
                      startIcon={<RadioButtonUncheckedIcon />}
                    >
                      Mark Done
                    </Button>
                  </form>
                )}
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
