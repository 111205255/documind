"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/services/supabase/client";

export function useCurrentUser() {
  const [email, setEmail] = useState<string | null>(null);
  const [initials, setInitials] = useState("DM");

  useEffect(() => {
    void createClient()
      .auth.getUser()
      .then(({ data }) => {
        const user = data.user;
        setEmail(user?.email ?? null);
        const name =
          user?.user_metadata?.full_name ??
          user?.user_metadata?.name ??
          user?.email?.split("@")[0] ??
          "User";
        const parts = String(name).trim().split(/\s+/);
        const ini =
          parts.length >= 2
            ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
            : String(name).slice(0, 2).toUpperCase();
        setInitials(ini || "DM");
      });
  }, []);

  return { email, initials };
}
