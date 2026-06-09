import type { Metadata } from 'next';
import '@/styles/capri.css';
import { CapriDemoProvider } from '@/components/capri/capri-demo-context';

export const metadata: Metadata = {
  title: 'Capri WhatsApp Demo | FinReach AI',
  description: 'NBFC WhatsApp qualification, callback capture, and lead management demo',
};

export default function CapriLayout({ children }: { children: React.ReactNode }) {
  return <CapriDemoProvider>{children}</CapriDemoProvider>;
}
