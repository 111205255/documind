"use client";

import Link from "next/link";
import { PlusIcon } from "@/components/brand/icons";
import { ROUTES } from "@/lib/constants";

/** Figma frame 04 — floating upload pill */
export function UploadFab() {
  return (
    <Link
      href={ROUTES.upload}
      className="fixed bottom-8 right-6 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 text-base font-semibold text-white shadow-[var(--doc-fab-shadow)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--brand-primary-hover)] active:scale-[0.97] max-[430px]:right-[max(1.5rem,calc((100vw-var(--mobile-max-width))/2+1.5rem))]"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <PlusIcon />
      Upload
    </Link>
  );
}
