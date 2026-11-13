import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import 'src/styles/index.css';

// Dycom brand type (Brand Guidelines 2026): Fjalla One for H1/H2, Geist for everything else.
const fjalla = localFont({ src: '../assets/fonts/FjallaOne.woff2', weight: '400', variable: '--font-fjalla', display: 'swap' });
const geist = localFont({ src: '../assets/fonts/Geist.woff2', weight: '100 900', variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_URL || 'http://localhost:3000'),
  // No default title: pages take theirs from the route's Title field (getPageMetadata), and the
  // 404 renders its Title field as <title> (not-found.tsx cannot use generateMetadata).
};

export const viewport: Viewport = { themeColor: '#041054' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fjalla.variable} ${geist.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
