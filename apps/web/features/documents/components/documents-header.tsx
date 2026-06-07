import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function DocumentsHeader({
  userInitials = "AS",
}: {
  userInitials?: string;
}) {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-[var(--text-primary)]">
          Documents
        </h1>
        <Link
          href={ROUTES.settings}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-bold text-white transition-transform duration-[var(--duration-fast)] hover:scale-105 active:scale-95"
          aria-label="Open profile and settings"
        >
          {userInitials}
        </Link>
      </div>
      <p className="mt-2 text-base text-[var(--text-secondary)]">
        Ask any of your documents anything
      </p>
    </header>
  );
}
