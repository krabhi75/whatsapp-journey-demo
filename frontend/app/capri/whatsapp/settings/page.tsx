import { CapriShell, CapriWaTabs } from '@/components/capri/capri-shell';
import { CapriIcon } from '@/components/capri/capri-icon';

export default function CapriSettingsPage() {
  return (
    <CapriShell>
      <h2 className="mb-6 text-2xl font-semibold">WhatsApp Settings</h2>
      <CapriWaTabs active="settings" />
      <div className="capri-card max-w-xl p-6 space-y-4">
        {[
          { icon: 'cloud_done', title: 'Meta Cloud API', status: 'Connected' },
          { icon: 'business', title: 'WABA', status: 'SwiftCredit Business' },
          { icon: 'webhook', title: 'Webhook URL', status: 'https://api.example.com/webhooks/meta' },
        ].map((row) => (
          <div key={row.title} className="flex items-center gap-3 rounded-lg border p-4" style={{ borderColor: 'var(--capri-outline-variant)' }}>
            <CapriIcon name={row.icon} size={22} className="text-[var(--capri-primary)]" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{row.title}</p>
              <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>{row.status}</p>
            </div>
            <CapriIcon name="check_circle" filled size={20} className="text-emerald-600" />
          </div>
        ))}
      </div>
    </CapriShell>
  );
}
