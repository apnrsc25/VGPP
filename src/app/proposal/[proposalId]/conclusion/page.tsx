import ConclusionWorkspace from "@/components/conclusion/ConclusionWorkspace";

interface ConclusionPageProps {
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function ConclusionPage({
  params,
}: ConclusionPageProps) {
  const { proposalId } = await params;

  return <ConclusionWorkspace proposalId={proposalId} />;
}