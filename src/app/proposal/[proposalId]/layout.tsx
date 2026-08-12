import ProposalLayoutContent from "@/components/common/ProposalLayoutContent";

interface ProposalLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function ProposalLayout({
  children,
  params,
}: ProposalLayoutProps) {
  await params;

  return (
    <ProposalLayoutContent>
      {children}
    </ProposalLayoutContent>
  );
}