import { DocumentsHomeScreen } from "@/features/documents/components/documents-home-screen";
import { listDocumentsForUser } from "@/services/documents/list-documents";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;

  // `?empty` forces the genuine empty state (no fake/demo documents).
  if (empty !== undefined) {
    return <DocumentsHomeScreen documents={[]} />;
  }

  const documents = await listDocumentsForUser();
  return <DocumentsHomeScreen documents={documents} />;
}
