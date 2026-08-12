import RequirementsWorkspace from "@/components/requirements/RequirementWorkspace";
import { getAvailableWorks } from "@/lib/api/works";
import { getPermissibleWorks } from "@/lib/api/works";

interface RequirementsPageProps {
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function RequirementsPage({
  params,
}: RequirementsPageProps) {
  const { proposalId } = await params;

  const works = await getAvailableWorks();
  const permissibleWorks = await getPermissibleWorks();

  return (
    <RequirementsWorkspace
      works={works}
      permissibleWorks={permissibleWorks}
      proposalId={proposalId}
    />
  );
}