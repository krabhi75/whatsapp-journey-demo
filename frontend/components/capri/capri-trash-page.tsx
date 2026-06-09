'use client';

import Link from 'next/link';
import { formatCapriPhone, leadInitials } from '@/lib/capri-demo-data';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';
import { CapriShell } from './capri-shell';

export function CapriTrashPage() {
  const { trashLeads, restoreLead, purgeLead } = useCapriDemo();

  return (
    <CapriShell
      breadcrumbs={[
        { label: 'Leads', href: '/capri/leads' },
        { label: 'Trash' },
      ]}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Lead Trash</h2>
        <p className="text-sm" style={{ color: 'var(--capri-on-surface-variant)' }}>
          Soft-deleted leads — restore or permanently remove test data
        </p>
      </div>

      <div className="capri-card overflow-hidden">
        <table className="capri-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Deleted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trashLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm opacity-50">
                  Trash is empty
                </td>
              </tr>
            ) : (
              trashLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: 'var(--capri-surface-container-high)' }}
                      >
                        {leadInitials(lead.name)}
                      </div>
                      {lead.name}
                    </div>
                  </td>
                  <td className="text-xs">{formatCapriPhone(lead.phone)}</td>
                  <td>
                    <span className="capri-pill capri-pill-status text-[10px]">{lead.product}</span>
                  </td>
                  <td className="text-xs">
                    {lead.deletedAt
                      ? new Date(lead.deletedAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="capri-btn-outline px-3 py-1.5 text-xs"
                        onClick={() => restoreLead(lead.id)}
                      >
                        <CapriIcon name="restore" size={16} />
                        Restore
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (
                            confirm(
                              `Permanently delete "${lead.name}"? This cannot be undone.`
                            )
                          ) {
                            purgeLead(lead.id);
                          }
                        }}
                      >
                        Delete Forever
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Link href="/capri/leads" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--capri-primary)' }}>
        <CapriIcon name="arrow_back" size={16} />
        Back to Lead Management
      </Link>
    </CapriShell>
  );
}
