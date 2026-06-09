'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SEED_MESSAGE_LOGS } from '@/lib/capri-demo-data';
import { CapriIcon } from './capri-icon';
import { CapriShell, CapriWaTabs } from './capri-shell';

const KPIS = [
  { label: 'Messages Sent', value: '142', trend: '+12%', spark: false },
  { label: 'Delivered', value: '138', sub: '97% Rate', spark: true },
  { label: 'Read', value: '91', sub: '64% Engagement', spark: true },
  { label: 'Inbound Replies', value: '47', trend: '+8%', spark: false },
  { label: 'Callbacks', value: '12', hot: true, spark: false },
];

const FUNNEL = [
  { label: 'Sent', value: 120 },
  { label: 'Replied', value: 47 },
  { label: 'Type Captured', value: 38 },
  { label: 'Amount Captured', value: 32 },
  { label: 'Callbacks', value: 12 },
  { label: 'Qualified', value: 9 },
];

export function CapriWhatsAppOverview() {
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('7d');

  return (
    <CapriShell searchPlaceholder="Search across communications...">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--capri-on-surface-variant)]">
        Mission Control
      </p>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--capri-on-surface)] md:text-3xl">
            WhatsApp Overview
          </h2>
          <p className="mt-1 text-sm text-[var(--capri-on-surface-variant)]">
            Real-time KPIs, funnel, and delivery health
          </p>
        </div>
        <div className="capri-period-toggle">
          {(['today', '7d', '30d'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`capri-period-btn ${period === p ? 'active' : ''}`}
            >
              {p === '7d' ? '7d' : p === '30d' ? '30d' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      <CapriWaTabs active="overview" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="capri-card capri-card-kpi p-4 sm:p-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--capri-on-surface-variant)]">
              {kpi.label}
            </p>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">{kpi.value}</p>
                {kpi.sub && <p className="text-xs text-[var(--capri-on-surface-variant)]">{kpi.sub}</p>}
                {kpi.trend && <p className="text-xs font-semibold text-emerald-600">{kpi.trend}</p>}
                {kpi.hot && <span className="capri-pill capri-pill-warm mt-1">Hot</span>}
              </div>
              {kpi.spark && (
                <svg width="40" height="20" viewBox="0 0 48 24" className="shrink-0 opacity-30">
                  <polyline fill="none" stroke="var(--capri-primary)" strokeWidth="2" points="0,20 12,14 24,16 36,8 48,4" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="capri-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--capri-on-surface-variant)]">
              Connection Health
            </h3>
            <span className="capri-pill capri-pill-live">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <div className="space-y-3">
            {[
              { icon: 'cloud_done', title: 'Meta Cloud API', sub: 'Connected & Authenticated' },
              { icon: 'business', title: 'WABA Account', sub: 'Capri Global Business · +91 98XXX XXXXX' },
              { icon: 'webhook', title: 'Webhook Status', sub: 'Active · Last event 2m ago' },
            ].map((row) => (
              <div key={row.title} className="capri-health-row">
                <CapriIcon name={row.icon} size={22} className="text-[var(--capri-primary)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{row.title}</p>
                  <p className="truncate text-xs text-[var(--capri-on-surface-variant)]">{row.sub}</p>
                </div>
                <CapriIcon name="check_circle" filled size={20} className="shrink-0 text-emerald-600" />
              </div>
            ))}
          </div>
          <Link href="/capri/whatsapp/settings" className="mt-4 inline-flex text-sm font-semibold text-[var(--capri-primary)] hover:underline">
            Open Settings →
          </Link>
        </div>

        <div className="capri-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--capri-on-surface-variant)]">
              Qualification Funnel
            </h3>
            <button type="button" className="text-xs font-semibold text-[var(--capri-primary)] hover:underline">
              Download Report
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {FUNNEL.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2">
                <div className="capri-funnel-step min-w-[72px]">
                  <p className="text-lg font-bold text-[var(--capri-primary)]">{stage.value}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--capri-on-surface-variant)]">
                    {stage.label}
                  </p>
                </div>
                {i < FUNNEL.length - 1 && (
                  <CapriIcon name="arrow_forward" size={16} className="capri-funnel-arrow hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="capri-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--capri-outline-variant)] px-5 py-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--capri-on-surface-variant)]">
            Recent Message Activity
          </h3>
          <Link href="/capri/whatsapp/logs" className="flex items-center gap-1 text-sm font-semibold text-[var(--capri-primary)] hover:underline">
            View All Logs
            <CapriIcon name="arrow_forward" size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="capri-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Contact</th>
                <th>Direction</th>
                <th>Template</th>
                <th>Message Content</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SEED_MESSAGE_LOGS.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap text-xs">{log.timestamp}</td>
                  <td>
                    <Link href={`/capri/leads/${log.leadId}`} className="font-semibold text-[var(--capri-primary)] hover:underline">
                      {log.leadName}
                    </Link>
                  </td>
                  <td>
                    <span className={`capri-pill ${log.direction === 'INBOUND' ? 'capri-pill-inbound' : 'capri-pill-outbound'}`}>
                      {log.direction === 'INBOUND' ? 'Inbound' : 'Outbound'}
                    </span>
                  </td>
                  <td className="font-mono text-xs">{log.template ?? '—'}</td>
                  <td className="max-w-[200px] truncate text-xs lg:max-w-xs">{log.message}</td>
                  <td>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${log.status === 'READ' ? 'text-blue-600' : 'text-[var(--capri-on-surface-variant)]'}`}>
                      <CapriIcon name="done_all" filled={log.status === 'READ'} size={16} />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CapriShell>
  );
}
