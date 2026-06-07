import { cn } from "@/lib/utils";
import { DocumentIcon } from "./icons";

type AppLogoSize = "lg" | "md";

const sizeMap: Record<AppLogoSize, string> = {
  lg: "h-[var(--logo-size-lg)] w-[var(--logo-size-lg)] [&_svg]:h-10 [&_svg]:w-10",
  md: "h-[var(--logo-size-md)] w-[var(--logo-size-md)] [&_svg]:h-8 [&_svg]:w-8",
};

export function AppLogo({
  size = "lg",
  className,
}: {
  size?: AppLogoSize;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[var(--logo-radius)]",
        "bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)]",
        "text-white shadow-[var(--logo-shadow)]",
        sizeMap[size],
        className,
      )}
      aria-hidden
    >
      <DocumentIcon />
    </div>
  );
}
