import type { Metadata } from 'next';
import { AuthCard, AuthLink } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = { title: 'Créer un compte' };

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <AuthCard
        title="Créer un compte"
        subtitle="Commencez à suivre votre portefeuille en quelques secondes."
        footer={
          <>
            Déjà inscrit ? <AuthLink href="/login">Se connecter</AuthLink>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
