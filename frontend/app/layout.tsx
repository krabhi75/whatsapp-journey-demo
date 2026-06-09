import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Journey Demo',
  description: '5-question WhatsApp qualification flow demonstration',
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
