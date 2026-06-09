'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LeadAnswers {
  referenceId?: string;
  [key: string]: string | number | boolean | undefined;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  step: string;
  answers: LeadAnswers;
  score?: { leadScore: number; temperature: string; priority?: string; summary: string };
  messages: Array<{ direction: string; text: string; at: string }>;
  updatedAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const FLOWS = [
  {
    title: '🏆 Gold Loan (full journey)',
    steps: ['Hi', '1', '2', 'Pune', '1', 'Nahi', '2'],
    desc: 'Gold Loan → amount → city → urgent → new customer → afternoon callback',
  },
  {
    title: '🏠 Home Loan',
    steps: ['Hi', '2', '2', 'Delhi', '3', 'Haan', '1'],
    desc: 'Home Loan path with existing customer',
  },
  {
    title: '💳 EMI / Pay Now',
    steps: ['Hi', '5', '1'],
    desc: 'Instant Pay Now app link',
  },
  {
    title: '📍 Branch locator',
    steps: ['Hi', '6', '1', 'Mumbai'],
    desc: 'Find nearest Capri branch',
  },
  {
    title: '🎫 Complaint (priority)',
    steps: ['Hi', '6', '4', '3'],
    desc: 'High-priority complaint flow',
  },
];

export default function ClassicDemoPage() {
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
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  const brand = (health?.brand as string) || 'Capri Global';

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'system-ui' }}>
      <p style={{ marginBottom: 16 }}>
        <Link href="/capri/whatsapp" style={{ color: '#00685f', fontWeight: 600 }}>
          ← Back to Stitch UI (Capri Demo)
        </Link>
      </p>
      <h1 style={{ color: '#1e3a5f' }}>{brand} — WhatsApp AI Demo</h1>
      <p style={{ color: '#64748b' }}>
        Dynamic Capri Loans journey · Hinglish · Multi-flow · Live API sessions
      </p>

      <section style={card}>
        <h2>Capri Products (from capriloans.in)</h2>
        <ul style={{ lineHeight: 1.9 }}>
          <li>🏆 Gold Loan — ₹3K to ₹30L · instant disbursal</li>
          <li>🏠 Home Loan — ₹5L to ₹150L</li>
          <li>💼 MSME Loan — up to ₹150L</li>
          <li>🏗️ Micro LAP — up to ₹10L</li>
          <li>🔨 Construction Finance</li>
        </ul>
      </section>

      <section style={card}>
        <h2>Demo Flows for Office Presentation</h2>
        {FLOWS.map((f) => (
          <div key={f.title} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
            <strong>{f.title}</strong>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0' }}>{f.desc}</p>
            <code style={{ fontSize: 12, background: '#f1f5f9', padding: '4px 8px', borderRadius: 4 }}>
              {f.steps.join(' → ')}
            </code>
          </div>
        ))}
      </section>

      <section style={card}>
        <h2>Live Sessions ({leads.length})</h2>
        {leads.length === 0 && <p style={{ color: '#94a3b8' }}>Send Hi from any office phone to start.</p>}
        {leads.map((lead) => (
          <div key={lead.id} style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 12 }}>
            <div>
              <strong>{lead.name}</strong> · +{lead.phone} · <em>{lead.step}</em>
              {lead.answers.referenceId ? (
                <span style={{ marginLeft: 8, fontSize: 12, color: '#6366f1' }}>
                  {lead.answers.referenceId}
                </span>
              ) : null}
              {lead.score ? (
                <span style={{ marginLeft: 8, color: lead.score.priority === 'HIGH' ? '#dc2626' : '#2563eb' }}>
                  {lead.score.priority} · {lead.score.leadScore}/100
                </span>
              ) : null}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, maxHeight: 120, overflow: 'auto' }}>
              {lead.messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 2 }}>
                  {m.direction === 'IN' ? '←' : '→'} {m.text.slice(0, 120)}
                  {m.text.length > 120 ? '…' : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
