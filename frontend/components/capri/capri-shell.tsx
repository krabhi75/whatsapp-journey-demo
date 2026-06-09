'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { CAPRI_BRAND, CAPRI_TENANT } from '@/lib/capri-demo-data';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';

const NAV = [
  { href: '/capri/whatsapp', label: 'Dashboard', icon: 'dashboard', matchPrefix: '/capri/whatsapp' },
  { href: '/capri/leads', label: 'Leads', icon: 'group', matchPrefix: '/capri/leads' },
  { href: '/capri/whatsapp', label: 'WhatsApp', icon: 'chat', matchPrefix: '/capri/whatsapp' },
  { href: '/capri/callbacks', label: 'Calls & Callbacks', icon: 'call', matchPrefix: '/capri/callbacks' },
  { href: '/capri/integrations', label: 'Integrations', icon: 'extension', matchPrefix: '/capri/integrations' },
  { href: '/capri/settings', label: 'Settings', icon: 'settings', matchPrefix: '/capri/settings' },
] as const;

function isActive(pathname: string, matchPrefix: string, label: string) {
  if (label === 'Dashboard') {
    return pathname === '/capri' || pathname === '/capri/whatsapp';
  }
  if (label === 'WhatsApp') {
    return pathname.startsWith('/capri/whatsapp') && pathname !== '/capri/whatsapp';
  }
  if (matchPrefix === '/capri/leads') return pathname.startsWith('/capri/leads');
  return pathname === matchPrefix || pathname.startsWith(matchPrefix + '/');
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {NAV.map((item) => {
        const active = isActive(pathname, item.matchPrefix, item.label);
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`capri-nav-link ${active ? 'active' : ''}`}
          >
            <CapriIcon name={item.icon} filled={active} size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandBlock() {
  return (
    <div className="capri-brand-mark px-4 py-5 border-b border-[var(--capri-outline-variant)]">
      <div className="capri-brand-icon">CG</div>
      <div>
        <div className="capri-brand-title">{CAPRI_BRAND.name}</div>
        <div className="capri-brand-sub">{CAPRI_BRAND.tagline}</div>
      </div>
    </div>
  );
}

export function CapriShell({
  children,
  searchPlaceholder = 'Search across communications...',
  title,
  breadcrumbs,
}: {
  children: ReactNode;
  searchPlaceholder?: string;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const pathname = usePathname();
  const { toast, clearToast, apiConnected, liveSessionCount, lastSyncedAt } = useCapriDemo();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="capri-app flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-[var(--capri-outline-variant)] bg-[var(--capri-surface-low)] md:flex"
        style={{ width: 'var(--capri-sidebar-width)' }}
      >
        <BrandBlock />
        <SidebarNav pathname={pathname} />
        <div className="mt-auto border-t border-[var(--capri-outline-variant)] px-3 py-4">
          <Link href="/capri/leads/new" className="capri-btn-primary mb-3 flex w-full py-2.5 text-sm">
            <CapriIcon name="add" size={18} />
            Add New Lead
          </Link>
          <Link href="/classic" className="capri-nav-link mb-1">
            <CapriIcon name="sensors" size={20} />
            Live API Sessions
          </Link>
          <button type="button" className="capri-nav-link w-full border-none bg-transparent">
            <CapriIcon name="help" size={20} />
            Support
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="relative flex h-full w-[280px] flex-col bg-[var(--capri-surface)] shadow-2xl">
            <BrandBlock />
            <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="capri-main-offset">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--capri-outline-variant)] bg-[var(--capri-surface)] px-4 shadow-sm md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <CapriIcon name="menu" size={24} />
            </button>

            {breadcrumbs ? (
              <nav className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--capri-on-surface-variant)] sm:flex">
                {breadcrumbs.map((b, i) => (
                  <span key={b.label} className="flex items-center gap-2">
                    {i > 0 && <CapriIcon name="chevron_right" size={14} />}
                    {b.href ? (
                      <Link
                        href={b.href}
                        className={i === breadcrumbs.length - 1 ? 'text-[var(--capri-primary)]' : 'hover:text-[var(--capri-primary)]'}
                      >
                        {b.label}
                      </Link>
                    ) : (
                      <span className="text-[var(--capri-primary)]">{b.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            ) : title ? (
              <h1 className="text-base font-bold text-[var(--capri-primary)] md:text-lg">{title}</h1>
            ) : (
              <div className="flex max-w-lg flex-1 items-center gap-2 rounded-full border border-[var(--capri-outline-variant)] bg-[var(--capri-surface-low)] px-4 py-2">
                <CapriIcon name="search" size={18} className="text-[var(--capri-on-surface-variant)]" />
                <input
                  className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none placeholder:text-[var(--capri-on-surface-variant)]"
                  placeholder={searchPlaceholder}
                />
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            <div
              className="hidden items-center gap-2 rounded-full border px-3 py-1 sm:flex"
              style={{
                borderColor: apiConnected ? '#a7f3d0' : 'var(--capri-outline-variant)',
                background: apiConnected ? '#ecfdf5' : 'var(--capri-surface-low)',
              }}
              title={lastSyncedAt ? `Synced ${new Date(lastSyncedAt).toLocaleTimeString()}` : undefined}
            >
              <span
                className={`h-2 w-2 rounded-full ${apiConnected ? 'animate-pulse bg-emerald-500' : 'bg-gray-400'}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                {apiConnected ? `Live · ${liveSessionCount} session${liveSessionCount === 1 ? '' : 's'}` : 'API offline'}
              </span>
            </div>
            <span className="hidden text-xs font-semibold text-[var(--capri-on-surface-variant)] lg:block">
              {CAPRI_TENANT}
            </span>
            <button type="button" className="relative rounded-full p-2 transition-colors hover:bg-[var(--capri-surface-low)]">
              <CapriIcon name="notifications" size={22} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--capri-primary-light)] to-[var(--capri-primary)] text-xs font-bold text-white shadow-md">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-4 z-[100] capri-toast md:bottom-8 md:right-8">
          <div className="flex min-w-[280px] max-w-[360px] items-center gap-3 rounded-2xl bg-[#0f1a18] px-5 py-4 text-white shadow-2xl md:min-w-[320px] md:gap-4 md:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--capri-whatsapp)]">
              <CapriIcon name="check_circle" filled size={22} className="text-white" />
            </div>
            <p className="flex-1 text-sm font-semibold">{toast}</p>
            <button type="button" onClick={clearToast} className="opacity-50 hover:opacity-100">
              <CapriIcon name="close" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CapriWaTabs({ active }: { active: 'overview' | 'templates' | 'logs' | 'campaigns' | 'settings' }) {
  const tabs = [
    { key: 'overview', label: 'Overview', href: '/capri/whatsapp' },
    { key: 'templates', label: 'Templates', href: '/capri/whatsapp/templates' },
    { key: 'logs', label: 'Message Logs', href: '/capri/whatsapp/logs' },
    { key: 'campaigns', label: 'Campaigns', href: '/capri/whatsapp/campaigns' },
    { key: 'settings', label: 'Settings', href: '/capri/whatsapp/settings' },
  ] as const;

  return (
    <div className="capri-wa-tabs">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`capri-wa-tab ${active === tab.key ? 'active' : ''}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
