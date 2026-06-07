import { ProcessingScreen } from "@/features/documents/components/processing-screen";

export default async function ProcessingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProcessingScreen documentId={id} />;
}
