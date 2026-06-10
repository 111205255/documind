import { DocumentDetailScreen } from "@/features/documents/components/document-detail-screen";
import { getDocumentById } from "@/services/documents/get-document-server";
import { getDocumentQuestionCount } from "@/services/documents/get-document-stats";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocumentById(id);
  const questionsCount = doc ? await getDocumentQuestionCount(id) : 0;

  return (
    <DocumentDetailScreen
      id={id}
      title={doc?.title}
      mimeType={doc?.mime_type}
      pageCount={doc?.page_count}
      fileSizeBytes={doc?.file_size_bytes}
      updatedAt={doc?.updated_at}
      questionsCount={questionsCount}
    />
  );
}
