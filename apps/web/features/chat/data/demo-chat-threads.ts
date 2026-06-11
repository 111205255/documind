import type { ThreadListItem } from "@/services/chat/persistence";

/** Figma frame 12 — demo history rows for empty-state showcase */
export const DEMO_CHAT_THREADS: ThreadListItem[] = [
  {
    id: "demo-1",
    documentId: "hr-policy-2026",
    title: "HR Policy Handbook 2026",
    preview: "How many sick days do I get?",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2",
    documentId: "dsa-unit-4",
    title: "DSA — Unit 4 Notes",
    preview: "Explain Dijkstra's algorithm",
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    documentId: "microeconomics",
    title: "Microeconomics Textbook",
    preview: "What is price elasticity?",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-4",
    documentId: "hostel-rental",
    title: "Hostel Rental Agreement",
    preview: "Can the landlord raise rent?",
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-5",
    documentId: "startup-pitch",
    title: "Startup Pitch Deck",
    preview: "Summarize the go-to-market plan",
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
