"use client";

import Link from "next/link";
import { ErrorState } from "@/components/feedback/error-state";
import { ROUTES } from "@/lib/constants";

/** Frame 15 — offline / error */
export default function OfflinePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4">
      <ErrorState
        title="You're offline"
        message="DocuMind needs a connection to sync documents and chat."
        onRetry={() => window.location.reload()}
      />
      <Link
        href={ROUTES.home}
        className="mt-4 text-sm font-medium text-[var(--text-brand)]"
      >
        Back to home
      </Link>
    </div>
  );
}
