import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonLines({
  lines = 2,
  gap = 6,
  className,
}: {
  lines?: number;
  gap?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? "68%" : "100%" }}
        />
      ))}
    </div>
  );
}
