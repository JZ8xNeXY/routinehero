"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function XPPopup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const xpText = searchParams.get("xp");
  const member = searchParams.get("member");
  const habit = searchParams.get("habit");
  const error = searchParams.get("error");

  const parsedXp = useMemo(() => Number(xpText ?? "0"), [xpText]);

  useEffect(() => {
    if (xpText || error) {
      setOpen(true);
    }
  }, [xpText, error]);

  const clearFeedbackParams = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("xp");
    next.delete("member");
    next.delete("habit");
    next.delete("error");

    const target = next.size > 0 ? `${pathname}?${next.toString()}` : pathname;
    router.replace(target);
  };

  if (!xpText && !error) {
    return null;
  }

  const severity = error ? "error" : parsedXp > 0 ? "success" : "info";
  const message = error
    ? "Failed to save habit completion."
    : parsedXp > 0
      ? `${member || "Member"} earned ${parsedXp} XP for ${habit || "habit"}.`
      : `${member || "Member"} already completed ${habit || "this habit"} today.`;

  return (
    <Snackbar
      open={open}
      autoHideDuration={2800}
      onClose={() => {
        setOpen(false);
        clearFeedbackParams();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={() => {
          setOpen(false);
          clearFeedbackParams();
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
