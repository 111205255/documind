import { MainAppLayout } from "@/components/layout/main-app-layout";
import { PageTransition } from "@/components/motion/page-transition";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <MainAppLayout>
      <PageTransition>{children}</PageTransition>
    </MainAppLayout>
  );
}
