import { DocumentsHomeScreen } from "@/features/documents/components/documents-home-screen";
import { listDocumentsForUser } from "@/services/documents/list-documents";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string; demo?: string }>;
}) {
  const { empty, demo } = await searchParams;

  if (empty !== undefined) {
    return <DocumentsHomeScreen documents={[]} />;
  }

  const documents = await listDocumentsForUser();
  return (
    <DocumentsHomeScreen
      documents={documents}
      useDemoFallback={demo !== undefined}
    />
  );
}
