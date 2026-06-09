import { CapriLeadProfile } from '@/components/capri/capri-lead-profile';

export default async function CapriLeadProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CapriLeadProfile leadId={id} />;
}
