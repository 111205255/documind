import { type ReactNode } from "react";
import { FadeIn } from "./FadeIn";
import { staggerDelay } from "../../lib/motion";
import { Stagger } from "../../theme/motion";

export function StaggerIn({
  index,
  children,
  baseDelay = 0,
  step = Stagger.list,
}: {
  index: number;
  children: ReactNode;
  baseDelay?: number;
  step?: number;
}) {
  return (
    <FadeIn delay={staggerDelay(index, step, baseDelay)} duration={220} offsetY={4}>
      {children}
    </FadeIn>
  );
}
