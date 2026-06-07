export type DocumentListItem = {
  id: string;
  title: string;
  pageCount: number;
  relativeTime: string;
};

export const DEMO_DOCUMENTS: DocumentListItem[] = [
  { id: "1", title: "HR Policy Handbook 2026", pageCount: 64, relativeTime: "2 days ago" },
  { id: "2", title: "DSA — Unit 4 Notes", pageCount: 38, relativeTime: "Yesterday" },
  { id: "3", title: "Microeconomics Textbook", pageCount: 212, relativeTime: "Last week" },
  { id: "4", title: "Hostel Rental Agreement", pageCount: 9, relativeTime: "Today" },
];
