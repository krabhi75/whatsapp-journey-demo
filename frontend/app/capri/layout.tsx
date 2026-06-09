import type { Metadata } from 'next';
import { CapriDemoProvider } from '@/components/capri/capri-demo-context';

export const metadata: Metadata = {
  title: 'Capri Global — WhatsApp AI Demo',
  description: 'Capri Global NBFC WhatsApp qualification, callback capture, and lead management',
};

export default function CapriLayout({ children }: { children: React.ReactNode }) {
  return <CapriDemoProvider>{children}</CapriDemoProvider>;
}
