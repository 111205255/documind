"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/brand/app-logo";
import { APP_NAME, APP_TAGLINE, ROUTES } from "@/lib/constants";
import { FadeIn } from "@/components/motion/fade-in";
import { AuthGradientBackground } from "./auth-gradient-background";
import { OnboardingDots } from "./onboarding-dots";

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace(ROUTES.login), 2400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <AuthGradientBackground>
      <div className="mx-auto flex w-full max-w-[var(--mobile-max-width)] flex-1 flex-col px-[var(--auth-padding-x)]">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <FadeIn className="flex flex-col items-center">
            <AppLogo size="lg" />
            <h1 className="mt-6 text-[length:var(--text-display)] font-bold tracking-tight text-[var(--text-primary)]">
              {APP_NAME}
            </h1>
            <p className="mt-2 text-base text-[var(--text-secondary)]">{APP_TAGLINE}</p>
          </FadeIn>
        </div>

        <OnboardingDots active={0} className="pb-12 pt-8" />
      </div>
    </AuthGradientBackground>
  );
}
