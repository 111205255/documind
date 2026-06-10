"use client";

import { useEffect, useState } from "react";

export type ThinkingPhase = "searching" | "scanning";

function randomScanRange(): string {
  const start = Math.floor(Math.random() * 18) + 1;
  const span = Math.floor(Math.random() * 6) + 4;
  return `${start}–${start + span}`;
}

/** Cycles searching → scanning while the model is working (frame 10). */
export function useThinkingPhase(thinking: boolean) {
  const [phase, setPhase] = useState<ThinkingPhase>("searching");
  const [scanRange, setScanRange] = useState("10–15");

  useEffect(() => {
    if (!thinking) {
      setPhase("searching");
      return;
    }

    setPhase("searching");
    setScanRange(randomScanRange());

    const timer = window.setTimeout(() => setPhase("scanning"), 1400);
    return () => window.clearTimeout(timer);
  }, [thinking]);

  return { phase, scanRange };
}
