'use client';

import { useState } from 'react';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';
import { CapriShell, CapriWaTabs } from './capri-shell';

const STATUS_STYLE: Record<string, string> = {
  APPROVED: 'text-emerald-700 bg-emerald-50',
  PENDING: 'text-amber-700 bg-amber-50',
  DRAFT: 'text-slate-600 bg-slate-100',
};

export function CapriTemplatesPage() {
  const { templates, addTemplate, toggleTemplate, deleteTemplate, showToast } = useCapriDemo();
  const [form, setForm] = useState({
    name: '',
    category: 'UTILITY' as 'UTILITY' | 'MARKETING',
    description: '',
    preview: '',
    variables: 'customer_name, loan_product',
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.preview) return;
    addTemplate({
      name: form.name,
      category: form.category,
      status: 'DRAFT',
      active: false,
      preview: form.preview,
      variables: form.variables.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setForm({ name: '', category: 'UTILITY', description: '', preview: '', variables: 'customer_name, loan_product' });
  }

  return (
    <CapriShell>
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--capri-on-surface-variant)' }}>
        Mission Control
      </div>
      <h2 className="mb-1 text-2xl font-semibold">Templates</h2>
      <p className="mb-6 text-sm" style={{ color: 'var(--capri-on-surface-variant)' }}>
        Create templates in dashboard, submit to Meta, sync approval status
      </p>

      <CapriWaTabs active="templates" />

      <button
        type="button"
        className="capri-btn-outline mb-6"
        onClick={() => showToast('Synced 4 templates from Meta')}
      >
        <CapriIcon name="sync" size={18} />
        Sync from Meta
      </button>

      <div className="mb-8 capri-card p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
          Create Template
        </h3>
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase">Template Name *</label>
            <input
              className="capri-input"
              required
              placeholder="loan_callback_confirm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase">Category</label>
            <select
              className="capri-input capri-select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as 'UTILITY' | 'MARKETING' })}
            >
              <option value="UTILITY">UTILITY</option>
              <option value="MARKETING">MARKETING</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase">Body Preview *</label>
            <textarea
              className="capri-input min-h-[80px] resize-none py-3"
              required
              value={form.preview}
              onChange={(e) => setForm({ ...form, preview: e.target.value })}
              placeholder="Hi {{1}}, our {{2}} advisor will call you..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase">Variable labels</label>
            <input
              className="capri-input"
              value={form.variables}
              onChange={(e) => setForm({ ...form, variables: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="capri-btn-primary">
              <CapriIcon name="add" size={18} />
              Create Template
            </button>
          </div>
        </form>
      </div>

      <div className="capri-card overflow-hidden">
        <table className="capri-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Active</th>
              <th>Variables</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <td className="font-mono text-xs font-semibold">{t.name}</td>
                <td className="text-xs">{t.category}</td>
                <td>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLE[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleTemplate(t.id)}
                    className={`capri-pill text-[10px] ${t.active ? 'capri-pill-outbound' : 'capri-pill-inbound'}`}
                  >
                    {t.active ? 'ON' : 'OFF'}
                  </button>
                </td>
                <td className="text-xs">{t.variables.join(', ')}</td>
                <td>
                  <div className="flex gap-1">
                    {t.status === 'DRAFT' && (
                      <button
                        type="button"
                        className="capri-btn-outline px-2 py-1 text-[10px]"
                        onClick={() => showToast('Submitted to Meta for approval')}
                      >
                        Submit
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Delete this template?')) deleteTemplate(t.id);
                      }}
                    >
                      <CapriIcon name="delete" size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CapriShell>
  );
}
