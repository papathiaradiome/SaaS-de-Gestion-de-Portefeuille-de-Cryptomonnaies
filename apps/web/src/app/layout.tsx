import type { Metadata } from 'next';
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
    <html lang="fr">
      <body className="min-h-screen bg-base-950 font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
