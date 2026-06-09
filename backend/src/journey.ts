import {
  QualStep,
  getQuestion,
  parseAnswer,
  parseMainMenu,
  parsePostCompleteCommand,
  calculateScore,
  completionMessage,
} from './qualification';
import { addMessage, createLead, findLead, updateLead } from './store';
import { sendWhatsAppMessage } from './whatsapp';
import { env } from './config';
import {
  welcomeMessage,
  mainMenu,
  postCompleteMenu,
  goldRateDemo,
  productsCatalog,
  emiHelpMenu,
  supportMenu,
  CAPRI_APP_URL,
} from './capri-content';

const GREETINGS = [
  'hi', 'hello', 'hey', 'hii', 'namaste', 'good morning', 'good evening',
  'start', 'capri', 'loan', 'help',
];

function isGreeting(text: string): boolean {
  const t = text.trim().toLowerCase();
  return GREETINGS.some((g) => t === g || t.startsWith(`${g} `));
}

async function sendMessages(phone: string, messages: string[]): Promise<void> {
  for (const msg of messages) {
    if (!msg.trim()) continue;
    addMessage(phone, 'OUT', msg);
    await sendWhatsAppMessage(phone, msg);
  }
}

async function sendWithAck(
  phone: string,
  ack: string | undefined,
  extras: string[] | undefined,
  next: string | undefined
): Promise<void> {
  const batch: string[] = [];
  if (ack) batch.push(ack);
  if (extras?.length) batch.push(...extras);
  if (next) batch.push(next);
  await sendMessages(phone, batch);
}

export async function handleInboundMessage(
  phone: string,
  text: string,
  contactName?: string
): Promise<void> {
  const brand = env.NBFC_BRAND_NAME;
  let lead = findLead(phone);

  if (!lead && isGreeting(text)) {
    lead = createLead(phone, contactName?.trim() || 'Customer');
    lead.step = 'MAIN_MENU';
    addMessage(phone, 'IN', text);
    await sendMessages(phone, [
      welcomeMessage(lead.name, brand),
      mainMenu(brand),
    ]);
    return;
  }

  if (!lead) {
    await sendWhatsAppMessage(
      phone,
      `Namaste! 👋 *${brand}* WhatsApp par aapka swagat hai.\n\nShuru karne ke liye *Hi* bhejein.`
    );
    return;
  }

  addMessage(phone, 'IN', text);

  // Post-complete quick commands
  if (lead.step === 'COMPLETE' || lead.step === 'POST_COMPLETE') {
    const cmd = parsePostCompleteCommand(text);
    if (cmd === 'MENU') {
      updateLead(phone, { step: 'MAIN_MENU', answers: {} });
      await sendWhatsAppMessage(phone, mainMenu(brand));
      return;
    }
    if (cmd === 'APP') {
      await sendWhatsAppMessage(
        phone,
        `📱 *Capri Loans App*\n\nDownload karein:\n${CAPRI_APP_URL}\n\n✅ Apply in minutes\n✅ Pay Now\n✅ Track loan status`
      );
      return;
    }
    if (cmd === 'BRANCH') {
      updateLead(phone, { step: 'BRANCH_CITY' });
      await sendWhatsAppMessage(phone, `📍 Branch locator — apna *city* batayein:`);
      return;
    }
    if (cmd === 'RATES') {
      await sendWhatsAppMessage(phone, goldRateDemo());
      return;
    }
    if (cmd === 'PRODUCTS') {
      await sendMessages(phone, [
        `📋 *Capri Loans — Products*\n\n${productsCatalog()}`,
        `Apply: reply *1* Gold · *2* Home · *3* MSME · *4* LAP\nOr *MENU* for full options`,
      ]);
      return;
    }
    if (cmd === 'EMI') {
      updateLead(phone, { step: 'EMI_SUBMENU', answers: { flow: 'EMI', serviceType: 'EMI / Pay Now' } });
      await sendWhatsAppMessage(phone, emiHelpMenu());
      return;
    }
    if (!cmd) {
      await sendWhatsAppMessage(
        phone,
        `Aapki request *${lead.answers.referenceId ?? 'registered'}* pehle se hai.\n\n` + postCompleteMenu(brand)
      );
      updateLead(phone, { step: 'POST_COMPLETE' });
      return;
    }
  }

  if (lead.step === 'MAIN_MENU') {
    const result = parseMainMenu(text);
    if (result.invalid) {
      await sendWhatsAppMessage(phone, `❓ ${result.invalidHint ?? 'Reply 1–7'}\n\n` + mainMenu(brand));
      return;
    }
    const merged = { ...lead.answers, ...result.answers };
    let nextQ: string | null = null;
    if (result.nextStep === 'EMI_SUBMENU') nextQ = emiHelpMenu();
    else if (result.nextStep === 'SUPPORT_SUBMENU') nextQ = supportMenu();
    else nextQ = getQuestion(result.nextStep, merged);

    updateLead(phone, { step: result.nextStep, answers: merged });
    await sendWithAck(phone, result.ackMessage, result.extraMessages, nextQ ?? undefined);
    return;
  }

  const result = parseAnswer(lead.step, text, lead.answers);

  if (result.invalid) {
    await sendWhatsAppMessage(phone, result.invalidHint ?? 'Please try again.');
    return;
  }

  const mergedAnswers = { ...lead.answers, ...result.answers };

  if (result.nextStep === 'COMPLETE') {
    const score = calculateScore(mergedAnswers);
    const done = completionMessage(lead.name, mergedAnswers, score, brand);
    updateLead(phone, { step: 'POST_COMPLETE', answers: mergedAnswers, score });
    await sendWithAck(phone, result.ackMessage, result.extraMessages, done);
    await sendWhatsAppMessage(phone, postCompleteMenu(brand));
    return;
  }

  updateLead(phone, { step: result.nextStep, answers: mergedAnswers });
  const question = getQuestion(result.nextStep, mergedAnswers);
  await sendWithAck(phone, result.ackMessage, result.extraMessages, question ?? undefined);
}
