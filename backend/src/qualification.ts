/** NBFC Customer Service — 5-step WhatsApp qualification journey */

export type QualStep =
  | 'WELCOME'
  | 'SERVICE_TYPE'
  | 'LOAN_PRODUCT'
  | 'LOAN_AMOUNT'
  | 'CUSTOMER_STATUS'
  | 'CALLBACK_PREF'
  | 'COMPLETE';

export interface LeadAnswers {
  serviceType?: string;
  loanProduct?: string;
  loanAmount?: string;
  existingCustomer?: boolean;
  callbackPreference?: string;
}

export interface ScoreResult {
  leadScore: number;
  temperature: 'HOT' | 'WARM' | 'COLD';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
}

const QUESTIONS: Record<string, string> = {
  WELCOME:
    'How can we help you today?\n\n' +
    '1. New Loan Application\n' +
    '2. EMI / Repayment Query\n' +
    '3. Account Statement / Documents\n' +
    '4. Complaint / Feedback\n\n' +
    'Reply with your choice (1–4).',
  SERVICE_TYPE:
    'Which loan product are you interested in?\n\n' +
    '1. Personal Loan\n' +
    '2. Home Loan\n' +
    '3. Business Loan\n' +
    '4. Vehicle Loan\n\n' +
    'Reply with your choice (1–4).',
  LOAN_PRODUCT:
    'What is the approximate loan amount you need?\n\n' +
    '1. Up to ₹5 Lakh\n' +
    '2. ₹5 – 25 Lakh\n' +
    '3. ₹25 Lakh and above\n\n' +
    'Reply with your choice (1–3).',
  LOAN_AMOUNT: 'Are you an existing customer with us?\n\nReply: *Yes* or *No*',
  CUSTOMER_STATUS:
    'When would you prefer a callback from our customer service team?\n\n' +
    '1. Morning (9 AM – 12 PM)\n' +
    '2. Afternoon (12 – 5 PM)\n' +
    '3. Evening (5 – 8 PM)\n\n' +
    'Reply with your choice (1–3).',
};

export function getQuestion(step: QualStep): string | null {
  return QUESTIONS[step] ?? null;
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

/** Skip loan product/amount for non-loan service requests */
function isLoanApplication(serviceType?: string): boolean {
  return serviceType?.includes('Loan Application') ?? false;
}

export function parseAnswer(
  step: QualStep,
  message: string,
  currentAnswers: LeadAnswers = {}
): { answers: Partial<LeadAnswers>; nextStep: QualStep; invalid?: boolean } {
  const text = message.trim().toLowerCase();

  switch (step) {
    case 'SERVICE_TYPE': {
      const serviceType = pickOption(
        message,
        {
          '1': 'New Loan Application',
          '2': 'EMI / Repayment Query',
          '3': 'Account Statement / Documents',
          '4': 'Complaint / Feedback',
        },
        (t) => {
          if (t.includes('loan') || t.includes('application') || t.includes('apply')) return 'New Loan Application';
          if (t.includes('emi') || t.includes('repay') || t.includes('payment')) return 'EMI / Repayment Query';
          if (t.includes('statement') || t.includes('document') || t.includes('noc')) return 'Account Statement / Documents';
          if (t.includes('complaint') || t.includes('feedback') || t.includes('issue')) return 'Complaint / Feedback';
          return null;
        }
      );
      const nextStep: QualStep = isLoanApplication(serviceType) ? 'LOAN_PRODUCT' : 'CUSTOMER_STATUS';
      return { answers: { serviceType }, nextStep };
    }

    case 'LOAN_PRODUCT': {
      const loanProduct = pickOption(
        message,
        {
          '1': 'Personal Loan',
          '2': 'Home Loan',
          '3': 'Business Loan',
          '4': 'Vehicle Loan',
        },
        (t) => {
          if (t.includes('personal')) return 'Personal Loan';
          if (t.includes('home') || t.includes('housing')) return 'Home Loan';
          if (t.includes('business') || t.includes('msme')) return 'Business Loan';
          if (t.includes('vehicle') || t.includes('car') || t.includes('auto')) return 'Vehicle Loan';
          return null;
        }
      );
      return { answers: { loanProduct }, nextStep: 'LOAN_AMOUNT' };
    }

    case 'LOAN_AMOUNT': {
      const loanAmount = pickOption(
        message,
        { '1': 'Up to ₹5 Lakh', '2': '₹5 – 25 Lakh', '3': '₹25 Lakh and above' },
        (t) => {
          if (t.includes('25') || t.includes('above') || t.includes('crore')) return '₹25 Lakh and above';
          if (t.includes('5') && !t.includes('25')) return '₹5 – 25 Lakh';
          return 'Up to ₹5 Lakh';
        }
      );
      return { answers: { loanAmount }, nextStep: 'CUSTOMER_STATUS' };
    }

    case 'CUSTOMER_STATUS': {
      if (!/^(yes|no|y|n|1|2|haan|nahi)$/i.test(text)) {
        return { answers: {}, nextStep: 'CUSTOMER_STATUS', invalid: true };
      }
      const existingCustomer =
        text.includes('yes') || text === 'y' || text === '1' || text.includes('haan');
      return { answers: { existingCustomer }, nextStep: 'CALLBACK_PREF' };
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
          if (t.includes('morning') || t.includes('9')) return 'Morning (9 AM – 12 PM)';
          if (t.includes('evening') || t.includes('5') || t.includes('8')) return 'Evening (5 – 8 PM)';
          return 'Afternoon (12 – 5 PM)';
        }
      );
      return { answers: { callbackPreference }, nextStep: 'COMPLETE' };
    }

    default:
      return { answers: {}, nextStep: 'SERVICE_TYPE' };
  }
}

export function calculateScore(answers: LeadAnswers): ScoreResult {
  let score = 0;

  const servicePts: Record<string, number> = {
    'New Loan Application': 30,
    'Complaint / Feedback': 28,
    'EMI / Repayment Query': 20,
    'Account Statement / Documents': 15,
  };
  const amountPts: Record<string, number> = {
    'Up to ₹5 Lakh': 10,
    '₹5 – 25 Lakh': 20,
    '₹25 Lakh and above': 30,
  };

  if (answers.serviceType) score += servicePts[answers.serviceType] ?? 10;
  if (answers.loanAmount) score += amountPts[answers.loanAmount] ?? 5;
  if (answers.existingCustomer === true) score += 15;
  else if (answers.existingCustomer === false) score += 8;
  if (answers.loanProduct) score += 10;
  if (answers.callbackPreference) score += 10;

  score = Math.min(100, score);

  const temperature = score >= 71 ? 'HOT' : score >= 41 ? 'WARM' : 'COLD';
  const priority = score >= 71 ? 'HIGH' : score >= 41 ? 'MEDIUM' : 'LOW';

  const summary = [
    answers.serviceType && `Service: ${answers.serviceType}`,
    answers.loanProduct && `Product: ${answers.loanProduct}`,
    answers.loanAmount && `Amount: ${answers.loanAmount}`,
    answers.existingCustomer !== undefined &&
      `Customer: ${answers.existingCustomer ? 'Existing' : 'New'}`,
    answers.callbackPreference && `Callback: ${answers.callbackPreference}`,
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
  brandName: string
): string {
  const loanLines =
    isLoanApplication(answers.serviceType) && answers.loanProduct
      ? `• Product: ${answers.loanProduct}\n• Amount: ${answers.loanAmount ?? '—'}\n`
      : '';

  return `Thank you ${name}! 🙏

*${brandName} — Customer Service*

We have registered your request:
• Service: ${answers.serviceType ?? '—'}
${loanLines}• Customer: ${answers.existingCustomer ? 'Existing' : 'New'}
• Callback: ${answers.callbackPreference ?? '—'}

*Priority: ${score.priority}* (${score.leadScore}/100)

Our customer service team will call you in your preferred time slot. For urgent EMI or complaint issues, you can also call our helpline.

Reference ID will be shared shortly. Thank you for banking with us.`;
}
