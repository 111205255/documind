import { MainAppLayout } from "@/components/layout/main-app-layout";
import { AnimatedPageShell } from "@/components/motion/page-transition";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <MainAppLayout>
      <AnimatedPageShell>{children}</AnimatedPageShell>
    </MainAppLayout>
  );
}
