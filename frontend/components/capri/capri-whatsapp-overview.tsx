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
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--capri-on-surface-variant)' }}>
        Mission Control
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">WhatsApp Overview</h2>
          <p className="text-sm" style={{ color: 'var(--capri-on-surface-variant)' }}>
            Real-time KPIs, funnel, and delivery health
          </p>
        </div>
        <div
          className="flex rounded-lg p-1"
          style={{ background: 'var(--capri-surface-container-high)' }}
        >
          {(['today', '7d', '30d'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className="rounded-md px-4 py-1.5 text-sm font-semibold capitalize"
              style={{
                background: period === p ? 'var(--capri-surface-lowest)' : 'transparent',
                color: period === p ? 'var(--capri-primary)' : 'var(--capri-on-surface-variant)',
                boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.08)' : undefined,
              }}
            >
              {p === '7d' ? '7d' : p === '30d' ? '30d' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      <CapriWaTabs active="overview" />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="capri-card p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
              {kpi.label}
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
                {kpi.sub && (
                  <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    {kpi.sub}
                  </p>
                )}
                {kpi.trend && (
                  <p className="text-xs font-semibold text-emerald-600">{kpi.trend}</p>
                )}
                {kpi.hot && (
                  <span className="capri-pill mt-1" style={{ background: '#d97706', color: '#fff' }}>
                    Hot
                  </span>
                )}
              </div>
              {kpi.spark && (
                <svg width="48" height="24" viewBox="0 0 48 24" className="opacity-40">
                  <polyline
                    fill="none"
                    stroke="var(--capri-primary)"
                    strokeWidth="2"
                    points="0,20 12,14 24,16 36,8 48,4"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="capri-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
              Connection Health
            </h3>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <div className="space-y-3">
            {[
              { icon: 'cloud_done', title: 'Meta Cloud API', sub: 'Connected & Authenticated', ok: true },
              { icon: 'business', title: 'WABA Account', sub: 'SwiftCredit Business · +91 98XXX XXXXX', ok: true },
              { icon: 'webhook', title: 'Webhook Status', sub: 'Active · Last event 2m ago', ok: true },
            ].map((row) => (
              <div
                key={row.title}
                className="flex items-center gap-3 rounded-lg border p-3"
                style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-low)' }}
              >
                <CapriIcon name={row.icon} size={22} className="text-[var(--capri-primary)]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{row.title}</p>
                  <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    {row.sub}
                  </p>
                </div>
                {row.ok && <CapriIcon name="check_circle" filled size={20} className="text-emerald-600" />}
              </div>
            ))}
          </div>
          <Link href="/capri/whatsapp/settings" className="mt-4 inline-flex text-sm font-semibold" style={{ color: 'var(--capri-primary)' }}>
            Open Settings →
          </Link>
        </div>

        <div className="capri-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
              Qualification Funnel
            </h3>
            <button type="button" className="text-xs font-semibold" style={{ color: 'var(--capri-primary)' }}>
              Download Report
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {FUNNEL.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: 'var(--capri-primary)' }}>
                    {stage.value}
                  </p>
                  <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    {stage.label}
                  </p>
                </div>
                {i < FUNNEL.length - 1 && (
                  <CapriIcon name="arrow_forward" size={16} className="opacity-30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="capri-card overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--capri-outline-variant)' }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
            Recent Message Activity
          </h3>
          <Link href="/capri/whatsapp/logs" className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--capri-primary)' }}>
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
                    <Link href={`/capri/leads/${log.leadId}`} className="font-semibold hover:underline" style={{ color: 'var(--capri-primary)' }}>
                      {log.leadName}
                    </Link>
                  </td>
                  <td>
                    <span className={`capri-pill ${log.direction === 'INBOUND' ? 'capri-pill-inbound' : 'capri-pill-outbound'}`}>
                      {log.direction === 'INBOUND' ? 'Inbound' : 'Outbound'}
                    </span>
                  </td>
                  <td className="font-mono text-xs">{log.template ?? '—'}</td>
                  <td className="max-w-xs truncate text-xs">{log.message}</td>
                  <td>
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: log.status === 'READ' ? '#3b82f6' : 'var(--capri-on-surface-variant)' }}>
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
