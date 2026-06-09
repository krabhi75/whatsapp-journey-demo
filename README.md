# NBFC WhatsApp Customer Service Demo

Standalone NBFC customer service WhatsApp journey. **No property / realty CRM dependency.**

Supports **multiple office phones** for testing (`WHATSAPP_SAFE_MODE=false`).

- **Backend (Render):** Webhook + journey logic
- **Frontend (Vercel):** Stitch-designed Capri CRM UI (`/capri`) + live API dashboard (`/classic`)

## Why localtunnel failed

Meta could not verify `loca.lt` because:
1. Tunnel may be down or backend not running
2. Verify token mismatch (`waba-webhook-verify` must match `WEBHOOK_VERIFY_TOKEN` in backend)
3. localtunnel often blocks Meta's verification crawler

**Fix:** Deploy backend to Render → stable HTTPS callback URL.

---

## Meta Webhook Configuration

| Field | Value |
|-------|-------|
| **Callback URL** | `https://YOUR-RENDER-APP.onrender.com/webhooks/whatsapp` |
| **Verify token** | `waba-webhook-verify` |
| **Subscribe to** | `messages` only |

Do **not** subscribe to `account_alerts`, `account_update`, etc. — not needed for this demo.

---

## Deploy Backend (Render)

1. Push this repo to GitHub
2. Render → New Web Service → connect repo
3. **Root directory:** `backend`
4. **Build command:** `npm install && npm run build`
5. **Start command:** `npm start`

> **IMPORTANT:** This demo has **no Prisma / no database**.  
> Do **NOT** use `npx prisma generate` in the build command (that is for the main realty-ai-sdr project only).

6. **Environment variables:**

```
APP_URL=https://YOUR-RENDER-APP.onrender.com
WHATSAPP_VERIFY_TOKEN=propertypilot2026
WHATSAPP_PHONE_NUMBER_ID=<from Meta>
WHATSAPP_ACCESS_TOKEN=<permanent token>
DEMO_MODE=false
WHATSAPP_SAFE_MODE=false
NBFC_BRAND_NAME=Capri Global
CORS_ORIGIN=https://YOUR-VERCEL-APP.vercel.app
```

**Multi-phone office testing:**
- `WHATSAPP_SAFE_MODE=false` → all numbers receive messages (recommended for office demo)
- `WHATSAPP_SAFE_MODE=true` + `WHATSAPP_ALLOWED_PHONES=9430590142,9876543210,9123456789` → restrict to listed numbers only

(`WHATSAPP_VERIFY_TOKEN` or `META_VERIFY_TOKEN` work — must match Meta webhook verify token.)

7. After deploy, test:
```bash
curl "https://YOUR-RENDER-APP.onrender.com/health"
curl "https://YOUR-RENDER-APP.onrender.com/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=waba-webhook-verify&hub.challenge=test123"
# Must return: test123
```

8. Paste callback URL in Meta → Verify and save

---

## Deploy Frontend (Vercel)

1. Vercel → New Project → import same repo
2. **Root directory:** `frontend`
3. **Env:** `NEXT_PUBLIC_API_URL=https://YOUR-RENDER-APP.onrender.com`
4. Deploy

**Routes after deploy:**
- `https://YOUR-APP.vercel.app/` → WhatsApp Overview (Stitch UI)
- `/capri/leads` → Lead management
- `/capri/leads/priya-nair` → WhatsApp thread + callback demo
- `/classic` → Live sessions from Render API

---

## Local dev

```bash
cd backend && cp .env.example .env && npm install && npm run dev
cd frontend && cp .env.example .env && npm install && npm run dev
```

---

## Demo flow (Capri Global — capriloans.in)

```
Hi → Welcome (2 messages) → Main menu (7 options)

Loan paths: Gold / Home / MSME / LAP
  → Product ack + highlights
  → Amount (product-specific ranges)
  → City → Urgency → Existing customer? → Callback
  → Reference ID + priority score

Other paths: EMI/Pay Now · Branch locator · Documents · Complaints

After complete: MENU · APP · BRANCH · RATES · PRODUCTS · EMI
```
