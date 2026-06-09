'use client';

import Link from 'next/link';
import { formatCapriPhone } from '@/lib/capri-demo-data';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';
import { CapriShell } from './capri-shell';

export function CapriCallbacksPage() {
  const { leads, messages } = useCapriDemo();

  const callbacks = leads
    .filter((l) => l.status === 'CALLBACK_REQUESTED')
    .map((lead) => {
      const msg = messages.find((m) => m.leadId === lead.id && m.callbackCaptured);
      return { lead, msg };
    });

  return (
    <CapriShell title="Calls & Callbacks">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Callback Inbox · Today</h2>
        <p className="text-sm" style={{ color: 'var(--capri-on-surface-variant)' }}>
          WhatsApp callback requests captured from test leads
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {callbacks.length === 0 ? (
          <div className="capri-card col-span-full p-12 text-center text-sm opacity-50">
            No callback requests yet
          </div>
        ) : (
          callbacks.map(({ lead, msg }) => (
            <div key={lead.id} className="capri-card p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <Link href={`/capri/leads/${lead.id}`} className="text-lg font-bold hover:underline" style={{ color: 'var(--capri-primary)' }}>
                    {lead.name}
                  </Link>
                  <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    {lead.product} · {formatCapriPhone(lead.phone)}
                  </p>
                </div>
                <span className="capri-pill capri-pill-hot text-[10px]">HOT</span>
              </div>
              <p className="mb-4 rounded-lg border p-3 text-sm italic" style={{ borderColor: 'var(--capri-outline-variant)' }}>
                &ldquo;{msg?.text ?? 'Callback requested'}&rdquo;
              </p>
              <p className="mb-4 text-xs opacity-60">{msg?.time ?? 'Recently'}</p>
              <div className="flex gap-2">
                <button type="button" className="capri-btn-primary flex-1 py-2 text-xs">
                  <CapriIcon name="call" size={16} />
                  Assign & Call
                </button>
                <button type="button" className="capri-btn-outline flex-1 py-2 text-xs">
                  Mark Contacted
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </CapriShell>
  );
}
