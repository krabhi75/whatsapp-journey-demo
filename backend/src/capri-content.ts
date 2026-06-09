/** Capri Loans (capriloans.in) — product & conversation content */

export const CAPRI_TAGLINE = 'Sapno ko haqeeqat se milate hain, Farz nibhaate hain';

export const CAPRI_STATS = '6.9L+ customers · 1,400+ branches · Quick disbursal';

export const CAPRI_APP_URL = 'https://www.capriloans.in/';

export interface CapriProduct {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  minAmount: string;
  maxAmount: string;
  highlight: string;
}

export const CAPRI_PRODUCTS: CapriProduct[] = [
  {
    id: 'gold',
    name: 'Gold Loan',
    emoji: '🏆',
    tagline: 'Instant funds by pledging gold',
    minAmount: '₹3,000',
    maxAmount: '₹30 Lakh',
    highlight: 'Same-day disbursal · Flexible repayment · Gold safe & secure',
  },
  {
    id: 'home',
    name: 'Home Loan',
    emoji: '🏠',
    tagline: 'Buy or build your dream home',
    minAmount: '₹5 Lakh',
    maxAmount: '₹150 Lakh',
    highlight: 'Easy EMIs · Quick approval · 1,400+ branch support',
  },
  {
    id: 'msme',
    name: 'MSME Loan',
    emoji: '💼',
    tagline: 'Fuel your business growth',
    minAmount: '₹1 Lakh',
    maxAmount: '₹150 Lakh',
    highlight: 'Working capital · Business expansion · Fast approvals',
  },
  {
    id: 'lap',
    name: 'Micro LAP',
    emoji: '🏗️',
    tagline: 'Funds against property for business',
    minAmount: '₹2 Lakh',
    maxAmount: '₹10 Lakh',
    highlight: 'Unlock property value · Business needs',
  },
  {
    id: 'construction',
    name: 'Construction Finance',
    emoji: '🔨',
    tagline: 'Large-scale construction projects',
    minAmount: 'Flexible',
    maxAmount: 'Project-based',
    highlight: 'Builder & contractor finance · Milestone-based disbursal',
  },
];

export const DEMO_BRANCHES: Record<string, string[]> = {
  delhi: ['Capri Loans — Connaught Place, New Delhi', 'Capri Loans — Lajpat Nagar, New Delhi'],
  mumbai: ['Capri Loans — Andheri West, Mumbai', 'Capri Loans — Thane, Maharashtra'],
  pune: ['Capri Loans — Kothrud, Pune', 'Capri Loans — Hinjewadi, Pune'],
  bangalore: ['Capri Loans — Koramangala, Bengaluru', 'Capri Loans — Whitefield, Bengaluru'],
  noida: ['Capri Loans — Sector 18, Noida', 'Capri Loans — Greater Noida'],
  ghaziabad: ['Capri Loans — Raj Nagar, Ghaziabad'],
  default: ['Capri Loans — Nearest branch: Visit capriloans.in/branches', 'Call 1800-XXX-XXXX (demo helpline)'],
};

export function productAck(productName: string): string {
  const p = CAPRI_PRODUCTS.find((x) => x.name === productName);
  if (!p) return `Bahut badhiya choice! Chaliye aapki requirement samajhte hain.`;
  return (
    `${p.emoji} *${p.name}* — excellent choice!\n\n` +
    `${p.tagline}\n` +
    `💰 *${p.minAmount}* se *${p.maxAmount}* tak\n` +
    `✨ ${p.highlight}\n\n` +
    `Capri Loans — ${CAPRI_STATS}`
  );
}

export function mainMenu(brand: string): string {
  return (
    `*${brand}* par aapka swagat hai! 🙏\n\n` +
    `_${CAPRI_TAGLINE}_\n\n` +
    `Main aapki kaise madad kar sakti hoon? Reply with number:\n\n` +
    `1️⃣ 🏆 *Gold Loan* — instant cash (₹3K – ₹30L)\n` +
    `2️⃣ 🏠 *Home Loan* — sapna ghar (₹5L – ₹150L)\n` +
    `3️⃣ 💼 *MSME / Business Loan* — business growth\n` +
    `4️⃣ 🏗️ *Micro LAP / Construction Finance*\n` +
    `5️⃣ 💳 *EMI, Pay Now & Account help*\n` +
    `6️⃣ 📍 *Branch, Documents & Complaint*\n` +
    `7️⃣ 📋 *All products & interest rates*\n\n` +
    `_Tip: Hindi + English dono chalega — bas number reply karein!_`
  );
}

export function welcomeMessage(name: string, brand: string): string {
  return (
    `Namaste *${name}* ji! 🙏✨\n\n` +
    `Aap *${brand}* (Capri Loans) ke official WhatsApp channel par hain.\n\n` +
    `Yahan se aap loan apply, EMI pay, documents aur branch info — sab kuch chat se manage kar sakte hain.\n\n` +
    `Chaliye shuru karte hain... 👇`
  );
}

export function productsCatalog(): string {
  return CAPRI_PRODUCTS.map(
    (p, i) =>
      `${i + 1}. ${p.emoji} *${p.name}*\n   ${p.tagline}\n   ${p.minAmount} – ${p.maxAmount}`
  ).join('\n\n');
}

export function goldRateDemo(): string {
  return (
    `📊 *Capri Gold Loan — Demo Rates*\n\n` +
    `• Loan against gold jewellery — competitive per-gram rate\n` +
    `• Minimum loan: *₹3,000*\n` +
    `• Maximum: up to *₹30 Lakh*\n` +
    `• Same-day disbursal at branch\n` +
    `• Flexible repayment — pay interest only or full EMI\n\n` +
    `_Exact rate aapke branch par gold purity ke hisaab se milega._\n\n` +
    `Apply karne ke liye reply *1* (Gold Loan)`
  );
}

export function emiHelpMenu(): string {
  return (
    `💳 *EMI & Payment Help*\n\n` +
    `1. Pay EMI online (Pay Now)\n` +
    `2. EMI due date / outstanding balance\n` +
    `3. Foreclosure / part-payment\n` +
    `4. NOC / loan closure certificate\n` +
    `5. Speak to accounts team\n\n` +
    `Reply 1–5`
  );
}

export function supportMenu(): string {
  return (
    `📍 *Branch, Documents & Support*\n\n` +
    `1. Nearest branch locator\n` +
    `2. Download statement / SOA\n` +
    `3. KYC / document upload help\n` +
    `4. Register complaint (priority)\n` +
    `5. Talk to customer care\n\n` +
    `Reply 1–5`
  );
}

export function generateRefId(): string {
  return `CGL-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

export function nearestBranches(cityInput: string): string {
  const key = Object.keys(DEMO_BRANCHES).find((k) => cityInput.toLowerCase().includes(k)) ?? 'default';
  const branches = DEMO_BRANCHES[key];
  return (
    `📍 *Capri Loans branches near ${cityInput}:*\n\n` +
    branches.map((b, i) => `${i + 1}. ${b}`).join('\n') +
    `\n\n🕐 Mon–Sat 9:30 AM – 6:00 PM\n` +
    `📱 Capri Loans App se appointment book karein`
  );
}

export function postCompleteMenu(brand: string): string {
  return (
    `*Quick actions:*\n\n` +
    `• Reply *MENU* — main menu\n` +
    `• Reply *APP* — Capri Loans app link\n` +
    `• Reply *BRANCH* — branch locator\n` +
    `• Reply *RATES* — gold loan rates\n` +
    `• Reply *PRODUCTS* — all loan products\n` +
    `• Reply *EMI* — payment help\n\n` +
    `— ${brand} Customer Service`
  );
}
