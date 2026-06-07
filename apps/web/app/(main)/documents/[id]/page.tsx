import { DocumentDetailScreen } from "@/features/documents/components/document-detail-screen";
import { getDocumentById } from "@/services/documents/get-document-server";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocumentById(id);
  return <DocumentDetailScreen id={id} title={doc?.title} status={doc?.status} />;
}
