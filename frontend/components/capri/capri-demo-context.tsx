'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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
}

const CapriDemoContext = createContext<CapriDemoContextValue | null>(null);

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
  const [leads, setLeads] = useState<CapriLead[]>(SEED_LEADS);
  const [trashLeads, setTrashLeads] = useState<CapriLead[]>([]);
  const [messages, setMessages] = useState<CapriWaMessage[]>(SEED_MESSAGES);
  const [timeline, setTimeline] = useState<CapriTimelineEvent[]>(SEED_TIMELINE);
  const [templates, setTemplates] = useState<CapriTemplate[]>(SEED_TEMPLATES);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

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

      setLeads((prev) => [lead, ...prev]);

      const now = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      setTimeline((prev) => [
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
          text: `Hello ${input.name.split(' ')[0]}! Welcome to Capri WhatsApp Demo. Which loan amount range are you looking for? 1. Below ₹5L, 2. ₹5-15L, 3. Above ₹15L`,
          time: now,
          status: 'SENT',
        };
        setMessages((prev) => [...prev, welcomeMsg]);
        setTimeline((prev) => [
          {
            id: `tls-${id}`,
            leadId: id,
            title: 'WhatsApp Sent',
            detail: 'Template: loan_welcome',
            time: now,
            kind: 'secondary',
          },
          ...prev,
        ]);
        lead.lastActivity = 'Template sent just now';
        lead.lastActivityDetail = 'Sent';
        lead.status = 'QUALIFYING';
      }

      showToast('Lead created — WhatsApp welcome message queued');
      return lead;
    },
    [showToast]
  );

  const moveToTrash = useCallback(
    (id: string) => {
      setLeads((prev) => {
        const lead = prev.find((l) => l.id === id);
        if (!lead) return prev;
        setTrashLeads((t) => [
          { ...lead, deletedAt: new Date().toISOString() },
          ...t,
        ]);
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
        setLeads((l) => [restored, ...l]);
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
      setMessages((prev) => prev.filter((m) => m.leadId !== id));
      setTimeline((prev) => prev.filter((t) => t.leadId !== id));
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
    setTemplates((prev) => [
      { ...tpl, id: `tpl-${Date.now()}` },
      ...prev,
    ]);
    showToast('Template created — submit to Meta for approval');
  }, [showToast]);

  const toggleTemplate = useCallback((id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
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
    }),
    [
      leads,
      trashLeads,
      messages,
      timeline,
      templates,
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
    ]
  );

  return (
    <CapriDemoContext.Provider value={value}>{children}</CapriDemoContext.Provider>
  );
}

export function useCapriDemo() {
  const ctx = useContext(CapriDemoContext);
  if (!ctx) throw new Error('useCapriDemo must be used within CapriDemoProvider');
  return ctx;
}
