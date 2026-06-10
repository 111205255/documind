"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { SplashBrand } from "@/components/motion/splash-brand";
import { createClient } from "@/services/supabase/client";
import { AnimatedSplashDots } from "./animated-splash-dots";

/** Figma frame 01 — splash with motion */
export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      router.replace(user ? ROUTES.home : ROUTES.login);
    }, 2800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div
      data-testid="splash-screen"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white"
    >
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-20 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
      <SplashBrand />
      <AnimatedSplashDots className="absolute bottom-[max(3.5rem,env(safe-area-inset-bottom))]" />
    </div>
  );
}
