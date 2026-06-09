import { env, isWhatsAppLive } from './config';

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith('91')) return digits;
  return digits;
}

function resolveOutboundPhone(phone: string): string {
  const allowed = env.WHATSAPP_ALLOWED_PHONES.split(',').map((p) => p.trim()).filter(Boolean);
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (!env.WHATSAPP_SAFE_MODE || allowed.some((a) => a.replace(/\D/g, '').slice(-10) === digits)) {
    return formatPhone(phone);
  }
  return '919999999999';
}

export async function sendWhatsAppMessage(phone: string, message: string): Promise<string | null> {
  const to = resolveOutboundPhone(phone);

  if (!isWhatsAppLive) {
    console.log(`[DEMO WhatsApp] To ${to}: ${message.slice(0, 100)}...`);
    return `demo-${Date.now()}`;
  }

  const url = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('WhatsApp send failed', err);
    throw new Error(`WhatsApp API error: ${err}`);
  }

  const data = (await res.json()) as { messages?: { id: string }[] };
  return data.messages?.[0]?.id ?? null;
}
