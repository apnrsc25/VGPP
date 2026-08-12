import AvailabilityWorkspace from "@/components/availability/AvailabilityWorkspace";
import { getAvailableWorks } from "@/lib/api/works";

interface AvailabilityPageProps {
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function AvailabilityPage({
  params,
}: AvailabilityPageProps) {
  const { proposalId } = await params;

  const works = await getAvailableWorks();

  return (
    <AvailabilityWorkspace
      works={works}
      proposalId={proposalId}
    />
  );
}