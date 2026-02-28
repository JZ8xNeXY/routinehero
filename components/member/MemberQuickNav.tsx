"use client";

import { Box, Card, CardContent, Avatar, Typography, Chip, Stack } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Link from "next/link";
import type { Database } from "@/types/supabase";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

interface MemberQuickNavProps {
  members: MemberRow[];
}

export default function MemberQuickNav({ members }: MemberQuickNavProps) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(auto-fit, minmax(140px, 1fr))",
          sm: "repeat(auto-fit, minmax(160px, 1fr))",
        },
        gap: 2,
      }}
    >
      {members.map((member) => (
          <Link
            key={member.id}
            href={`/app/member/${member.id}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              sx={{
                minWidth: 140,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                border: 1,
                borderColor: "divider",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack spacing={1.5} alignItems="center">
                  <Avatar
                    src={member.avatar_url || undefined}
                    sx={{
                      width: 48,
                      height: 48,
                      border: 2,
                      borderColor: "primary.light",
                    }}
                  >
                    {member.name[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ textAlign: "center", width: "100%" }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      noWrap
                      sx={{ mb: 0.5 }}
                    >
                      {member.name}
                    </Typography>
                    <Chip
                      label={`Lv ${member.level}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  </Box>
                  {(member.current_streak > 0 || member.longest_streak > 0) && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{
                        px: 1,
                        py: 0.25,
                        bgcolor: "rgba(249, 115, 22, 0.1)",
                        borderRadius: 1,
                      }}
                    >
                      <LocalFireDepartmentIcon
                        sx={{ fontSize: 14, color: "#f97316" }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        sx={{ color: "#f97316" }}
                      >
                        {member.current_streak > 0 ? member.current_streak : 0}
                      </Typography>
                      {member.longest_streak > member.current_streak && (
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                        >
                          (最高{member.longest_streak})
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Link>
        ))}
    </Box>
  );
}
