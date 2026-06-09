'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatCapriPhone, type CapriWaMessage } from '@/lib/capri-demo-data';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';

function WaBubble({ msg }: { msg: CapriWaMessage }) {
  const isOut = msg.direction === 'OUTBOUND';
  return (
    <div className={`max-w-[80%] ${isOut ? 'self-end' : 'self-start'}`}>
      <div
        className={`rounded-2xl border p-3 ${isOut ? 'capri-wa-bubble-out' : 'capri-wa-bubble-in'} ${msg.callbackCaptured ? 'ring-2 ring-teal-500/20' : ''}`}
        style={{
          background: isOut ? 'var(--capri-surface-low)' : '#fff',
          borderColor: 'var(--capri-outline-variant)',
        }}
      >
        {msg.template && (
          <p className="mb-1 text-[11px] font-semibold uppercase" style={{ color: 'var(--capri-primary)' }}>
            {msg.template} (Template)
          </p>
        )}
        {msg.callbackCaptured && (
          <span
            className="mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight"
            style={{ background: 'rgba(0,104,95,0.1)', color: 'var(--capri-primary)' }}
          >
            Callback Captured
          </span>
        )}
        <p className="text-sm">{msg.text}</p>
        {msg.template === 'callback_request' && isOut && (
          <div
            className="mt-3 cursor-pointer rounded-lg py-2 text-center text-sm font-semibold text-white"
            style={{ background: 'var(--capri-primary)' }}
          >
            Yes, Request Callback
          </div>
        )}
        <div className={`mt-1 flex items-center gap-1 ${isOut ? 'justify-end' : ''}`}>
          <span className="text-[10px]" style={{ color: 'var(--capri-on-surface-variant)' }}>
            {msg.time}
          </span>
          {isOut && (
            <CapriIcon
              name="done_all"
              filled={msg.status === 'READ'}
              size={16}
              className={msg.status === 'READ' ? 'text-blue-500' : 'opacity-50'}
            />
          )}
          {!isOut && (
            <CapriIcon name="done_all" filled size={16} className="text-[var(--capri-primary)]" />
          )}
        </div>
      </div>
    </div>
  );
}

const TIMELINE_COLORS = {
  primary: 'var(--capri-primary)',
  secondary: 'var(--capri-secondary)',
  tertiary: 'var(--capri-tertiary)',
  muted: 'var(--capri-outline-variant)',
};

export function CapriLeadProfile({ leadId }: { leadId: string }) {
  const router = useRouter();
  const { getLead, getMessages, getTimeline, moveToTrash, templates } = useCapriDemo();
  const lead = getLead(leadId);
  const messages = getMessages(leadId);
  const timeline = getTimeline(leadId);
  const [selectedTemplate, setSelectedTemplate] = useState('callback_request');

  if (!lead) {
    return (
      <div className="capri-app flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="text-lg font-semibold">Lead not found</p>
        <Link href="/capri/leads" className="capri-btn-primary">
          Back to Leads
        </Link>
      </div>
    );
  }

  const activeTemplates = templates.filter((t) => t.active);

  return (
    <div className="capri-app overflow-hidden">
      <nav
        className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b px-6"
        style={{ background: 'var(--capri-surface)', borderColor: 'var(--capri-outline-variant)' }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/capri/leads"
            className="flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: 'var(--capri-on-surface-variant)' }}
          >
            <CapriIcon name="arrow_back" size={20} />
            Back to Lead Management
          </Link>
          <div className="h-6 w-px" style={{ background: 'var(--capri-outline-variant)' }} />
          <h1 className="text-lg font-bold" style={{ color: 'var(--capri-primary)' }}>
            {lead.name}
          </h1>
          {lead.score > 0 && (
            <span className="capri-pill capri-pill-hot">HOT · {lead.score}</span>
          )}
          <span className="capri-pill capri-pill-status">{lead.status.replace(/_/g, ' ')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--capri-on-surface-variant)' }}>
          <CapriIcon name="call" size={18} />
          {formatCapriPhone(lead.phone)}
        </div>
      </nav>

      <aside
        className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] flex-col border-r md:flex"
        style={{
          width: 'var(--capri-sidebar-width)',
          background: 'var(--capri-surface-low)',
          borderColor: 'var(--capri-outline-variant)',
        }}
      >
        <nav className="flex flex-col gap-1 p-3">
          {[
            { href: '/capri/whatsapp', icon: 'dashboard', label: 'Dashboard' },
            { href: '/capri/leads', icon: 'group', label: 'Leads', active: true },
            { href: '/capri/whatsapp', icon: 'chat', label: 'WhatsApp' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{
                background: item.active ? 'var(--capri-secondary-container)' : 'transparent',
                color: item.active ? 'var(--capri-on-secondary-container)' : 'var(--capri-on-surface-variant)',
              }}
            >
              <CapriIcon name={item.icon} filled={item.active} size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-0 mt-16 flex h-[calc(100vh-64px)] flex-col md:ml-[260px]">
        <div
          className="flex flex-wrap items-center justify-between gap-2 border-b px-6 py-3"
          style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface)' }}
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--capri-primary-container)' }}
            >
              <CapriIcon name="chat" size={18} />
              WhatsApp
            </button>
            <button type="button" className="capri-btn-outline py-2 text-sm">
              <CapriIcon name="call" size={18} />
              Call
            </button>
            <button type="button" className="capri-btn-outline py-2 text-sm">
              <CapriIcon name="event" size={18} />
              Schedule Callback
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="capri-btn-outline px-3 py-2 text-sm">
              <CapriIcon name="check_circle" size={18} />
              Mark Won
            </button>
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-red-50"
              title="Move to trash"
              onClick={() => {
                if (confirm(`Move "${lead.name}" to trash?`)) {
                  moveToTrash(leadId);
                  router.push('/capri/leads');
                }
              }}
            >
              <CapriIcon name="delete" size={20} className="text-red-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left rail */}
          <div
            className="capri-scroll hidden w-80 shrink-0 overflow-y-auto border-r p-6 lg:block"
            style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-lowest)' }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
              Qualification Snapshot
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Loan Product', value: lead.product },
                { label: 'Loan Amount', value: lead.loanAmount },
                { label: 'Employment', value: lead.employment },
                { label: 'Monthly Income', value: lead.income },
              ].map((f) => (
                <div key={f.label} className="capri-card p-3">
                  <p className="text-[11px]" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    {f.label}
                  </p>
                  <p className="text-sm font-semibold">{f.value}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <div className="capri-card flex-1 border-red-200 bg-red-50 p-3">
                  <p className="text-[11px] text-red-700">Urgency</p>
                  <p className="text-sm font-semibold text-red-700">{lead.urgency}</p>
                </div>
                {lead.score > 0 && (
                  <div className="capri-card flex-1 p-3" style={{ borderColor: 'rgba(146,70,40,0.2)', background: 'rgba(146,70,40,0.05)' }}>
                    <p className="text-[11px]" style={{ color: 'var(--capri-tertiary)' }}>
                      Score
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--capri-tertiary)' }}>
                      {lead.score} HOT
                    </p>
                  </div>
                )}
              </div>
            </div>

            <h3 className="mb-3 mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
              <CapriIcon name="auto_awesome" size={16} className="text-[var(--capri-primary)]" />
              AI Summary
            </h3>
            <div
              className="rounded-xl border p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(0,104,95,0.05)', borderColor: 'rgba(0,104,95,0.2)' }}
            >
              {lead.aiSummary}
            </div>
          </div>

          {/* Chat center */}
          <div className="flex flex-1 flex-col" style={{ background: 'var(--capri-surface)' }}>
            <div className="capri-scroll flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              <div className="flex justify-center">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase"
                  style={{ background: 'var(--capri-surface-container-high)', color: 'var(--capri-on-surface-variant)' }}
                >
                  Today
                </span>
              </div>
              {messages.length > 0 ? (
                messages.map((msg) => <WaBubble key={msg.id} msg={msg} />)
              ) : (
                <p className="text-center text-sm opacity-50">No WhatsApp messages yet</p>
              )}
              {lead.status === 'CALLBACK_REQUESTED' && (
                <div className="flex justify-center">
                  <div
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium"
                    style={{ background: 'rgba(213,224,248,0.5)', borderColor: 'var(--capri-secondary-container)' }}
                  >
                    <CapriIcon name="assignment_turned_in" size={18} />
                    Callback preference captured · Lead status → <strong>CALLBACK_REQUESTED</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-6" style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-low)' }}>
              <div className="capri-card overflow-hidden">
                <div
                  className="flex items-center justify-between border-b px-4 py-2"
                  style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-container)' }}
                >
                  <div className="flex items-center gap-2">
                    <CapriIcon name="description" size={20} />
                    <select
                      className="border-none bg-transparent text-xs font-semibold uppercase outline-none"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      {activeTemplates.map((t) => (
                        <option key={t.id} value={t.name}>
                          template: {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-end gap-4 p-4">
                  <div className="flex-1">
                    <p className="mb-2 text-[11px] font-semibold uppercase" style={{ color: 'var(--capri-on-surface-variant)' }}>
                      Preview
                    </p>
                    <p
                      className="rounded-lg border p-3 text-sm italic"
                      style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-lowest)' }}
                    >
                      Hi {lead.name.split(' ')[0]}, our loan advisor will call you shortly...
                    </p>
                  </div>
                  <button type="button" className="capri-btn-wa">
                    <CapriIcon name="send" filled size={20} />
                    Send Template
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline rail */}
          <div
            className="capri-scroll hidden w-80 shrink-0 overflow-y-auto border-l p-6 xl:block"
            style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-lowest)' }}
          >
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
              Activity Timeline
            </h3>
            <div className="relative space-y-6 pl-6">
              <div className="absolute bottom-2 left-[7px] top-2 w-0.5" style={{ background: 'var(--capri-outline-variant)' }} />
              {timeline.map((ev) => (
                <div key={ev.id} className="relative">
                  <div
                    className="absolute -left-[23px] top-1 h-4 w-4 rounded-full"
                    style={{
                      background: TIMELINE_COLORS[ev.kind],
                      boxShadow: `0 0 0 4px ${TIMELINE_COLORS[ev.kind]}33`,
                    }}
                  />
                  <p className="text-sm font-semibold">{ev.title}</p>
                  <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    {ev.detail}
                  </p>
                  <span className="text-[11px] opacity-60">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
