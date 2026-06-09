import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Accept Meta portal naming (WHATSAPP_VERIFY_TOKEN / META_VERIFY_TOKEN)
if (!process.env.WEBHOOK_VERIFY_TOKEN?.trim()) {
  process.env.WEBHOOK_VERIFY_TOKEN =
    process.env.WHATSAPP_VERIFY_TOKEN?.trim() ||
    process.env.META_VERIFY_TOKEN?.trim() ||
    'waba-webhook-verify';
}

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  APP_URL: z.string().default('http://localhost:4000'),
  WEBHOOK_VERIFY_TOKEN: z.string().default('waba-webhook-verify'),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_API_VERSION: z.string().default('v21.0'),
  DEMO_MODE: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  WHATSAPP_SAFE_MODE: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  WHATSAPP_ALLOWED_PHONES: z.string().default(''),
  /** Comma-separated office test numbers — only used when WHATSAPP_SAFE_MODE=true */
  CORS_ORIGIN: z.string().default('*'),
  NBFC_BRAND_NAME: z.string().default('Capri Global'),
});

export const env = schema.parse(process.env);

export const isWhatsAppLive = Boolean(
  env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_ACCESS_TOKEN && !env.DEMO_MODE
);
