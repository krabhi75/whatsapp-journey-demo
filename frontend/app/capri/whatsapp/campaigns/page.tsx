import { CapriShell, CapriWaTabs } from '@/components/capri/capri-shell';

export default function CapriCampaignsPage() {
  return (
    <CapriShell>
      <h2 className="mb-6 text-2xl font-semibold">Campaigns</h2>
      <CapriWaTabs active="campaigns" />
      <div className="capri-card p-12 text-center text-sm" style={{ color: 'var(--capri-on-surface-variant)' }}>
        Campaign builder — demo placeholder. Create bulk template sends from qualified leads.
      </div>
    </CapriShell>
  );
}
