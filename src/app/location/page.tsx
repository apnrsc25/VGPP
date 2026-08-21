import LocationSelectionWorkspace from "@/components/location/LocationSelectionWorkspace";

interface LocationPageProps {
  params: Promise<{
    proposalId: string;
  }>;
}

export default async function LocationPage({
  params,
}: LocationPageProps) {
  const { proposalId } = await params;

  return (
    <LocationSelectionWorkspace
      proposalId={proposalId}
    />
  );
}