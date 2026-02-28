"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { Database } from "@/types/supabase";
import NextMissionCard from "@/components/dashboard/NextMissionCard";
import FamilyStatusBar from "@/components/member/FamilyStatusBar";
import MemberQuickNav from "@/components/member/MemberQuickNav";
import HabitCard from "@/components/habit/HabitCard";
import { useTranslations } from "next-intl";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];
type HabitRow = Database["public"]["Tables"]["habits"]["Row"];

interface DashboardContentProps {
  family: {
    id: string;
    family_name: string;
    timezone: string;
  };
  members: MemberRow[];
  habits: HabitRow[];
  completedByHabit: Record<string, string[]>;
  today: string;
}

export default function DashboardContent({
  family,
  members,
  habits,
  completedByHabit,
  today,
}: DashboardContentProps) {
  const t = useTranslations("dashboard");
  const tMembers = useTranslations("members");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("all");

  // Filter habits based on selected member
  const filteredHabits = selectedMemberId === "all"
    ? habits
    : habits.filter((h) => h.member_ids.includes(selectedMemberId));

  // Calculate pending missions for filtered habits
  const pendingMissions: Array<{ habitTitle: string; memberName: string }> = [];
  for (const habit of filteredHabits) {
    const assigned = members.filter((member) => {
      const isMemberAssigned = habit.member_ids.includes(member.id);
      const matchesFilter = selectedMemberId === "all" || member.id === selectedMemberId;
      return isMemberAssigned && matchesFilter;
    });
    const completed = completedByHabit[habit.id] || [];
    for (const member of assigned) {
      if (!completed.includes(member.id)) {
        pendingMissions.push({ habitTitle: habit.title, memberName: member.name });
      }
    }
  }

  const nextMission = pendingMissions[0];

  return (
    <>
      <FamilyStatusBar members={members} />
      <MemberQuickNav members={members} />

      <FormControl size="small" sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>{t("filterByMember")}</InputLabel>
        <Select
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          label={t("filterByMember")}
        >
          <MenuItem value="all">{t("allMembers")}</MenuItem>
          {members.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name} {m.role === "parent" ? `(${tMembers("parent")})` : ""}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <NextMissionCard
        remainingCount={pendingMissions.length}
        nextMissionLabel={
          nextMission ? `${nextMission.memberName}: ${nextMission.habitTitle}` : null
        }
      />

      <Typography variant="h6" mb={2}>
        {t("todaysHabits")} ({filteredHabits.length})
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
        {filteredHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            members={members}
            completedMemberIds={completedByHabit[habit.id] || []}
            familyId={family.id}
            allMembers={members}
          />
        ))}
      </Box>

      {filteredHabits.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
          {selectedMemberId === "all"
            ? t("noHabitsMessage")
            : t("noHabitsToday")}
        </Typography>
      )}
    </>
  );
}
