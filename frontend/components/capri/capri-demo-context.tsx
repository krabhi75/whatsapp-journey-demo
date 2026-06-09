'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  SEED_LEADS,
  SEED_MESSAGES,
  SEED_TEMPLATES,
  SEED_TIMELINE,
  type CapriLead,
  type CapriTemplate,
  type CapriWaMessage,
  type CapriTimelineEvent,
} from '@/lib/capri-demo-data';
import {
  API_BASE,
  checkApiHealth,
  fetchLiveLeads,
  isLiveLeadId,
  mapApiLeadToCapri,
  mapApiMessages,
  mapApiTimeline,
} from '@/lib/capri-live-sync';

export interface CreateLeadInput {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  product: string;
  loanAmount: string;
  employment: string;
  income: string;
  urgency: string;
  notes?: string;
  startWhatsApp: boolean;
}

interface CapriDemoContextValue {
  leads: CapriLead[];
  trashLeads: CapriLead[];
  messages: CapriWaMessage[];
  timeline: CapriTimelineEvent[];
  templates: CapriTemplate[];
  apiConnected: boolean;
  liveSessionCount: number;
  lastSyncedAt: string | null;
  createLead: (input: CreateLeadInput) => CapriLead;
  moveToTrash: (id: string) => void;
  restoreLead: (id: string) => void;
  purgeLead: (id: string) => void;
  getLead: (id: string) => CapriLead | undefined;
  getMessages: (leadId: string) => CapriWaMessage[];
  getTimeline: (leadId: string) => CapriTimelineEvent[];
  addTemplate: (tpl: Omit<CapriTemplate, 'id'>) => void;
  toggleTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  refreshLive: () => Promise<void>;
}

const CapriDemoContext = createContext<CapriDemoContextValue | null>(null);

const POLL_MS = 3000;

function slugId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Date.now().toString(36)
  );
}

export function CapriDemoProvider({ children }: { children: ReactNode }) {
  const [localLeads, setLocalLeads] = useState<CapriLead[]>([]);
  const [liveLeads, setLiveLeads] = useState<CapriLead[]>([]);
  const [liveMessages, setLiveMessages] = useState<CapriWaMessage[]>([]);
  const [liveTimeline, setLiveTimeline] = useState<CapriTimelineEvent[]>([]);
  const [trashLeads, setTrashLeads] = useState<CapriLead[]>([]);
  const [localMessages, setLocalMessages] = useState<CapriWaMessage[]>(SEED_MESSAGES);
  const [localTimeline, setLocalTimeline] = useState<CapriTimelineEvent[]>(SEED_TIMELINE);
  const [templates, setTemplates] = useState<CapriTemplate[]>(SEED_TEMPLATES);
  const [toast, setToast] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [useSeedFallback, setUseSeedFallback] = useState(true);

  const knownCallbacks = useRef<Set<string>>(new Set());

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const refreshLive = useCallback(async () => {
    const healthy = await checkApiHealth();
    setApiConnected(healthy);
    if (!healthy) return;

    try {
      const apiLeads = await fetchLiveLeads();
      const mapped = apiLeads.map(mapApiLeadToCapri);
      const msgs = apiLeads.flatMap(mapApiMessages);
      const tl = apiLeads.flatMap(mapApiTimeline);

      for (const lead of mapped) {
        if (lead.status === 'CALLBACK_REQUESTED' && lead.callbackPreference) {
          const key = `${lead.id}:${lead.callbackPreference}`;
          if (!knownCallbacks.current.has(key)) {
            knownCallbacks.current.add(key);
            if (knownCallbacks.current.size > 1) {
              showToast(`Callback received from ${lead.name} — ${lead.callbackPreference}`);
            }
          }
        }
      }

      setLiveLeads(mapped);
      setLiveMessages(msgs);
      setLiveTimeline(tl);
      setLastSyncedAt(new Date().toISOString());
      setUseSeedFallback(apiLeads.length === 0);
    } catch {
      setApiConnected(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshLive();
    const id = setInterval(refreshLive, POLL_MS);
    return () => clearInterval(id);
  }, [refreshLive]);

  const seedLeads = useSeedFallback && liveLeads.length === 0 ? SEED_LEADS : [];
  const manualLeads = localLeads.filter(
    (l) => !liveLeads.some((live) => live.phone === l.phone)
  );

  const leads = useMemo(
    () => [...liveLeads, ...manualLeads, ...seedLeads.filter((s) => !liveLeads.some((l) => l.phone === s.phone))],
    [liveLeads, manualLeads, seedLeads]
  );

  const messages = useMemo(() => {
    const liveIds = new Set(liveLeads.map((l) => l.id));
    const localOnly = localMessages.filter((m) => !liveIds.has(m.leadId));
    const seedOnly = useSeedFallback
      ? SEED_MESSAGES.filter((m) => !liveIds.has(m.leadId) && !localOnly.some((l) => l.leadId === m.leadId))
      : [];
    return [...liveMessages, ...localOnly, ...seedOnly];
  }, [liveMessages, liveLeads, localMessages, useSeedFallback]);

  const timeline = useMemo(() => {
    const liveIds = new Set(liveLeads.map((l) => l.id));
    const localOnly = localTimeline.filter((t) => !liveIds.has(t.leadId));
    const seedOnly = useSeedFallback
      ? SEED_TIMELINE.filter((t) => !liveIds.has(t.leadId))
      : [];
    return [...liveTimeline, ...localOnly, ...seedOnly];
  }, [liveTimeline, liveLeads, localTimeline, useSeedFallback]);

  const createLead = useCallback(
    (input: CreateLeadInput): CapriLead => {
      const id = slugId(input.name);
      const lead: CapriLead = {
        id,
        name: input.name,
        phone: input.phone.replace(/\D/g, '').slice(-10),
        email: input.email,
        city: input.city,
        product: input.product,
        loanAmount: input.loanAmount,
        employment: input.employment,
        income: input.income,
        urgency: input.urgency,
        score: 0,
        temperature: 'COLD',
        status: 'NEW',
        lastActivity: 'Created just now',
        lastActivityDetail: '',
        source: 'Manual',
        notes: input.notes,
        aiSummary: 'AI summary will appear after WhatsApp qualification.',
      };

      setLocalLeads((prev) => [lead, ...prev]);

      const now = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      setLocalTimeline((prev) => [
        {
          id: `tl-${id}`,
          leadId: id,
          title: 'Lead Created',
          detail: 'Source: Manual entry',
          time: 'Just now',
          kind: 'muted',
        },
        ...prev,
      ]);

      if (input.startWhatsApp) {
        const welcomeMsg: CapriWaMessage = {
          id: `wm-${id}`,
          leadId: id,
          direction: 'OUTBOUND',
          template: 'loan_welcome',
          text: `Hello ${input.name.split(' ')[0]}! Welcome to Capri WhatsApp Demo.`,
          time: now,
          status: 'SENT',
        };
        setLocalMessages((prev) => [...prev, welcomeMsg]);
        lead.lastActivity = 'Template sent just now';
        lead.status = 'QUALIFYING';
      }

      showToast('Lead created — send Hi on WhatsApp to start live journey');
      return lead;
    },
    [showToast]
  );

  const moveToTrash = useCallback(
    (id: string) => {
      if (isLiveLeadId(id)) {
        showToast('Live WhatsApp sessions cannot be trashed — they clear on server restart');
        return;
      }
      if (SEED_LEADS.some((s) => s.id === id)) {
        showToast('Demo sample — complete a live WhatsApp journey to test callbacks');
        return;
      }
      setLocalLeads((prev) => {
        const lead = prev.find((l) => l.id === id);
        if (!lead) return prev;
        setTrashLeads((t) => [{ ...lead, deletedAt: new Date().toISOString() }, ...t]);
        showToast(`"${lead.name}" moved to trash`);
        return prev.filter((l) => l.id !== id);
      });
    },
    [showToast]
  );

  const restoreLead = useCallback(
    (id: string) => {
      setTrashLeads((prev) => {
        const lead = prev.find((l) => l.id === id);
        if (!lead) return prev;
        const { deletedAt: _, ...restored } = lead;
        setLocalLeads((l) => [restored, ...l]);
        showToast(`"${lead.name}" restored`);
        return prev.filter((l) => l.id !== id);
      });
    },
    [showToast]
  );

  const purgeLead = useCallback(
    (id: string) => {
      setTrashLeads((prev) => {
        const lead = prev.find((l) => l.id === id);
        if (lead) showToast(`"${lead.name}" permanently deleted`);
        return prev.filter((l) => l.id !== id);
      });
      setLocalMessages((prev) => prev.filter((m) => m.leadId !== id));
      setLocalTimeline((prev) => prev.filter((t) => t.leadId !== id));
    },
    [showToast]
  );

  const getLead = useCallback(
    (id: string) => leads.find((l) => l.id === id) ?? trashLeads.find((l) => l.id === id),
    [leads, trashLeads]
  );

  const getMessages = useCallback(
    (leadId: string) => messages.filter((m) => m.leadId === leadId),
    [messages]
  );

  const getTimeline = useCallback(
    (leadId: string) => timeline.filter((t) => t.leadId === leadId),
    [timeline]
  );

  const addTemplate = useCallback((tpl: Omit<CapriTemplate, 'id'>) => {
    setTemplates((prev) => [{ ...tpl, id: `tpl-${Date.now()}` }, ...prev]);
    showToast('Template created — submit to Meta for approval');
  }, [showToast]);

  const toggleTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast('Template deleted');
  }, [showToast]);

  const value = useMemo(
    () => ({
      leads,
      trashLeads,
      messages,
      timeline,
      templates,
      apiConnected,
      liveSessionCount: liveLeads.length,
      lastSyncedAt,
      createLead,
      moveToTrash,
      restoreLead,
      purgeLead,
      getLead,
      getMessages,
      getTimeline,
      addTemplate,
      toggleTemplate,
      deleteTemplate,
      toast,
      showToast,
      clearToast,
      refreshLive,
    }),
    [
      leads,
      trashLeads,
      messages,
      timeline,
      templates,
      apiConnected,
      liveLeads.length,
      lastSyncedAt,
      createLead,
      moveToTrash,
      restoreLead,
      purgeLead,
      getLead,
      getMessages,
      getTimeline,
      addTemplate,
      toggleTemplate,
      deleteTemplate,
      toast,
      showToast,
      clearToast,
      refreshLive,
    ]
  );

  return <CapriDemoContext.Provider value={value}>{children}</CapriDemoContext.Provider>;
}

export function useCapriDemo() {
  const ctx = useContext(CapriDemoContext);
  if (!ctx) throw new Error('useCapriDemo must be used within CapriDemoProvider');
  return ctx;
}

export { API_BASE };
