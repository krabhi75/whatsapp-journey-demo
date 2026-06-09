export type CapriLeadStatus =
  | 'NEW'
  | 'QUALIFYING'
  | 'QUALIFIED'
  | 'CALLBACK_REQUESTED'
  | 'WON'
  | 'LOST';

export type CapriTemperature = 'HOT' | 'WARM' | 'COLD';

export interface CapriLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  product: string;
  loanAmount: string;
  employment: string;
  income: string;
  urgency: string;
  score: number;
  temperature: CapriTemperature;
  status: CapriLeadStatus;
  lastActivity: string;
  lastActivityDetail: string;
  source: string;
  notes?: string;
  deletedAt?: string;
  aiSummary?: string;
}

export interface CapriWaMessage {
  id: string;
  leadId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  template?: string;
  text: string;
  time: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
  callbackCaptured?: boolean;
}

export interface CapriTimelineEvent {
  id: string;
  leadId: string;
  title: string;
  detail: string;
  time: string;
  kind: 'primary' | 'secondary' | 'tertiary' | 'muted';
}

export interface CapriTemplate {
  id: string;
  name: string;
  category: 'UTILITY' | 'MARKETING';
  status: 'APPROVED' | 'PENDING' | 'DRAFT';
  active: boolean;
  preview: string;
  variables: string[];
}

export interface CapriMessageLog {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  direction: 'INBOUND' | 'OUTBOUND';
  template?: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  timestamp: string;
}

export const CAPRI_TENANT = 'Capri Global Finance';

export const CAPRI_BRAND = {
  name: 'Capri WhatsApp Demo',
  tagline: 'Institutional AI · NBFC',
  legal: 'Capri Global Capital Ltd',
};

export const SEED_LEADS: CapriLead[] = [
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    phone: '9876543210',
    email: 'priya.nair@example.com',
    city: 'Mumbai',
    product: 'Personal Loan',
    loanAmount: '₹5–15L',
    employment: 'Salaried',
    income: '₹50K–1L',
    urgency: 'Immediate',
    score: 88,
    temperature: 'HOT',
    status: 'CALLBACK_REQUESTED',
    lastActivity: 'WA reply 2m ago',
    lastActivityDetail: 'Delivered',
    source: 'Manual',
    aiSummary:
      'Priya is seeking a Personal Loan of ₹5–8L, salaried with ₹50K+ income, needs funds within 7 days. High intent — requested callback on WhatsApp. Preferred time window between 2–4 PM today.',
  },
  {
    id: 'rahul-mehta',
    name: 'Rahul Mehta',
    phone: '9123456789',
    city: 'Bangalore',
    product: 'Home Loan',
    loanAmount: '₹45L',
    employment: 'Salaried',
    income: '₹1L+',
    urgency: '30 Days',
    score: 62,
    temperature: 'WARM',
    status: 'QUALIFYING',
    lastActivity: 'Template sent 18m ago',
    lastActivityDetail: 'Sent',
    source: 'Website',
    aiSummary: 'Rahul is exploring a Home Loan around ₹45L. Early qualification in progress via WhatsApp.',
  },
  {
    id: 'anita-desai',
    name: 'Anita Desai',
    phone: '9988776655',
    city: 'Hyderabad',
    product: 'Business Loan',
    loanAmount: '₹20L',
    employment: 'Business Owner',
    income: '₹24L+',
    urgency: '7 Days',
    score: 91,
    temperature: 'HOT',
    status: 'QUALIFIED',
    lastActivity: 'Qualified via WA 1h ago',
    lastActivityDetail: 'AI Scored',
    source: 'Partner',
    aiSummary: 'Anita qualifies for Business Loan ₹20L. Strong revenue profile; ready for document collection.',
  },
  {
    id: 'vikram-shah',
    name: 'Vikram Shah',
    phone: '9765432109',
    city: 'Delhi',
    product: 'Gold Loan',
    loanAmount: '₹2L',
    employment: 'Self-Employed',
    income: '₹25–50K',
    urgency: 'Exploring',
    score: 24,
    temperature: 'COLD',
    status: 'NEW',
    lastActivity: 'Lead created 3h ago',
    lastActivityDetail: '',
    source: 'Manual',
  },
];

export const SEED_MESSAGES: CapriWaMessage[] = [
  {
    id: 'm1',
    leadId: 'priya-nair',
    direction: 'OUTBOUND',
    template: 'loan_welcome',
    text: 'Hello Priya! Welcome to Capri WhatsApp Demo. Which loan amount range are you looking for? 1. Below ₹5L, 2. ₹5-15L, 3. Above ₹15L',
    time: '10:15 AM',
    status: 'DELIVERED',
  },
  {
    id: 'm2',
    leadId: 'priya-nair',
    direction: 'INBOUND',
    text: '3',
    time: '10:16 AM',
    status: 'READ',
  },
  {
    id: 'm3',
    leadId: 'priya-nair',
    direction: 'OUTBOUND',
    text: 'Great. What is your employment type? Reply: Salaried / Self-Employed / Business Owner',
    time: '10:16 AM',
    status: 'DELIVERED',
  },
  {
    id: 'm4',
    leadId: 'priya-nair',
    direction: 'INBOUND',
    text: 'Salaried',
    time: '10:17 AM',
    status: 'READ',
  },
  {
    id: 'm5',
    leadId: 'priya-nair',
    direction: 'OUTBOUND',
    template: 'callback_request',
    text: 'Hi Priya, our loan advisor will call you shortly regarding your Personal Loan application.',
    time: '10:38 AM',
    status: 'DELIVERED',
  },
  {
    id: 'm6',
    leadId: 'priya-nair',
    direction: 'INBOUND',
    text: 'Yes, please call me between 2–4 PM',
    time: '10:42 AM',
    status: 'READ',
    callbackCaptured: true,
  },
];

export const SEED_TIMELINE: CapriTimelineEvent[] = [
  {
    id: 't1',
    leadId: 'priya-nair',
    title: 'Callback Requested',
    detail: 'Via WhatsApp bot at 10:42 AM',
    time: 'Today',
    kind: 'primary',
  },
  {
    id: 't2',
    leadId: 'priya-nair',
    title: 'Qualification Updated',
    detail: 'Employment: Salaried',
    time: '10:17 AM',
    kind: 'secondary',
  },
  {
    id: 't3',
    leadId: 'priya-nair',
    title: 'Lead Scored: 88 (HOT)',
    detail: 'Capri WhatsApp Demo Risk Engine',
    time: '10:16 AM',
    kind: 'tertiary',
  },
  {
    id: 't4',
    leadId: 'priya-nair',
    title: 'WhatsApp Received',
    detail: 'Input: Option 3 (₹5–15L)',
    time: '10:16 AM',
    kind: 'secondary',
  },
  {
    id: 't5',
    leadId: 'priya-nair',
    title: 'WhatsApp Sent',
    detail: 'Template: loan_welcome',
    time: '10:15 AM',
    kind: 'secondary',
  },
  {
    id: 't6',
    leadId: 'priya-nair',
    title: 'Lead Created',
    detail: 'Source: Manual entry',
    time: '9:45 AM',
    kind: 'muted',
  },
];

export const SEED_TEMPLATES: CapriTemplate[] = [
  {
    id: 'tpl-welcome',
    name: 'loan_welcome',
    category: 'UTILITY',
    status: 'APPROVED',
    active: true,
    preview:
      'Hi {{customer_name}}, thank you for your interest in a {{loan_product}} with SwiftCredit Finance.',
    variables: ['customer_name', 'loan_product'],
  },
  {
    id: 'tpl-callback',
    name: 'callback_request',
    category: 'UTILITY',
    status: 'APPROVED',
    active: true,
    preview: 'Hi {{customer_name}}, our loan advisor will call you shortly regarding {{loan_product}}.',
    variables: ['customer_name', 'loan_product'],
  },
  {
    id: 'tpl-docs',
    name: 'document_reminder',
    category: 'UTILITY',
    status: 'PENDING',
    active: false,
    preview: 'Hi {{customer_name}}, please share: {{doc_list}} to process your application.',
    variables: ['customer_name', 'doc_list'],
  },
  {
    id: 'tpl-offer',
    name: 'loan_offer_share',
    category: 'MARKETING',
    status: 'DRAFT',
    active: false,
    preview: 'Hi {{customer_name}}, you are pre-qualified for ₹{{amount}} at {{rate}}% p.a.',
    variables: ['customer_name', 'amount', 'rate'],
  },
];

export const SEED_MESSAGE_LOGS: CapriMessageLog[] = [
  {
    id: 'log1',
    leadId: 'priya-nair',
    leadName: 'Priya Nair',
    phone: '+91 98765 43210',
    direction: 'INBOUND',
    message: 'Yes, please call me',
    status: 'READ',
    timestamp: '09 Jun, 10:42',
  },
  {
    id: 'log2',
    leadId: 'priya-nair',
    leadName: 'Priya Nair',
    phone: '+91 98765 43210',
    direction: 'OUTBOUND',
    template: 'callback_request',
    message: 'Hi Priya, our loan advisor will call you shortly regarding your Personal Loan.',
    status: 'DELIVERED',
    timestamp: '09 Jun, 10:38',
  },
  {
    id: 'log3',
    leadId: 'rahul-mehta',
    leadName: 'Rahul Mehta',
    phone: '+91 91234 56789',
    direction: 'OUTBOUND',
    template: 'loan_welcome',
    message: 'Hi Rahul, thanks for your interest in a Home Loan with SwiftCredit.',
    status: 'READ',
    timestamp: '09 Jun, 10:15',
  },
];

export function formatCapriPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return phone;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function leadInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
