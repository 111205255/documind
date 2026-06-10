import { notFound } from "next/navigation";
import { ChatDashboardScreen } from "@/features/chat/components/chat-dashboard-screen";
import { getDocumentById } from "@/services/documents/get-document-server";

export default async function ActiveChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocumentById(id);
  if (!doc) notFound();

  return (
    <ChatDashboardScreen
      documentId={id}
      documentTitle={doc.title}
      pageCount={doc.page_count || undefined}
    />
  );
}
