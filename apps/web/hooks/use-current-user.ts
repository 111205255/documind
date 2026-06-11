"use client";

import { useEffect, useState } from "react";
import { formatDisplayName } from "@/lib/format-display-name";
import { createClient } from "@/services/supabase/client";

export function useCurrentUser() {
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Account");
  const [initials, setInitials] = useState("DM");

  useEffect(() => {
    void createClient()
      .auth.getUser()
      .then(({ data }) => {
        const user = data.user;
        setEmail(user?.email ?? null);
        const name = formatDisplayName(user?.user_metadata, user?.email);
        setDisplayName(name);
        const parts = name.trim().split(/\s+/);
        const ini =
          parts.length >= 2
            ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
            : name.slice(0, 2).toUpperCase();
        setInitials(ini || "DM");
      });
  }, []);

  return { email, displayName, initials };
}
