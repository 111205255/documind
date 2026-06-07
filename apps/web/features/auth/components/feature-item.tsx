import type { ReactNode } from "react";

export function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--auth-feature-icon-border)] bg-[var(--auth-feature-icon-bg)] text-[var(--brand-primary)]"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="mt-0.5 text-sm leading-snug text-[var(--text-secondary)]">{description}</p>
      </div>
    </li>
  );
}
