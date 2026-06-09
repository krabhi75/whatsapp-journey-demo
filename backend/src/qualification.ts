/** Capri Global — dynamic WhatsApp customer service journey */

import {
  productAck,
  generateRefId,
  nearestBranches,
  CAPRI_PRODUCTS,
} from './capri-content';

export type QualStep =
  | 'MAIN_MENU'
  | 'LOAN_PRODUCT'
  | 'LOAN_AMOUNT'
  | 'CITY'
  | 'URGENCY'
  | 'EXISTING_CUSTOMER'
  | 'CALLBACK_PREF'
  | 'EMI_SUBMENU'
  | 'EMI_DETAIL'
  | 'SUPPORT_SUBMENU'
  | 'BRANCH_CITY'
  | 'DOC_TYPE'
  | 'COMPLAINT_TYPE'
  | 'COMPLETE'
  | 'POST_COMPLETE';

export type FlowType = 'LOAN' | 'EMI' | 'SUPPORT' | 'BRANCH' | 'DOCS' | 'COMPLAINT' | 'CATALOG';

export interface LeadAnswers {
  flow?: FlowType;
  serviceType?: string;
  loanProduct?: string;
  loanAmount?: string;
  city?: string;
  urgency?: string;
  existingCustomer?: boolean;
  callbackPreference?: string;
  emiQuery?: string;
  supportQuery?: string;
  docType?: string;
  complaintType?: string;
  referenceId?: string;
}

export interface ScoreResult {
  leadScore: number;
  temperature: 'HOT' | 'WARM' | 'COLD';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
}

export interface ParseResult {
  answers: Partial<LeadAnswers>;
  nextStep: QualStep;
  invalid?: boolean;
  invalidHint?: string;
  ackMessage?: string;
  extraMessages?: string[];
}

function pickOption(
  message: string,
  map: Record<string, string>,
  fuzzy: (t: string) => string | null
): string {
  const t = message.trim();
  const max = Object.keys(map).length;
  if (new RegExp(`^[1-${max}]$`).test(t)) return map[t] ?? map['1'];
  return fuzzy(t.toLowerCase()) ?? map['1'];
}

export function getQuestion(step: QualStep, answers: LeadAnswers = {}): string | null {
  switch (step) {
    case 'LOAN_AMOUNT': {
      const p = answers.loanProduct;
      if (p === 'Gold Loan')
        return (
          `Kitna loan amount chahiye? 🏆\n\n` +
          `1. ₹3,000 – ₹50,000 (quick need)\n` +
          `2. ₹50,000 – ₹5 Lakh\n` +
          `3. ₹5 Lakh – ₹30 Lakh\n\n` +
          `Reply 1, 2 ya 3`
        );
      if (p === 'Home Loan')
        return (
          `Home loan kitna amount? 🏠\n\n` +
          `1. ₹5 – 25 Lakh\n` +
          `2. ₹25 – 75 Lakh\n` +
          `3. ₹75 Lakh – ₹1.5 Crore\n\n` +
          `Reply 1, 2 ya 3`
        );
      if (p === 'MSME Loan')
        return (
          `Business loan requirement? 💼\n\n` +
          `1. Up to ₹10 Lakh\n` +
          `2. ₹10 – 50 Lakh\n` +
          `3. ₹50 Lakh – ₹1.5 Crore\n\n` +
          `Reply 1, 2 ya 3`
        );
      return (
        `Approximate loan amount?\n\n` +
        `1. Up to ₹5 Lakh\n` +
        `2. ₹5 – 25 Lakh\n` +
        `3. ₹25 Lakh+\n\n` +
        `Reply 1, 2 ya 3`
      );
    }
    case 'CITY':
      return `Aap kaun se *city* se hain? 📍\n\n(e.g. Delhi, Mumbai, Pune, Noida, Ghaziabad)`;
    case 'URGENCY':
      return (
        `Loan kab tak chahiye? ⏱️\n\n` +
        `1. Aaj / kal (urgent)\n` +
        `2. Is hafte mein\n` +
        `3. 15–30 din mein\n` +
        `4. Abhi explore kar raha hoon\n\n` +
        `Reply 1–4`
      );
    case 'EXISTING_CUSTOMER':
      return `Kya aap pehle se *Capri Loans* customer hain?\n\nReply *Haan* ya *Nahi*`;
    case 'CALLBACK_PREF':
      return (
        `Hamari team aapko call kare — best time? 📞\n\n` +
        `1. Subah (9 AM – 12 PM)\n` +
        `2. Dopahar (12 – 5 PM)\n` +
        `3. Shaam (5 – 8 PM)\n\n` +
        `Reply 1, 2 ya 3`
      );
    case 'BRANCH_CITY':
      return `Branch dhundhne ke liye apna *city* batayein 📍\n\n(e.g. Pune, Delhi, Mumbai)`;
    case 'DOC_TYPE':
      return (
        `Kaunsa document chahiye? 📄\n\n` +
        `1. Account Statement / SOA\n` +
        `2. Interest certificate\n` +
        `3. NOC / Closure letter\n` +
        `4. Repayment schedule\n` +
        `5. Other\n\n` +
        `Reply 1–5`
      );
    case 'COMPLAINT_TYPE':
      return (
        `Complaint category batayein 🎫\n\n` +
        `1. Branch / staff behaviour\n` +
        `2. Delay in disbursal\n` +
        `3. EMI / billing issue\n` +
        `4. Document / NOC delay\n` +
        `5. Other\n\n` +
        `Reply 1–5 — *priority handling*`
      );
    case 'EMI_DETAIL':
      return `Thoda detail batayein — loan account number ya registered mobile? _(demo: last 4 digits OK)_`;
    default:
      return null;
  }
}

export function parseMainMenu(message: string): ParseResult {
  const t = message.trim().toLowerCase();
  const choice = pickOption(
    message,
    {
      '1': 'gold',
      '2': 'home',
      '3': 'msme',
      '4': 'lap',
      '5': 'emi',
      '6': 'support',
      '7': 'catalog',
    },
    (x) => {
      if (x.includes('gold')) return 'gold';
      if (x.includes('home') || x.includes('ghar')) return 'home';
      if (x.includes('msme') || x.includes('business')) return 'msme';
      if (x.includes('lap') || x.includes('construction')) return 'lap';
      if (x.includes('emi') || x.includes('pay')) return 'emi';
      if (x.includes('branch') || x.includes('document') || x.includes('complaint')) return 'support';
      if (x.includes('product') || x.includes('rate')) return 'catalog';
      return null;
    }
  );

  switch (choice) {
    case 'gold':
      return {
        answers: { flow: 'LOAN', loanProduct: 'Gold Loan', serviceType: 'New Loan Application' },
        nextStep: 'LOAN_AMOUNT',
        ackMessage: productAck('Gold Loan'),
      };
    case 'home':
      return {
        answers: { flow: 'LOAN', loanProduct: 'Home Loan', serviceType: 'New Loan Application' },
        nextStep: 'LOAN_AMOUNT',
        ackMessage: productAck('Home Loan'),
      };
    case 'msme':
      return {
        answers: { flow: 'LOAN', loanProduct: 'MSME Loan', serviceType: 'New Loan Application' },
        nextStep: 'LOAN_AMOUNT',
        ackMessage: productAck('MSME Loan'),
      };
    case 'lap':
      return {
        answers: { flow: 'LOAN', loanProduct: 'Micro LAP', serviceType: 'New Loan Application' },
        nextStep: 'LOAN_AMOUNT',
        ackMessage: productAck('Micro LAP'),
        extraMessages: [
          `Construction Finance bhi available hai 🔨\nAgar construction project hai toh team ko batayenge.`,
        ],
      };
    case 'emi':
      return {
        answers: { flow: 'EMI', serviceType: 'EMI / Pay Now' },
        nextStep: 'EMI_SUBMENU',
        ackMessage: `💳 *Pay Now* — Capri Loans app se EMI instantly pay karein!\n\nChaliye aapki query samajhte hain...`,
      };
    case 'support':
      return {
        answers: { flow: 'SUPPORT', serviceType: 'Support & Documents' },
        nextStep: 'SUPPORT_SUBMENU',
        ackMessage: `📋 Main branch, documents aur complaints — sab mein help karungi.`,
      };
    case 'catalog':
      return {
        answers: { flow: 'CATALOG', serviceType: 'Product Inquiry' },
        nextStep: 'MAIN_MENU',
        ackMessage: `📋 *Capri Loans — All Products*\n\n${CAPRI_PRODUCTS.map((p) => `${p.emoji} *${p.name}* — ${p.minAmount} to ${p.maxAmount}`).join('\n')}`,
        extraMessages: [
          `Apply karne ke liye upar se product number reply karein:\n1 Gold · 2 Home · 3 MSME · 4 LAP`,
        ],
      };
    default:
      return { answers: {}, nextStep: 'MAIN_MENU', invalid: true, invalidHint: 'Reply 1–7 from menu' };
  }
}

export function parseAnswer(step: QualStep, message: string, current: LeadAnswers = {}): ParseResult {
  const text = message.trim().toLowerCase();

  if (step === 'MAIN_MENU') return parseMainMenu(message);

  switch (step) {
    case 'LOAN_AMOUNT': {
      const map =
        current.loanProduct === 'Gold Loan'
          ? { '1': '₹3K – ₹50K', '2': '₹50K – ₹5L', '3': '₹5L – ₹30L' }
          : current.loanProduct === 'Home Loan'
            ? { '1': '₹5 – 25L', '2': '₹25 – 75L', '3': '₹75L – ₹1.5Cr' }
            : { '1': 'Up to ₹5L', '2': '₹5 – 25L', '3': '₹25L+' };
      const loanAmount = pickOption(message, map, () => map['2']);
      return {
        answers: { loanAmount },
        nextStep: 'CITY',
        ackMessage: `Noted! *${loanAmount}* — perfect. Ab location jaanne se nearest branch connect karna easy ho jayega. 📍`,
      };
    }

    case 'CITY': {
      const city = message.trim().slice(0, 40) || 'Your City';
      return {
        answers: { city },
        nextStep: 'URGENCY',
        ackMessage: `📍 *${city}* — hamare paas yahan Capri Loans branches hain.\n\nAgla step — timeline:`,
      };
    }

    case 'URGENCY': {
      const urgency = pickOption(
        message,
        {
          '1': 'Today / Tomorrow (Urgent)',
          '2': 'This week',
          '3': '15–30 days',
          '4': 'Just exploring',
        },
        (t) => {
          if (t.includes('urgent') || t.includes('aaj') || t.includes('kal')) return 'Today / Tomorrow (Urgent)';
          if (t.includes('week') || t.includes('hafta')) return 'This week';
          if (t.includes('explor')) return 'Just exploring';
          return '15–30 days';
        }
      );
      const urgent = urgency.includes('Urgent') || urgency.includes('week');
      return {
        answers: { urgency },
        nextStep: 'EXISTING_CUSTOMER',
        ackMessage: urgent
          ? `⚡ Samajh gayi — *fast-track* priority denge aapki request ko!`
          : `Theek hai — aapko saari options detail mein batayenge, koi jaldi nahi. 😊`,
      };
    }

    case 'EXISTING_CUSTOMER': {
      if (!/^(yes|no|y|n|haan|nahi|ha|na|1|2)$/i.test(text)) {
        return {
          answers: {},
          nextStep: 'EXISTING_CUSTOMER',
          invalid: true,
          invalidHint: 'Reply *Haan* ya *Nahi* — kya aap existing Capri customer hain?',
        };
      }
      const existingCustomer =
        text.includes('yes') || text.includes('haan') || text === 'y' || text === 'ha' || text === '1';
      return {
        answers: { existingCustomer },
        nextStep: 'CALLBACK_PREF',
        ackMessage: existingCustomer
          ? `🎉 Welcome back! Existing customer ko *priority callback* milti hai.`
          : `🌟 Naye customer — pehli baar? Koi baat nahi, poori guidance milegi!`,
      };
    }

    case 'CALLBACK_PREF': {
      const callbackPreference = pickOption(
        message,
        {
          '1': 'Morning (9 AM – 12 PM)',
          '2': 'Afternoon (12 – 5 PM)',
          '3': 'Evening (5 – 8 PM)',
        },
        (t) => {
          if (t.includes('subah') || t.includes('morning')) return 'Morning (9 AM – 12 PM)';
          if (t.includes('shaam') || t.includes('evening')) return 'Evening (5 – 8 PM)';
          return 'Afternoon (12 – 5 PM)';
        }
      );
      return { answers: { callbackPreference, referenceId: generateRefId() }, nextStep: 'COMPLETE' };
    }

    case 'EMI_SUBMENU': {
      const emiQuery = pickOption(
        message,
        {
          '1': 'Pay EMI online',
          '2': 'EMI due / balance',
          '3': 'Foreclosure / part-payment',
          '4': 'NOC / closure',
          '5': 'Talk to accounts team',
        },
        () => 'Talk to accounts team'
      );
      if (emiQuery === 'Pay EMI online') {
        return {
          answers: { emiQuery, referenceId: generateRefId() },
          nextStep: 'COMPLETE',
          ackMessage:
            `💳 *Pay Now*\n\n` +
            `Capri Loans App → Pay Now section\n` +
            `🌐 ${'https://www.capriloans.in/'}\n\n` +
            `UPI / Netbanking / Debit card supported.`,
        };
      }
      return {
        answers: { emiQuery },
        nextStep: 'EMI_DETAIL',
        ackMessage: `Samajh gayi — *${emiQuery}*. Ek chhoti si detail:`,
      };
    }

    case 'EMI_DETAIL':
      return {
        answers: { referenceId: generateRefId() },
        nextStep: 'COMPLETE',
        ackMessage: `Accounts team ko forward kar diya. 2 ghante mein callback milega.`,
      };

    case 'SUPPORT_SUBMENU': {
      const choice = pickOption(message, { '1': 'branch', '2': 'docs', '3': 'docs', '4': 'complaint', '5': 'call' }, (t) => {
        if (t.includes('branch')) return 'branch';
        if (t.includes('complaint')) return 'complaint';
        if (t.includes('doc')) return 'docs';
        return 'call';
      });
      if (choice === 'branch') return { answers: { supportQuery: 'Branch locator' }, nextStep: 'BRANCH_CITY' };
      if (choice === 'docs') return { answers: { supportQuery: 'Documents' }, nextStep: 'DOC_TYPE' };
      if (choice === 'complaint')
        return {
          answers: { supportQuery: 'Complaint', flow: 'COMPLAINT' },
          nextStep: 'COMPLAINT_TYPE',
          ackMessage: `🎫 Complaint register karenge — *24-hour priority SLA* demo mode.`,
        };
      return {
        answers: { supportQuery: 'Customer care', referenceId: generateRefId() },
        nextStep: 'COMPLETE',
        ackMessage: `📞 Customer care callback schedule ho gaya.`,
      };
    }

    case 'BRANCH_CITY': {
      const city = message.trim() || 'India';
      return {
        answers: { city, referenceId: generateRefId() },
        nextStep: 'COMPLETE',
        ackMessage: nearestBranches(city),
      };
    }

    case 'DOC_TYPE': {
      const docType = pickOption(
        message,
        {
          '1': 'Account Statement',
          '2': 'Interest certificate',
          '3': 'NOC / Closure',
          '4': 'Repayment schedule',
          '5': 'Other document',
        },
        () => 'Other document'
      );
      return {
        answers: { docType, referenceId: generateRefId() },
        nextStep: 'COMPLETE',
        ackMessage:
          `📄 *${docType}* request registered.\n\n` +
          `Capri Loans App → Documents section se bhi download kar sakte hain.\n` +
          `Team 1 business day mein WhatsApp par bhej degi.`,
      };
    }

    case 'COMPLAINT_TYPE': {
      const complaintType = pickOption(
        message,
        {
          '1': 'Branch / staff',
          '2': 'Disbursal delay',
          '3': 'EMI / billing',
          '4': 'Document delay',
          '5': 'Other',
        },
        () => 'Other'
      );
      return {
        answers: { complaintType, referenceId: generateRefId() },
        nextStep: 'COMPLETE',
        ackMessage:
          `🎫 Complaint logged — *HIGH PRIORITY*\n` +
          `Category: ${complaintType}\n` +
          `Escalation team 4 ghante mein contact karegi.`,
      };
    }

    default:
      return { answers: {}, nextStep: 'MAIN_MENU' };
  }
}

export function calculateScore(answers: LeadAnswers): ScoreResult {
  let score = 0;
  if (answers.loanProduct === 'Gold Loan') score += 25;
  if (answers.loanProduct === 'Home Loan') score += 22;
  if (answers.loanProduct === 'MSME Loan') score += 28;
  if (answers.urgency?.includes('Urgent')) score += 25;
  else if (answers.urgency?.includes('week')) score += 18;
  if (answers.existingCustomer) score += 12;
  else score += 8;
  if (answers.complaintType) score += 30;
  if (answers.emiQuery) score += 15;
  score = Math.min(100, score + 10);

  const temperature = score >= 71 ? 'HOT' : score >= 41 ? 'WARM' : 'COLD';
  const priority = score >= 71 ? 'HIGH' : score >= 41 ? 'MEDIUM' : 'LOW';

  const summary = [
    answers.serviceType && `Service: ${answers.serviceType}`,
    answers.loanProduct && `Product: ${answers.loanProduct}`,
    answers.loanAmount && `Amount: ${answers.loanAmount}`,
    answers.city && `City: ${answers.city}`,
    answers.urgency && `Timeline: ${answers.urgency}`,
    `Priority: ${priority} (${score}/100)`,
  ]
    .filter(Boolean)
    .join(' · ');

  return { leadScore: score, temperature, priority, summary };
}

export function completionMessage(
  name: string,
  answers: LeadAnswers,
  score: ScoreResult,
  brand: string
): string {
  const ref = answers.referenceId ?? generateRefId();
  const loanBlock =
    answers.loanProduct
      ? `• Product: *${answers.loanProduct}*\n• Amount: ${answers.loanAmount ?? '—'}\n• City: ${answers.city ?? '—'}\n• Timeline: ${answers.urgency ?? '—'}\n`
      : '';

  return (
    `✅ *Request Registered — ${brand}*\n\n` +
    `Namaste *${name}* ji! Summary:\n\n` +
    `• Service: ${answers.serviceType ?? answers.supportQuery ?? answers.emiQuery ?? '—'}\n` +
    loanBlock +
    `• Customer: ${answers.existingCustomer ? 'Existing 🔄' : 'New 🌟'}\n` +
    `• Callback: ${answers.callbackPreference ?? 'Team will reach out'}\n\n` +
    `🎯 *Priority: ${score.priority}* (${score.leadScore}/100)\n` +
    `📋 *Reference:* \`${ref}\`\n\n` +
    `_Capri Loans — ${'1,400+ branches · Quick disbursal · Flexi-payment'}_\n\n` +
    `Hamari team jald contact karegi. Dhanyavaad! 🙏`
  );
}

export function parsePostCompleteCommand(text: string): string | null {
  const t = text.trim().toLowerCase();
  if (['menu', '0', 'start', 'help'].includes(t)) return 'MENU';
  if (['app', 'download'].includes(t)) return 'APP';
  if (['branch', 'branches'].includes(t)) return 'BRANCH';
  if (['rates', 'rate', 'gold'].includes(t)) return 'RATES';
  if (['products', 'product', 'loans'].includes(t)) return 'PRODUCTS';
  if (['emi', 'pay', 'payment'].includes(t)) return 'EMI';
  return null;
}
