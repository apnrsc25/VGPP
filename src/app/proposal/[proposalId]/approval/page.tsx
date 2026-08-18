import ApprovalWorkspace from "@/components/approval/ApprovalWorkspace";

interface ApprovalPageProps {
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function ApprovalPage({
  params,
}: ApprovalPageProps) {
  const { proposalId } = await params;

  return (
    <ApprovalWorkspace proposalId={proposalId} />
  );
}