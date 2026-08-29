import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CryptoFolio — Gestion de portefeuille crypto',
    template: '%s | CryptoFolio',
  },
  description:
    'Suivez votre portefeuille de cryptomonnaies en temps réel : transactions, valorisation live, PnL et graphiques de performance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="flex min-h-screen flex-col bg-base-950 font-sans text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
