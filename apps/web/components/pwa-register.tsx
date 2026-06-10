"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        void registration.update();
      })
      .catch(() => {
        // Non-fatal in dev or unsupported browsers.
      });
  }, []);

  return null;
}
