'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  step: string;
  answers: Record<string, unknown>;
  score?: { leadScore: number; temperature: string; priority?: string; summary: string };
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
  const brand = (health?.brand as string) || 'ABC Finance NBFC';

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#0f172a' }}>{brand} — WhatsApp Customer Service</h1>
      <p style={{ color: '#475569' }}>
        NBFC customer service journey demo. Multiple office phones supported.
      </p>

      <section style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px #0001' }}>
        <h2>Status</h2>
        <p>Safe mode: <strong>{String(health?.safeMode ?? '—')}</strong></p>
        <p>Allowed phones: <strong>{String(health?.allowedPhones ?? '—')}</strong></p>
        <p>Verify token: <strong>{String(health?.verifyToken ?? 'propertypilot2026')}</strong></p>
      </section>

      <section style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px #0001' }}>
        <h2>Meta Webhook</h2>
        <code style={{ display: 'block', background: '#f1f5f9', padding: 12, borderRadius: 8, wordBreak: 'break-all' }}>
          {webhookUrl || `${API}/webhooks/whatsapp`}
        </code>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>Subscribe: <strong>messages</strong> only</p>
      </section>

      <section style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px #0001' }}>
        <h2>Office Demo Script (NBFC)</h2>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Any office phone sends <strong>Hi</strong> to the WhatsApp business number</li>
          <li><strong>1</strong> — New Loan Application</li>
          <li><strong>2</strong> — Home Loan</li>
          <li><strong>2</strong> — ₹5–25 Lakh</li>
          <li><strong>No</strong> — New customer</li>
          <li><strong>1</strong> — Morning callback</li>
          <li>Completion message with priority score appears on WhatsApp + below</li>
        </ol>
        <p style={{ fontSize: 14, color: '#64748b' }}>
          For EMI query path: reply <strong>2</strong> at step 1 — skips loan product questions.
        </p>
      </section>

      <section style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px #0001' }}>
        <h2>Live Customers ({leads.length})</h2>
        {leads.length === 0 && <p style={{ color: '#94a3b8' }}>No sessions yet — send Hi from any office phone.</p>}
        {leads.map((lead) => (
          <div key={lead.id} style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 16 }}>
            <strong>{lead.name}</strong> · +{lead.phone} · {lead.step}
            {lead.score && (
              <span style={{ marginLeft: 8, color: lead.score.priority === 'HIGH' ? '#dc2626' : '#2563eb' }}>
                {lead.score.priority} · {lead.score.leadScore}/100
              </span>
            )}
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
              {lead.messages.slice(-4).map((m, i) => (
                <div key={i}>{m.direction === 'IN' ? '←' : '→'} {m.text.slice(0, 100)}</div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
