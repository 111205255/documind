"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/services/supabase/client";

/** Frame 13 */
export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void createClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push(ROUTES.login);
    router.refresh();
  };

  return (
    <>
      <ScreenHeader title="Settings" subtitle="Profile & preferences" />
      <Card className="mt-4 space-y-4">
        <div>
          <p className="font-medium text-[var(--text-primary)]">Account</p>
          <p className="text-sm text-[var(--text-secondary)]">{email ?? "Not signed in"}</p>
        </div>
        <Divider />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-[var(--text-primary)]">Appearance</p>
            <p className="text-sm text-[var(--text-secondary)]">Theme: {theme ?? "system"}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={theme === "light" ? "primary" : "secondary"}
              type="button"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              size="sm"
              variant={theme === "dark" ? "primary" : "secondary"}
              type="button"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
        </div>
        <Divider />
        <Button variant="destructive" fullWidth type="button" onClick={() => void signOut()}>
          Sign out
        </Button>
      </Card>
    </>
  );
}
