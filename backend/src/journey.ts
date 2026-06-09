import {
  QualStep,
  getQuestion,
  parseAnswer,
  calculateScore,
  completionMessage,
} from './qualification';
import { addMessage, createLead, findLead, updateLead } from './store';
import { sendWhatsAppMessage } from './whatsapp';
import { env } from './config';

const GREETINGS = ['hi', 'hello', 'hey', 'hii', 'namaste', 'good morning', 'good evening', 'start'];

function isGreeting(text: string): boolean {
  const t = text.trim().toLowerCase();
  return GREETINGS.some((g) => t === g || t.startsWith(`${g} `));
}

export async function handleInboundMessage(
  phone: string,
  text: string,
  contactName?: string
): Promise<void> {
  let lead = findLead(phone);
  const brand = env.NBFC_BRAND_NAME;

  if (!lead && isGreeting(text)) {
    lead = createLead(phone, contactName?.trim() || 'Customer');
    const welcome =
      `Namaste ${lead.name} 🙏\n\n` +
      `Welcome to *${brand} Customer Service* on WhatsApp.\n\n` +
      `Main aapki madad kar sakti hoon — loan application, EMI query, documents, ya complaint ke liye.\n\n` +
      `${getQuestion('WELCOME')}`;
    addMessage(phone, 'IN', text);
    addMessage(phone, 'OUT', welcome);
    await sendWhatsAppMessage(phone, welcome);
    return;
  }

  if (!lead) {
    const hint = `Namaste! ${brand} Customer Service mein aapka swagat hai. Shuru karne ke liye *Hi* bhejein.`;
    await sendWhatsAppMessage(phone, hint);
    return;
  }

  addMessage(phone, 'IN', text);

  if (lead.step === 'COMPLETE') {
    const reply =
      `Hi ${lead.name}! Aapki request pehle se register hai (Priority: ${lead.score?.priority ?? '—'}).\n\n` +
      `Nayi query ke liye hamari team aapko call karegi. Dhanyavaad — ${brand}.`;
    addMessage(phone, 'OUT', reply);
    await sendWhatsAppMessage(phone, reply);
    return;
  }

  const { answers, nextStep, invalid } = parseAnswer(lead.step, text, lead.answers);

  if (invalid) {
    const hint = 'Kripya *Yes* ya *No* reply karein — kya aap hamare existing customer hain?';
    addMessage(phone, 'OUT', hint);
    await sendWhatsAppMessage(phone, hint);
    return;
  }

  const mergedAnswers = { ...lead.answers, ...answers };

  if (nextStep === 'COMPLETE') {
    const score = calculateScore(mergedAnswers);
    const msg = completionMessage(lead.name, mergedAnswers, score, brand);
    updateLead(phone, { step: 'COMPLETE', answers: mergedAnswers, score });
    addMessage(phone, 'OUT', msg);
    await sendWhatsAppMessage(phone, msg);
    return;
  }

  updateLead(phone, { step: nextStep as QualStep, answers: mergedAnswers });
  const question = getQuestion(nextStep);
  if (question) {
    addMessage(phone, 'OUT', question);
    await sendWhatsAppMessage(phone, question);
  }
}
