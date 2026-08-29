'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Error boundary global : évite l'écran blanc en cas d'erreur de rendu. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center">
          <p className="text-lg font-semibold text-red-300">Une erreur est survenue</p>
          <p className="mt-2 text-sm text-slate-400">
            Réessayez en rechargeant la page. Si le problème persiste, vérifiez que l&apos;API
            est bien démarrée.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-lg border border-base-700 px-4 py-2 text-sm transition hover:border-accent-500"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
