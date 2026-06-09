'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  step: string;
  answers: Record<string, unknown>;
  score?: { leadScore: number; temperature: string; summary: string };
  messages: Array<{ direction: string; text: string; at: string }>;
  updatedAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [h, l] = await Promise.all([
          fetch(`${API}/health`).then((r) => r.json()),
          fetch(`${API}/api/leads`).then((r) => r.json()),
        ]);
        setHealth(h);
        setLeads(l.data ?? []);
      } catch {
        setHealth({ ok: false });
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const webhookUrl = health?.webhookUrl as string | undefined;

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#0f172a' }}>WhatsApp Journey Demo</h1>
      <p style={{ color: '#475569' }}>
        Standalone 5-question qualification flow — no property CRM dependency.
      </p>

      <section style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px #0001' }}>
        <h2>Meta Webhook Config</h2>
        <p><strong>Callback URL:</strong></p>
        <code style={{ display: 'block', background: '#f1f5f9', padding: 12, borderRadius: 8, wordBreak: 'break-all' }}>
          {webhookUrl || `${API}/webhooks/whatsapp`}
        </code>
        <p style={{ marginTop: 12 }}><strong>Verify token:</strong> <code>waba-webhook-verify</code></p>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Subscribe to: <strong>messages</strong> only (you do not need account_alerts, account_update, etc.)
        </p>
      </section>

      <section style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px #0001' }}>
        <h2>Demo Script</h2>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Send <strong>Hi</strong> to your WhatsApp business number</li>
          <li>Reply: <strong>1</strong> (2 BHK) → <strong>2</strong> (60-80L) → <strong>1</strong> (30 Days)</li>
          <li>Reply: <strong>Self Use</strong> → <strong>Yes</strong></li>
          <li>See completion score on WhatsApp + lead appear below</li>
        </ol>
      </section>

      <section style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px #0001' }}>
        <h2>Live Leads ({leads.length})</h2>
        {leads.length === 0 && <p style={{ color: '#94a3b8' }}>No leads yet — send Hi on WhatsApp to start.</p>}
        {leads.map((lead) => (
          <div key={lead.id} style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 16 }}>
            <strong>{lead.name}</strong> · {lead.phone} · Step: {lead.step}
            {lead.score && (
              <span style={{ marginLeft: 8, color: lead.score.temperature === 'HOT' ? '#dc2626' : '#2563eb' }}>
                {lead.score.leadScore}/100 ({lead.score.temperature})
              </span>
            )}
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
              {lead.messages.slice(-4).map((m, i) => (
                <div key={i}>{m.direction === 'IN' ? '←' : '→'} {m.text.slice(0, 80)}</div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
