'use client';

import Link from 'next/link';
import { useCapriDemo } from './capri-demo-context';
import { CapriShell, CapriWaTabs } from './capri-shell';

export function CapriLogsPage() {
  const { messages, leads } = useCapriDemo();

  const logs = messages
    .map((m) => {
      const lead = leads.find((l) => l.id === m.leadId);
      return {
        ...m,
        leadName: lead?.name ?? 'Unknown',
        phone: lead?.phone ?? '',
      };
    })
    .reverse();

  return (
    <CapriShell>
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--capri-on-surface-variant)' }}>
        Mission Control
      </div>
      <h2 className="mb-6 text-2xl font-semibold">Message Logs</h2>

      <CapriWaTabs active="logs" />

      <div className="capri-card overflow-hidden">
        <table className="capri-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Lead</th>
              <th>Direction</th>
              <th>Template</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm opacity-50">
                  No messages yet
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap text-xs">{log.time}</td>
                  <td>
                    <Link
                      href={`/capri/leads/${log.leadId}`}
                      className="font-semibold hover:underline"
                      style={{ color: 'var(--capri-primary)' }}
                    >
                      {log.leadName}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={`capri-pill text-[10px] ${log.direction === 'INBOUND' ? 'capri-pill-inbound' : 'capri-pill-outbound'}`}
                    >
                      {log.direction === 'INBOUND' ? 'Inbound' : 'Outbound'}
                    </span>
                  </td>
                  <td className="font-mono text-xs">{log.template ?? '—'}</td>
                  <td className="max-w-md truncate text-xs">{log.text}</td>
                  <td className="text-xs font-semibold">{log.status ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CapriShell>
  );
}
