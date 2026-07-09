import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'ContextQR — Smart Stadium Assistant | FIFA World Cup 2026',
  description:
    'Adaptive QR-powered stadium assistant. Context-aware help for gate entry, seating, and medical assistance — built for FIFA World Cup 2026 Smart Stadiums.',
  keywords: ['stadium', 'QR code', 'accessibility', 'FIFA', 'World Cup', 'smart stadium'],
  authors: [{ name: 'ContextQR Team' }],
  openGraph: {
    title: 'ContextQR — Smart Stadium Assistant',
    description: 'One QR code. Infinite context. Built for the stadium of the future.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-hc="false" data-fontsize="normal">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
