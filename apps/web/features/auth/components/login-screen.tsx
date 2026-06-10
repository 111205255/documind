"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/brand/app-logo";
import {
  DocumentIcon,
  SearchIcon,
  SparkleIcon,
} from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME, APP_TAGLINE, ROUTES } from "@/lib/constants";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { signInWithEmail, signUpWithEmail } from "@/services/auth/sign-in-email";
import { signInWithGoogle } from "@/services/auth/sign-in-google";
import { GoogleSignInButton } from "./google-sign-in-button";

const FEATURES = [
  { icon: <SparkleIcon />, text: "Answers with citations" },
  { icon: <SearchIcon />, text: "Search across documents" },
  { icon: <DocumentIcon className="h-5 w-5" />, text: "PDF, Word & web links" },
] as const;

type AuthMode = "sign-in" | "sign-up";

/** Figma frame 02 — split login with entrance animations */
export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    void signInWithGoogle().catch((err) => {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
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
      router.push(safeRedirectPath(searchParams.get("next"), ROUTES.home));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const panelMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, x: -24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
      };

  const cardMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row" data-testid="login-screen">
      {/* Mobile marketing strip */}
      <section className="flex flex-col gap-3 bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] px-6 py-8 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <AppLogo size="md" className="!h-10 !w-10 [&_svg]:!h-4 [&_svg]:!w-4" />
          <span className="text-lg font-bold">{APP_NAME}</span>
        </div>
        <p className="text-sm text-white/90">{APP_TAGLINE}</p>
      </section>

      {/* Desktop marketing — left 50% */}
      <motion.section
        data-testid="login-marketing-panel"
        className="hidden min-h-dvh flex-1 flex-col justify-between bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] px-12 py-10 text-white lg:flex"
        {...panelMotion}
      >
        <div className="flex items-center gap-3">
          <AppLogo size="md" className="!h-10 !w-10 [&_svg]:!h-4 [&_svg]:!w-4" />
          <span className="text-xl font-bold">{APP_NAME}</span>
        </div>
        <div className="py-8">
          <h1
            className="max-w-md font-bold tracking-tight"
            style={{
              fontSize: "var(--auth-headline-size)",
              lineHeight: "var(--auth-headline-leading)",
            }}
          >
            {APP_TAGLINE}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/90">
            Upload any document and chat with it — answers always cite the exact page.
          </p>
          <ul className="mt-12 space-y-5">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.text}
                className="flex items-center gap-4 text-base"
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : 0.15 + i * 0.1, duration: 0.35 }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10">
                  {f.icon}
                </span>
                {f.text}
              </motion.li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="h-4" />
      </motion.section>

      {/* Auth panel — right 50% */}
      <section
        data-testid="login-auth-panel"
        className="flex min-h-0 flex-1 items-center justify-center bg-[var(--auth-panel-bg)] px-6 py-10 lg:min-h-dvh lg:px-12"
      >
        <motion.div
          data-testid="login-auth-card"
          className="w-full rounded-[var(--auth-card-radius)] border border-[var(--auth-card-border)] bg-[var(--auth-card-bg)] shadow-[var(--auth-card-shadow)]"
          style={{
            maxWidth: "var(--auth-card-max)",
            padding: "var(--auth-card-padding)",
          }}
          {...cardMotion}
        >
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome to {APP_NAME}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Sign in to upload documents and start chatting with them instantly.
          </p>

          <div className="mt-8">
            <GoogleSignInButton onClick={handleGoogleSignIn} />
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border-default)]" />
            <span className="text-xs text-[var(--text-tertiary)]">or</span>
            <div className="h-px flex-1 bg-[var(--border-default)]" />
          </div>

          <form className="space-y-4" onSubmit={(e) => void handleEmailAuth(e)}>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              required
            />
            <Input
              type="password"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "sign-up" ? "At least 6 characters" : "Password"}
              minLength={6}
              required
            />
            {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
            {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}
            <Button type="submit" fullWidth loading={loading} className="!h-12">
              {mode === "sign-up" ? "Create account" : "Continue"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
            {mode === "sign-in" ? "New here? " : "Have an account? "}
            <button
              type="button"
              className="font-medium text-[var(--brand-primary)] hover:underline"
              onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            >
              {mode === "sign-in" ? "Create account" : "Sign in"}
            </button>
          </p>

          <p className="mt-8 text-center text-xs leading-relaxed text-[var(--text-footer)]">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline-offset-2 hover:underline">
              Terms & Privacy Policy
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
