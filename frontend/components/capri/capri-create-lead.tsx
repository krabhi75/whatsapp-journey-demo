'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';
import { CapriShell } from './capri-shell';

const LOAN_PRODUCTS = ['Personal Loan', 'Home Loan', 'Business Loan', 'Gold Loan'];
const AMOUNTS = ['Under ₹5L', '₹5–15L', '₹15–25L', '₹25L+'];
const INCOMES = ['₹3L - ₹6L', '₹6L - ₹12L', '₹12L - ₹24L', '₹24L+'];
const CITIES = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad'];

export function CapriCreateLead() {
  const router = useRouter();
  const { createLead } = useCapriDemo();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: 'Priya Nair',
    phone: '9876543210',
    email: '',
    city: 'Mumbai',
    product: 'Personal Loan',
    loanAmount: '₹5–15L',
    employment: 'Salaried',
    income: '₹12L - ₹24L',
    urgency: 'Immediate',
    notes: '',
    startWhatsApp: true,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const lead = createLead(form);
    setLoading(false);
    router.push(`/capri/leads/${lead.id}`);
  }

  return (
    <CapriShell
      breadcrumbs={[
        { label: 'Leads', href: '/capri/leads' },
        { label: 'New Manual Lead' },
      ]}
    >
      <div className="mx-auto max-w-[800px]">
        <div className="capri-card overflow-hidden">
          <div
            className="flex items-center justify-between border-b p-8"
            style={{ borderColor: 'var(--capri-outline-variant)' }}
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Create Test Lead</h2>
              <p className="text-sm" style={{ color: 'var(--capri-on-surface-variant)' }}>
                Manual creation for NBFC sandbox testing and loan verification.
              </p>
            </div>
            <span
              className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ background: 'rgba(0,131,120,0.1)', borderColor: 'rgba(0,131,120,0.2)', color: 'var(--capri-primary-container)' }}
            >
              Manual Entry
            </span>
          </div>

          <form id="capri-lead-form" onSubmit={handleSubmit} className="space-y-8 p-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2" style={{ color: 'var(--capri-primary)' }}>
                <CapriIcon name="person" size={22} />
                <h3 className="font-semibold">Personal Information</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Full Name
                  </label>
                  <input className="capri-input" required value={form.name} onChange={(e) => update('name', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-60">+91</span>
                    <input
                      className="capri-input pl-12"
                      required
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Email Address
                  </label>
                  <input className="capri-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    City
                  </label>
                  <select className="capri-input capri-select" value={form.city} onChange={(e) => update('city', e.target.value)}>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <hr style={{ borderColor: 'var(--capri-outline-variant)' }} />

            <section className="space-y-6">
              <div className="flex items-center gap-2" style={{ color: 'var(--capri-primary)' }}>
                <CapriIcon name="account_balance" size={22} />
                <h3 className="font-semibold">Loan & Employment Profile</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Loan Product
                  </label>
                  <select className="capri-input capri-select" value={form.product} onChange={(e) => update('product', e.target.value)}>
                    {LOAN_PRODUCTS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Requested Amount
                  </label>
                  <select className="capri-input capri-select" value={form.loanAmount} onChange={(e) => update('loanAmount', e.target.value)}>
                    {AMOUNTS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Employment Type
                  </label>
                  <div className="flex gap-2">
                    {['Salaried', 'Self-Employed'].map((emp) => (
                      <label key={emp} className="flex-1 cursor-pointer">
                        <input
                          type="radio"
                          name="employment"
                          className="sr-only"
                          checked={form.employment === emp}
                          onChange={() => update('employment', emp)}
                        />
                        <div
                          className="rounded-lg border py-2 text-center text-xs font-semibold uppercase tracking-wider transition-all"
                          style={{
                            borderColor: form.employment === emp ? 'var(--capri-primary-container)' : 'var(--capri-outline-variant)',
                            background: form.employment === emp ? 'var(--capri-secondary-container)' : 'transparent',
                            color: form.employment === emp ? 'var(--capri-on-secondary-container)' : 'var(--capri-on-surface-variant)',
                          }}
                        >
                          {emp}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Annual Income Range
                  </label>
                  <select className="capri-input capri-select" value={form.income} onChange={(e) => update('income', e.target.value)}>
                    {INCOMES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <hr style={{ borderColor: 'var(--capri-outline-variant)' }} />

            <section className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Urgency Level
                  </label>
                  <div className="flex gap-4">
                    {['Normal', 'Immediate'].map((u) => (
                      <label key={u} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="urgency"
                          checked={form.urgency === u}
                          onChange={() => update('urgency', u)}
                        />
                        <span className="text-sm">{u}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                    Lead Source
                  </label>
                  <input className="capri-input cursor-not-allowed opacity-60" readOnly value="Manual" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                  Internal Notes
                </label>
                <textarea
                  className="capri-input h-auto min-h-[80px] resize-none py-3"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Add specific requirements or context for the loan officer..."
                />
              </div>

              <div
                className="flex items-center justify-between rounded-xl border p-4"
                style={{ background: 'rgba(0,131,120,0.05)', borderColor: 'rgba(0,131,120,0.2)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm" style={{ color: 'var(--capri-whatsapp)' }}>
                    <CapriIcon name="chat" size={28} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--capri-primary)' }}>
                      Start WhatsApp engagement immediately
                    </p>
                    <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>
                      Send automated welcome message via WhatsApp API
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.startWhatsApp}
                    onChange={(e) => update('startWhatsApp', e.target.checked)}
                  />
                  <div
                    className="h-6 w-11 rounded-full transition-colors"
                    style={{ background: form.startWhatsApp ? 'var(--capri-primary)' : 'var(--capri-outline-variant)' }}
                  >
                    <div
                      className="mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: form.startWhatsApp ? 'translateX(22px)' : 'translateX(2px)' }}
                    />
                  </div>
                </label>
              </div>
            </section>
          </form>

          <div
            className="flex items-center justify-end gap-4 border-t p-8"
            style={{ borderColor: 'var(--capri-outline-variant)', background: 'var(--capri-surface-low)' }}
          >
            <Link href="/capri/leads" className="capri-btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              form="capri-lead-form"
              className="capri-btn-primary"
              disabled={loading}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <CapriIcon name="person_add" size={20} />
                  Create Lead
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </CapriShell>
  );
}
