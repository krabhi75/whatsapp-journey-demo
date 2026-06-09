import type {
  CapriLead,
  CapriLeadStatus,
  CapriTemperature,
  CapriTimelineEvent,
  CapriWaMessage,
} from './capri-demo-data';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiLead {
  id: string;
  phone: string;
  name: string;
  step: string;
  answers: {
    flow?: string;
    loanProduct?: string;
    loanAmount?: string;
    city?: string;
    urgency?: string;
    existingCustomer?: boolean;
    callbackPreference?: string;
    referenceId?: string;
    emiQuery?: string;
    supportQuery?: string;
    docType?: string;
    complaintType?: string;
  };
  score?: {
    leadScore: number;
    temperature: CapriTemperature;
    priority?: string;
    summary: string;
  };
  messages: Array<{
    id: string;
    direction: 'IN' | 'OUT';
    text: string;
    at: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function relativeActivity(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return formatTime(iso);
}

function mapStatus(lead: ApiLead): CapriLeadStatus {
  if (lead.answers.callbackPreference) return 'CALLBACK_REQUESTED';
  if (lead.step === 'COMPLETE' || lead.step === 'POST_COMPLETE') return 'QUALIFIED';
  if (lead.messages.length > 0 && lead.step !== 'MAIN_MENU') return 'QUALIFYING';
  return 'NEW';
}

function mapProduct(lead: ApiLead): string {
  return (
    lead.answers.loanProduct ||
    lead.answers.emiQuery ||
    lead.answers.supportQuery ||
    lead.answers.docType ||
    lead.answers.complaintType ||
    'WhatsApp Inquiry'
  );
}

function isCallbackReply(text: string, preference?: string): boolean {
  if (!preference) return false;
  const t = text.trim().toLowerCase();
  if (/^[1-3]$/.test(t)) return true;
  if (t.includes('morning') && preference.toLowerCase().includes('morning')) return true;
  if (t.includes('afternoon') && preference.toLowerCase().includes('afternoon')) return true;
  if (t.includes('evening') && preference.toLowerCase().includes('evening')) return true;
  return preference.toLowerCase().includes(t) && t.length > 2;
}

export function mapApiLeadToCapri(lead: ApiLead): CapriLead {
  const status = mapStatus(lead);
  const lastIn = [...lead.messages].reverse().find((m) => m.direction === 'IN');

  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone.slice(-10),
    city: lead.answers.city || '—',
    product: mapProduct(lead),
    loanAmount: lead.answers.loanAmount || '—',
    employment: lead.answers.existingCustomer === true ? 'Existing Customer' : lead.answers.existingCustomer === false ? 'New Customer' : '—',
    income: '—',
    urgency: lead.answers.urgency || '—',
    score: lead.score?.leadScore ?? 0,
    temperature: lead.score?.temperature ?? 'COLD',
    status,
    lastActivity:
      status === 'CALLBACK_REQUESTED'
        ? `Callback · ${relativeActivity(lead.updatedAt)}`
        : lastIn
          ? `WA reply · ${relativeActivity(lastIn.at)}`
          : `Updated · ${relativeActivity(lead.updatedAt)}`,
    lastActivityDetail: status === 'CALLBACK_REQUESTED' ? 'Live' : lead.step,
    source: 'WhatsApp',
    aiSummary:
      lead.score?.summary ||
      (lead.answers.callbackPreference
        ? `Callback requested: ${lead.answers.callbackPreference}. Ref ${lead.answers.referenceId || '—'}.`
        : 'Qualification in progress via WhatsApp.'),
    notes: lead.answers.referenceId ? `Ref: ${lead.answers.referenceId}` : undefined,
    callbackPreference: lead.answers.callbackPreference,
    referenceId: lead.answers.referenceId,
    isLive: true,
    journeyStep: lead.step,
  };
}

export function mapApiMessages(lead: ApiLead): CapriWaMessage[] {
  const pref = lead.answers.callbackPreference;
  let callbackMsgId: string | undefined;

  if (pref) {
    const inbound = lead.messages.filter((m) => m.direction === 'IN');
    for (let i = inbound.length - 1; i >= 0; i--) {
      if (isCallbackReply(inbound[i].text, pref)) {
        callbackMsgId = inbound[i].id;
        break;
      }
    }
    if (!callbackMsgId && inbound.length) {
      callbackMsgId = inbound[inbound.length - 1].id;
    }
  }

  return lead.messages.map((m) => ({
    id: m.id,
    leadId: lead.id,
    direction: m.direction === 'IN' ? 'INBOUND' : 'OUTBOUND',
    text: m.text,
    time: formatTime(m.at),
    status: m.direction === 'IN' ? 'READ' : 'DELIVERED',
    callbackCaptured: m.id === callbackMsgId,
  }));
}

export function mapApiTimeline(lead: ApiLead): CapriTimelineEvent[] {
  const events: CapriTimelineEvent[] = [];

  if (lead.answers.callbackPreference) {
    events.push({
      id: `tl-cb-${lead.id}`,
      leadId: lead.id,
      title: 'Callback Requested',
      detail: lead.answers.callbackPreference,
      time: relativeActivity(lead.updatedAt),
      kind: 'primary',
    });
  }

  if (lead.score) {
    events.push({
      id: `tl-sc-${lead.id}`,
      leadId: lead.id,
      title: `Lead Scored: ${lead.score.leadScore} (${lead.score.temperature})`,
      detail: lead.score.summary.slice(0, 80),
      time: relativeActivity(lead.updatedAt),
      kind: 'tertiary',
    });
  }

  const lastIn = [...lead.messages].reverse().find((m) => m.direction === 'IN');
  if (lastIn) {
    events.push({
      id: `tl-in-${lastIn.id}`,
      leadId: lead.id,
      title: 'WhatsApp Received',
      detail: lastIn.text.slice(0, 100),
      time: formatTime(lastIn.at),
      kind: 'secondary',
    });
  }

  const lastOut = [...lead.messages].reverse().find((m) => m.direction === 'OUT');
  if (lastOut) {
    events.push({
      id: `tl-out-${lastOut.id}`,
      leadId: lead.id,
      title: 'WhatsApp Sent',
      detail: lastOut.text.slice(0, 100),
      time: formatTime(lastOut.at),
      kind: 'secondary',
    });
  }

  events.push({
    id: `tl-created-${lead.id}`,
    leadId: lead.id,
    title: 'Lead Created',
    detail: 'Source: WhatsApp inbound',
    time: formatTime(lead.createdAt),
    kind: 'muted',
  });

  return events;
}

export async function fetchLiveLeads(): Promise<ApiLead[]> {
  const res = await fetch(`${API_BASE}/api/leads`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  return (json.data ?? []) as ApiLead[];
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}

export function isLiveLeadId(id: string): boolean {
  return id.startsWith('lead_');
}
