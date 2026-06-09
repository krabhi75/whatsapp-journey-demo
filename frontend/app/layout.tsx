import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NBFC WhatsApp Customer Service Demo',
  description: 'NBFC customer service WhatsApp journey — multi-phone office testing',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
