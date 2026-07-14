import { Sora, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const sora = Sora({ 
  subsets: ['latin'], 
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "ContextQR | Smart Stadium Assistant",
  description: "Dynamic, context-aware safety and accessibility for stadiums.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
