import {
  QualStep,
  getQuestion,
  parseAnswer,
  calculateScore,
  completionMessage,
} from './qualification';
import { addMessage, createLead, findLead, updateLead } from './store';
import { sendWhatsAppMessage } from './whatsapp';

const GREETINGS = ['hi', 'hello', 'hey', 'hii', 'namaste', 'good morning', 'good evening'];

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

  if (!lead && isGreeting(text)) {
    lead = createLead(phone, contactName?.trim() || 'WhatsApp Lead');
    const welcome = `Hi ${lead.name} 👋\n\nWelcome to the WhatsApp Journey Demo!\n\nI will ask a few quick questions to qualify your property interest.\n\n${getQuestion('WELCOME')}`;
    addMessage(phone, 'IN', text);
    addMessage(phone, 'OUT', welcome);
    await sendWhatsAppMessage(phone, welcome);
    return;
  }

  if (!lead) {
    console.warn('Unknown phone — send Hi to start', phone);
    return;
  }

  addMessage(phone, 'IN', text);

  if (lead.step === 'COMPLETE') {
    const reply = `Hi ${lead.name}! You are already qualified (Score: ${lead.score?.leadScore ?? '—'}). Reply *hi* on a new session after server reset.`;
    addMessage(phone, 'OUT', reply);
    await sendWhatsAppMessage(phone, reply);
    return;
  }

  const { answers, nextStep, invalid } = parseAnswer(lead.step, text);

  if (invalid) {
    const hint = 'Please reply *Yes* or *No* for home loan requirement.';
    addMessage(phone, 'OUT', hint);
    await sendWhatsAppMessage(phone, hint);
    return;
  }

  const mergedAnswers = { ...lead.answers, ...answers };

  if (nextStep === 'COMPLETE') {
    const score = calculateScore(mergedAnswers);
    const msg = completionMessage(lead.name, mergedAnswers, score);
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
