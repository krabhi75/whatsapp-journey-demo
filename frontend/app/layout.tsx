import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Capri Global — WhatsApp AI Demo',
  description: 'Capri Global NBFC WhatsApp qualification, callback capture, and lead management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable} style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
