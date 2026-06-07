"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLogo } from "@/components/brand/app-logo";
import {
  DocumentIcon,
  SearchIcon,
  SparkleIcon,
} from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { FadeIn } from "@/components/motion/fade-in";
import { signInWithEmail, signUpWithEmail } from "@/services/auth/sign-in-email";
import { AuthGradientBackground } from "./auth-gradient-background";
import { FeatureItem } from "./feature-item";
import { GoogleSignInButton } from "./google-sign-in-button";
import { signInWithGoogle } from "@/services/auth/sign-in-google";

const FEATURES = [
  {
    icon: <SparkleIcon />,
    title: "Answers with citations",
    description: "Every reply links to the exact page",
  },
  {
    icon: <SearchIcon />,
    title: "Search across documents",
    description: "Find anything in seconds",
  },
  {
    icon: <DocumentIcon className="h-5 w-5" />,
    title: "PDF, Word & web links",
    description: "Upload almost any source",
  },
] as const;

type AuthMode = "sign-in" | "sign-up";

export function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    void signInWithGoogle().catch(() => {
      window.location.href = ROUTES.home;
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "sign-up") {
        const { needsEmailConfirmation } = await signUpWithEmail(email, password);
        if (needsEmailConfirmation) {
          setMessage("Check your email to confirm your account, then sign in.");
          setMode("sign-in");
          return;
        }
      } else {
        await signInWithEmail(email, password);
      }
      router.push(ROUTES.home);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGradientBackground>
      <div className="mx-auto flex w-full max-w-[var(--mobile-max-width)] min-h-dvh flex-col px-[var(--auth-padding-x)] pb-8 pt-14">
        <FadeIn className="flex flex-col items-center text-center">
          <AppLogo size="md" />
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Welcome to {APP_NAME}
          </h1>
          <p className="mt-3 max-w-[18rem] text-base leading-relaxed text-[var(--text-secondary)]">
            {mode === "sign-up"
              ? "Create a free account to upload and chat with your documents."
              : "Sign in to upload documents and start chatting with them instantly."}
          </p>
        </FadeIn>

        <FadeIn delay={0.06} className="mt-8">
          <div
            className="flex rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-1"
            role="tablist"
            aria-label="Authentication mode"
          >
            {(["sign-in", "sign-up"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => {
                  setMode(tab);
                  setError(null);
                  setMessage(null);
                }}
                className={[
                  "flex-1 rounded-md py-2 text-sm font-semibold transition-colors",
                  mode === tab
                    ? "bg-[var(--brand-primary)] text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                ].join(" ")}
              >
                {tab === "sign-in" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form className="mt-4 space-y-3" onSubmit={(e) => void handleEmailAuth(e)}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "sign-up" ? "At least 6 characters" : "Your password"}
              minLength={6}
              required
            />
            {error ? (
              <p className="text-sm text-[var(--error)]" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="text-sm text-[var(--success)]" role="status">
                {message}
              </p>
            ) : null}
            <Button type="submit" fullWidth loading={loading}>
              {mode === "sign-up" ? "Create account" : "Sign in with email"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border-default)]" />
            <span className="text-xs text-[var(--text-tertiary)]">or</span>
            <div className="h-px flex-1 bg-[var(--border-default)]" />
          </div>

          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8 flex-1">
          <ul className="flex flex-col gap-6" aria-label="Features">
            {FEATURES.map((f) => (
              <FeatureItem
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.14} className="mt-auto pt-6">
          <p className="text-center text-xs leading-relaxed text-[var(--text-footer)]">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline-offset-2 hover:underline">
              Terms & Privacy Policy
            </Link>
          </p>

          {process.env.NODE_ENV === "development" ? (
            <p className="mt-4 text-center">
              <Link
                href={ROUTES.home}
                className="text-xs text-[var(--text-tertiary)] underline-offset-2 hover:underline"
              >
                Skip to app (dev)
              </Link>
            </p>
          ) : null}
        </FadeIn>
      </div>
    </AuthGradientBackground>
  );
}
