"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type UploadModalContextValue = {
  open: boolean;
  openUpload: () => void;
  closeUpload: () => void;
};

const UploadModalContext = createContext<UploadModalContextValue | null>(null);

export function UploadModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openUpload = useCallback(() => setOpen(true), []);
  const closeUpload = useCallback(() => setOpen(false), []);

  return (
    <UploadModalContext.Provider value={{ open, openUpload, closeUpload }}>
      {children}
    </UploadModalContext.Provider>
  );
}

export function useUploadModal() {
  const ctx = useContext(UploadModalContext);
  if (!ctx) throw new Error("useUploadModal must be used within UploadModalProvider");
  return ctx;
}
