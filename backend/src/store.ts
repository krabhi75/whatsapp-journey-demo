import { QualStep, LeadAnswers, ScoreResult } from './qualification';

export interface Message {
  id: string;
  direction: 'IN' | 'OUT';
  text: string;
  at: string;
}

export interface Lead {
  id: string;
  phone: string;
  name: string;
  step: QualStep;
  answers: LeadAnswers;
  score?: ScoreResult;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const leads = new Map<string, Lead>();

function leadKey(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function findLead(phone: string): Lead | undefined {
  return leads.get(leadKey(phone));
}

export function listLeads(): Lead[] {
  return [...leads.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createLead(phone: string, name: string): Lead {
  const key = leadKey(phone);
  const now = new Date().toISOString();
  const lead: Lead = {
    id: `lead_${key}`,
    phone: key,
    name,
    step: 'PROPERTY_TYPE',
    answers: {},
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  leads.set(key, lead);
  return lead;
}

export function updateLead(phone: string, patch: Partial<Lead>): Lead {
  const key = leadKey(phone);
  const existing = leads.get(key);
  if (!existing) throw new Error('Lead not found');
  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  leads.set(key, updated);
  return updated;
}

export function addMessage(phone: string, direction: 'IN' | 'OUT', text: string): void {
  const lead = findLead(phone);
  if (!lead) return;
  lead.messages.push({
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    direction,
    text,
    at: new Date().toISOString(),
  });
  lead.updatedAt = new Date().toISOString();
}
