export type QualStep =
  | 'WELCOME'
  | 'PROPERTY_TYPE'
  | 'BUDGET'
  | 'TIMELINE'
  | 'PURPOSE'
  | 'LOAN'
  | 'COMPLETE';

export interface LeadAnswers {
  propertyType?: string;
  budget?: string;
  purchaseTimeline?: string;
  purpose?: string;
  loanRequired?: boolean;
}

export interface ScoreResult {
  leadScore: number;
  temperature: 'HOT' | 'WARM' | 'COLD';
  summary: string;
}

const QUESTIONS: Record<string, string> = {
  WELCOME:
    'What type of property are you looking for?\n\n1. 2 BHK\n2. 3 BHK\n3. Villa\n\nReply with your choice.',
  PROPERTY_TYPE:
    'What is your budget range?\n\n1. 40-60L\n2. 60-80L\n3. 80L+\n\nReply with your choice.',
  BUDGET:
    'When are you planning to purchase?\n\n1. 30 Days\n2. 3 Months\n3. 6 Months+\n\nReply with your choice.',
  TIMELINE: 'Is this for Self Use or Investment?\n\nReply: Self Use / Investment',
  PURPOSE: 'Do you require a Home Loan?\n\nReply: Yes / No',
};

export function getQuestion(step: QualStep): string | null {
  return QUESTIONS[step] ?? null;
}

function pickOption(message: string, map: Record<string, string>, fuzzy: (t: string) => string | null): string {
  const t = message.trim();
  if (/^[1-3]$/.test(t)) return map[t] ?? map['1'];
  return fuzzy(t.toLowerCase()) ?? map['1'];
}

export function parseAnswer(
  step: QualStep,
  message: string
): { answers: Partial<LeadAnswers>; nextStep: QualStep; invalid?: boolean } {
  const text = message.trim().toLowerCase();

  switch (step) {
    case 'PROPERTY_TYPE':
      return {
        answers: {
          propertyType: pickOption(message, { '1': '2 BHK', '2': '3 BHK', '3': 'Villa' }, (t) => {
            if (t.includes('villa')) return 'Villa';
            if (t.includes('3')) return '3 BHK';
            if (t.includes('2')) return '2 BHK';
            return null;
          }),
        },
        nextStep: 'BUDGET',
      };
    case 'BUDGET':
      return {
        answers: {
          budget: pickOption(message, { '1': '40-60L', '2': '60-80L', '3': '80L+' }, (t) => {
            if (t.includes('80')) return '80L+';
            if (t.includes('60')) return '60-80L';
            return '40-60L';
          }),
        },
        nextStep: 'TIMELINE',
      };
    case 'TIMELINE':
      return {
        answers: {
          purchaseTimeline: pickOption(
            message,
            { '1': '30 Days', '2': '3 Months', '3': '6 Months+' },
            (t) => {
              if (t.includes('30') || t.includes('day')) return '30 Days';
              if (t.includes('6')) return '6 Months+';
              return '3 Months';
            }
          ),
        },
        nextStep: 'PURPOSE',
      };
    case 'PURPOSE':
      return {
        answers: { purpose: text.includes('invest') ? 'Investment' : 'Self Use' },
        nextStep: 'LOAN',
      };
    case 'LOAN': {
      if (!/^(yes|no|y|n|1|2)$/i.test(text)) {
        return { answers: {}, nextStep: 'LOAN', invalid: true };
      }
      const loanRequired = text.includes('yes') || text === 'y' || text === '1';
      return { answers: { loanRequired }, nextStep: 'COMPLETE' };
    }
    default:
      return { answers: {}, nextStep: 'PROPERTY_TYPE' };
  }
}

export function calculateScore(answers: LeadAnswers): ScoreResult {
  let score = 0;
  const budgetPts: Record<string, number> = { '40-60L': 10, '60-80L': 15, '80L+': 25 };
  const timelinePts: Record<string, number> = { '30 Days': 30, '3 Months': 15, '6 Months+': 5 };

  if (answers.budget) score += budgetPts[answers.budget] ?? 10;
  if (answers.purchaseTimeline) score += timelinePts[answers.purchaseTimeline] ?? 5;
  if (answers.purpose?.includes('Self')) score += 15;
  else if (answers.purpose) score += 8;
  if (answers.loanRequired === true) score += 20;
  else if (answers.loanRequired === false) score += 10;
  if (answers.propertyType) score += 10;
  score = Math.min(100, score);

  const temperature = score >= 71 ? 'HOT' : score >= 41 ? 'WARM' : 'COLD';
  const summary = [
    answers.propertyType && `Property: ${answers.propertyType}`,
    answers.budget && `Budget: ${answers.budget}`,
    answers.purchaseTimeline && `Timeline: ${answers.purchaseTimeline}`,
    answers.purpose && `Purpose: ${answers.purpose}`,
    answers.loanRequired !== undefined && `Loan: ${answers.loanRequired ? 'Yes' : 'No'}`,
    `Score: ${score}/100 (${temperature})`,
  ]
    .filter(Boolean)
    .join(' · ');

  return { leadScore: score, temperature, summary };
}

export function completionMessage(name: string, answers: LeadAnswers, score: ScoreResult): string {
  return `Thank you ${name}! 🎉

Based on your preferences:
• Property: ${answers.propertyType ?? '—'}
• Budget: ${answers.budget ?? '—'}
• Timeline: ${answers.purchaseTimeline ?? '—'}
• Purpose: ${answers.purpose ?? '—'}

Your Lead Score: *${score.leadScore}/100* (${score.temperature})

${score.leadScore >= 70 ? 'Great! Our team will call you shortly to discuss next steps.' : 'Our team will share more options with you here on WhatsApp.'}`;
}
