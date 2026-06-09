'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { formatCapriPhone, leadInitials, type CapriLead } from '@/lib/capri-demo-data';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';
import { CapriShell } from './capri-shell';

function ScoreBadge({ lead }: { lead: CapriLead }) {
  const cls =
    lead.temperature === 'HOT'
      ? 'capri-pill-hot'
      : lead.temperature === 'WARM'
        ? 'capri-pill-warm'
        : 'capri-pill-cold';
  return (
    <span className={`capri-pill ${cls}`}>
      {lead.temperature} · {lead.score || '—'}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    CALLBACK_REQUESTED: '#d97706',
    QUALIFYING: '#3b82f6',
    QUALIFIED: '#059669',
    NEW: '#94a3b8',
  };
  return (
    <span className="flex items-center gap-2 text-xs font-semibold">
      <span className="h-2 w-2 rounded-full" style={{ background: colors[status] ?? '#94a3b8' }} />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function CapriLeadsPage() {
  const router = useRouter();
  const { leads, trashLeads, moveToTrash, apiConnected } = useCapriDemo();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.product.toLowerCase().includes(q)
    );
  }, [leads, search]);

  function toggleAll() {
    if (filtered.every((l) => selected.has(l.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.id)));
    }
  }

  return (
    <CapriShell
      title="Capri WhatsApp Demo"
      breadcrumbs={[{ label: 'CRM Hub', href: '/capri/leads' }, { label: 'Leads Overview' }]}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lead Management</h2>
          <p className="text-sm text-[var(--capri-on-surface-variant)]">
            {filtered.length} leads {apiConnected ? '· syncing live from WhatsApp' : '· demo data'}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="capri-btn-outline">
            <CapriIcon name="upload_file" size={18} />
            Import CSV
          </button>
          <Link href="/capri/leads/new" className="capri-btn-primary">
            <CapriIcon name="add" size={18} />
            Add Lead
          </Link>
        </div>
      </div>

      <div
        className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border p-4"
        style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-lowest)' }}
      >
        <div className="relative min-w-[200px] flex-1">
          <CapriIcon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            className="capri-input pl-10"
            placeholder="Filter by name, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {['All Stages', 'Lead Source', 'Temperature', 'All Products'].map((f) => (
          <select key={f} className="capri-input capri-select w-auto min-w-[140px] text-sm">
            <option>{f}</option>
          </select>
        ))}
        <button type="button" className="capri-btn-outline px-3">
          <CapriIcon name="tune" size={18} />
        </button>
      </div>

      <div className="capri-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="capri-table">
            <thead>
              <tr>
                <th className="w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && filtered.every((l) => selected.has(l.id))}
                    onChange={toggleAll}
                  />
                </th>
                <th>Lead Name</th>
                <th>Contact</th>
                <th>Product</th>
                <th>Loan Amount</th>
                <th>Score</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th className="w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/capri/leads/${lead.id}`)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => {
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(lead.id)) next.delete(lead.id);
                          else next.add(lead.id);
                          return next;
                        });
                      }}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: 'var(--capri-secondary-container)', color: 'var(--capri-on-secondary-container)' }}
                      >
                        {leadInitials(lead.name)}
                      </div>
                      <span className="font-semibold">{lead.name}</span>
                      {lead.isLive && (
                        <span className="capri-pill capri-pill-live ml-1 text-[9px]">Live</span>
                      )}
                    </div>
                  </td>
                  <td className="text-xs">{formatCapriPhone(lead.phone)}</td>
                  <td>
                    <span className="capri-pill capri-pill-status text-[10px]">{lead.product}</span>
                  </td>
                  <td className="font-medium">{lead.loanAmount}</td>
                  <td>
                    {lead.score > 0 ? <ScoreBadge lead={lead} /> : <span className="text-xs opacity-50">—</span>}
                  </td>
                  <td>
                    <StatusDot status={lead.status} />
                  </td>
                  <td>
                    <div className="text-xs">
                      <p>{lead.lastActivity}</p>
                      {lead.lastActivityDetail && (
                        <p className="flex items-center gap-1 opacity-60">
                          <CapriIcon name="done_all" size={14} />
                          {lead.lastActivityDetail}
                        </p>
                      )}
                    </div>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="rounded p-1.5 hover:bg-red-50"
                      title="Move to trash"
                      onClick={() => {
                        if (confirm(`Move "${lead.name}" to trash?`)) moveToTrash(lead.id);
                      }}
                    >
                      <CapriIcon name="delete" size={18} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="flex items-center justify-between px-5 py-3 text-xs"
          style={{ color: 'var(--capri-on-surface-variant)' }}
        >
          <span>
            Showing 1–{filtered.length} of {leads.length} leads
          </span>
          <div className="flex items-center gap-1">
            <button type="button" className="rounded px-2 py-1 hover:bg-black/5">‹</button>
            <span className="rounded px-2 py-1 font-semibold" style={{ background: 'var(--capri-primary)', color: '#fff' }}>1</span>
            <button type="button" className="rounded px-2 py-1 hover:bg-black/5">›</button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total High Intent', value: '142', trend: '+12%', icon: 'local_fire_department' },
          { label: 'Pending Callbacks', value: '28', sub: 'On track', icon: 'phone_callback' },
          { label: 'WhatsApp Conversion', value: '64%', sub: 'High', icon: 'chat' },
          { label: 'Avg. Loan Requested', value: '₹12.4L', sub: 'FY', icon: 'payments' },
        ].map((card) => (
          <div key={card.label} className="capri-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                {card.label}
              </p>
              <CapriIcon name={card.icon} size={20} className="opacity-40" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            {card.trend && <p className="text-xs font-semibold text-emerald-600">{card.trend}</p>}
            {card.sub && <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>{card.sub}</p>}
          </div>
        ))}
      </div>

      <Link
        href="/capri/leads/trash"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
        style={{ color: 'var(--capri-on-surface-variant)' }}
      >
        <CapriIcon name="delete" size={16} />
        View Trash ({trashLeads.length})
      </Link>
    </CapriShell>
  );
}
