import VGPPDashboard from "@/components/dashboard/VGPPDashboard";


interface DashboardPageProps {
  searchParams: Promise<{
    proposalId?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  const proposalId = params.proposalId ?? "";

  return (
    <VGPPDashboard proposalId={proposalId} />
  );
}