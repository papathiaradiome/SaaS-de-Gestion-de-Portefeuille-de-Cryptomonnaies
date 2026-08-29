import type { Metadata } from 'next';
import { AuthCard, AuthLink } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Connexion' };

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <AuthCard
        title="Connexion"
        subtitle="Accédez à votre portefeuille CryptoFolio."
        footer={
          <>
            Pas encore de compte ? <AuthLink href="/register">Créer un compte</AuthLink>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
