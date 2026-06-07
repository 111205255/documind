import { ActiveChatScreen } from "@/features/chat/components/active-chat-screen";
import { getDocumentById } from "@/services/documents/get-document-server";

export default async function ActiveChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocumentById(id);

  return (
    <ActiveChatScreen documentId={id} documentTitle={doc?.title ?? "Document"} />
  );
}
