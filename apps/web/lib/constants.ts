export const APP_NAME = "DocuMind";
export const APP_TAGLINE = "Ask anything. Know everything.";

/** Mobile design reference width from Figma */
export const DESIGN_WIDTH_PX = 390;

export const ROUTES = {
  splash: "/",
  login: "/login",
  home: "/home",
  upload: "/documents/upload",
  document: (id: string) => `/documents/${id}`,
  processing: (id: string) => `/documents/${id}/processing`,
  chat: "/chat",
  chatThread: (id: string) => `/chat/${id}`,
  chatHistory: "/chat/history",
  settings: "/settings",
  offline: "/offline",
} as const;

export const NAV_ITEMS = [
  { href: ROUTES.home, label: "Documents", icon: "documents" as const },
  { href: ROUTES.chat, label: "Chat", icon: "chat" as const },
  { href: ROUTES.settings, label: "Settings", icon: "settings" as const },
] as const;
