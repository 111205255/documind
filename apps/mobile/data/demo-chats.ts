export type ChatThreadItem = {
  id: string;
  documentId: string;
  title: string;
  preview: string;
  relativeTime: string;
};

export const DEMO_CHAT_THREADS: ChatThreadItem[] = [
  {
    id: "1",
    documentId: "hr-policy-2026",
    title: "HR Policy Handbook 2026",
    preview: "How many sick days do I get?",
    relativeTime: "2h ago",
  },
  {
    id: "2",
    documentId: "dsa-unit-4",
    title: "DSA — Unit 4 Notes",
    preview: "Explain Dijkstra's algorithm",
    relativeTime: "Yesterday",
  },
  {
    id: "3",
    documentId: "microeconomics",
    title: "Microeconomics Textbook",
    preview: "What is price elasticity?",
    relativeTime: "3d ago",
  },
  {
    id: "4",
    documentId: "hostel-rental",
    title: "Hostel Rental Agreement",
    preview: "Can the landlord raise rent?",
    relativeTime: "Last week",
  },
];
