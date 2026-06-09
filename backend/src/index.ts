import cors from 'cors';
import express from 'express';
import { env, isWhatsAppLive } from './config';
import { handleInboundMessage } from './journey';
import { listLeads } from './store';

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN }));
app.use(express.json());

/** Meta webhook verification — MUST return hub.challenge as plain text */
function verifyWebhook(req: express.Request, res: express.Response): void {
  const mode = String(req.query['hub.mode'] ?? '');
  const token = String(req.query['hub.verify_token'] ?? '').trim();
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && challenge != null && token === env.WEBHOOK_VERIFY_TOKEN.trim()) {
    console.log('Webhook verified successfully');
    res.status(200).type('text/plain').send(String(challenge));
    return;
  }

  console.warn('Webhook verify failed', { mode, token, expected: env.WEBHOOK_VERIFY_TOKEN });
  res.sendStatus(403);
}

async function handleWebhookPost(req: express.Request, res: express.Response): Promise<void> {
  res.sendStatus(200);

  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    const messages = value?.messages;
    if (!messages?.length) return;

    for (const msg of messages) {
      const phone = msg.from as string;
      const text =
        msg.text?.body ||
        msg.button?.text ||
        msg.interactive?.button_reply?.title ||
        '';
      const contactName = value?.contacts?.[0]?.profile?.name as string | undefined;
      if (text) {
        await handleInboundMessage(phone, text, contactName);
      }
    }
  } catch (error) {
    console.error('Webhook processing error', error);
  }
}

app.get('/health', (_req, res) => {
  const allowedPhones = env.WHATSAPP_ALLOWED_PHONES.split(',').map((p) => p.trim()).filter(Boolean);
  res.json({
    ok: true,
    service: 'whatsapp-journey-demo',
    journey: 'Capri Global — Dynamic WhatsApp CS',
    brand: env.NBFC_BRAND_NAME,
    whatsappLive: isWhatsAppLive,
    safeMode: env.WHATSAPP_SAFE_MODE,
    allowedPhones: env.WHATSAPP_SAFE_MODE ? allowedPhones : 'all (safe mode off)',
    webhookUrl: `${env.APP_URL}/webhooks/whatsapp`,
    verifyToken: env.WEBHOOK_VERIFY_TOKEN,
  });
});

app.get('/api/leads', (_req, res) => {
  res.json({ success: true, data: listLeads() });
});

app.get('/webhooks/whatsapp', verifyWebhook);
app.post('/webhooks/whatsapp', handleWebhookPost);

// Meta sometimes configured without path prefix
app.get('/api/v1/webhooks/whatsapp', verifyWebhook);
app.post('/api/v1/webhooks/whatsapp', handleWebhookPost);

app.listen(env.PORT, () => {
  console.log(`WhatsApp Journey Demo API on port ${env.PORT}`);
  console.log(`Webhook URL: ${env.APP_URL}/webhooks/whatsapp`);
  console.log(`Verify token: ${env.WEBHOOK_VERIFY_TOKEN}`);
  console.log(`WhatsApp live: ${isWhatsAppLive}`);
});
