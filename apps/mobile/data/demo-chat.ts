import type { ChatMessage } from "../components/chat/ChatMessageBubble";

export const DEMO_DOC = {
  id: "hr-policy-2026",
  title: "HR Policy Handbook",
  fullTitle: "HR Policy Handbook 2026",
  pages: 64,
};

export const SUGGESTED_QUESTIONS = [
  "What is the leave policy?",
  "Summarize the code of conduct",
  "How many sick days do I get?",
];

export const ACTIVE_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I've read the HR Policy Handbook. Ask me anything and I'll point you to the exact page.",
  },
  {
    id: "2",
    role: "user",
    content: "What does section 5 say about leave?",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Section 5 grants 12 days of paid casual leave per year, accrued monthly. Unused leave does not carry over to the next year.",
    pageTag: "Page 12",
  },
  {
    id: "4",
    role: "user",
    content: "And sick leave?",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "You get 10 paid sick days annually. A medical certificate is required for absences longer than 2 consecutive days.",
    pageTag: "Page 14",
  },
];

export const THINKING_MESSAGES: ChatMessage[] = [
  { id: "u1", role: "user", content: "Can I carry forward unused leave?" },
  {
    id: "t1",
    role: "thinking",
    content: "Searching the document...",
    thinkingVariant: "dots",
  },
  {
    id: "t2",
    role: "thinking",
    content: "Scanning pages 10–15",
    thinkingVariant: "scanning",
  },
];

export const CITATION_EXCERPT =
  "All permanent employees are entitled to 12 days of paid casual leave per calendar year, accrued at the rate of one day per month. Casual leave not availed within the year shall lapse and cannot be carried forward to the following year.";
