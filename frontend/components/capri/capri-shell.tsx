'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { CAPRI_TENANT } from '@/lib/capri-demo-data';
import { CapriIcon } from './capri-icon';
import { useCapriDemo } from './capri-demo-context';

const NAV = [
  { href: '/capri/whatsapp', label: 'Dashboard', icon: 'dashboard', section: 'main', matchPrefix: '/capri/whatsapp' },
  { href: '/capri/leads', label: 'Leads', icon: 'group', section: 'main', matchPrefix: '/capri/leads' },
  { href: '/capri/whatsapp', label: 'WhatsApp', icon: 'chat', section: 'main', matchPrefix: '/capri/whatsapp' },
  { href: '/capri/callbacks', label: 'Calls & Callbacks', icon: 'call', section: 'main', matchPrefix: '/capri/callbacks' },
  { href: '/capri/integrations', label: 'Integrations', icon: 'extension', section: 'main', matchPrefix: '/capri/integrations' },
  { href: '/capri/settings', label: 'Settings', icon: 'settings', section: 'main', matchPrefix: '/capri/settings' },
] as const;

function isActive(pathname: string, matchPrefix: string) {
  if (matchPrefix === '/capri/leads') {
    return pathname.startsWith('/capri/leads');
  }
  if (pathname === '/capri' && matchPrefix === '/capri/whatsapp') return true;
  return pathname === matchPrefix || pathname.startsWith(matchPrefix + '/');
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
  const { toast, clearToast } = useCapriDemo();

  return (
    <div className="capri-app flex min-h-screen">
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r md:flex"
        style={{
          width: 'var(--capri-sidebar-width)',
          background: 'var(--capri-surface-low)',
          borderColor: 'var(--capri-outline-variant)',
        }}
      >
        <div className="px-4 py-5">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--capri-primary)' }}>
            Capri WhatsApp Demo
          </h2>
          <p className="text-xs" style={{ color: 'var(--capri-on-surface-variant)' }}>
            Institutional AI
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.filter((n) => n.section === 'main').map((item) => {
            const active = isActive(pathname, item.matchPrefix);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all"
                style={{
                  background: active ? 'var(--capri-secondary-container)' : 'transparent',
                  color: active ? 'var(--capri-on-secondary-container)' : 'var(--capri-on-surface-variant)',
                  transform: active ? 'translateX(4px)' : undefined,
                }}
              >
                <CapriIcon name={item.icon} filled={active} size={20} />
                <span className="text-xs uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t px-3 py-4" style={{ borderColor: 'var(--capri-outline-variant)' }}>
          <Link
            href="/capri/leads/new"
            className="capri-btn-primary mb-3 flex w-full justify-center py-2.5 text-sm"
          >
            <CapriIcon name="add" size={18} />
            Add New Lead
          </Link>
          <Link
            href="/classic"
            className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-black/5"
            style={{ color: 'var(--capri-on-surface-variant)' }}
          >
            <CapriIcon name="sensors" size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">Live API Sessions</span>
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm"
            style={{ color: 'var(--capri-on-surface-variant)' }}
          >
            <CapriIcon name="help" size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">Support</span>
          </button>
        </div>
      </aside>

      <div
        className="flex min-h-screen flex-1 flex-col"
        style={{ marginLeft: 'var(--capri-sidebar-width)' }}
      >
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-6"
          style={{
            background: 'var(--capri-surface)',
            borderColor: 'var(--capri-outline-variant)',
          }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {breadcrumbs ? (
              <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--capri-on-surface-variant)' }}>
                {breadcrumbs.map((b, i) => (
                  <span key={b.label} className="flex items-center gap-2">
                    {i > 0 && <CapriIcon name="chevron_right" size={16} />}
                    {b.href ? (
                      <Link href={b.href} className="hover:underline" style={{ color: i === breadcrumbs.length - 1 ? 'var(--capri-primary)' : undefined }}>
                        {b.label}
                      </Link>
                    ) : (
                      <span style={{ color: 'var(--capri-primary)' }}>{b.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            ) : title ? (
              <h1 className="text-lg font-bold" style={{ color: 'var(--capri-primary)' }}>
                {title}
              </h1>
            ) : (
              <div
                className="flex max-w-md flex-1 items-center gap-2 rounded-full border px-3 py-1.5"
                style={{ background: 'var(--capri-surface-low)', borderColor: 'var(--capri-outline-variant)' }}
              >
                <CapriIcon name="search" size={18} className="opacity-60" />
                <input
                  className="flex-1 border-none bg-transparent text-sm outline-none"
                  placeholder={searchPlaceholder}
                  style={{ color: 'var(--capri-on-surface)' }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium sm:block" style={{ color: 'var(--capri-on-surface-variant)' }}>
              {CAPRI_TENANT}
            </span>
            <button type="button" className="relative rounded-full p-2 hover:bg-black/5">
              <CapriIcon name="notifications" size={22} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button type="button" className="rounded-full p-2 hover:bg-black/5">
              <CapriIcon name="help" size={22} />
            </button>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: 'var(--capri-secondary-container)', color: 'var(--capri-on-secondary-container)' }}
            >
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[100] capri-toast">
          <div
            className="flex min-w-[320px] items-center gap-4 rounded-xl px-6 py-4 shadow-2xl"
            style={{ background: '#171d1c', color: '#fff' }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'var(--capri-whatsapp)' }}
            >
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
    <div
      className="mb-6 flex flex-wrap gap-1 border-b pb-0"
      style={{ borderColor: 'var(--capri-outline-variant)' }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className="relative px-4 py-2.5 text-sm font-semibold transition-colors"
          style={{
            color: active === tab.key ? 'var(--capri-primary)' : 'var(--capri-on-surface-variant)',
            borderBottom: active === tab.key ? '2px solid var(--capri-primary)' : '2px solid transparent',
            marginBottom: '-1px',
          }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
