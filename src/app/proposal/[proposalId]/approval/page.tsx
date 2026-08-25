import ApprovalWorkspace from "@/components/approval/ApprovalWorkspace";
import { getPermissibleWorks } from "@/lib/api/works";

interface ApprovalPageProps {
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function ApprovalPage({ params }: ApprovalPageProps) {
  const { proposalId } = await params;

  const permissibleWorks = await getPermissibleWorks();

  return <ApprovalWorkspace proposalId={proposalId} selectedWorks={permissibleWorks} />;
}