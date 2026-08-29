import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ErrorBoundary } from '@/components/error-boundary';
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
        <AuthProvider>
          <ErrorBoundary>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#e2e8f0',
                border: '1px solid #334155',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
