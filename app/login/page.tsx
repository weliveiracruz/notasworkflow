'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false)

  async function handleGoogle() {
    setLoadingGoogle(true)
    await signIn('google', { callbackUrl: '/app' })
  }

  async function handleMicrosoft() {
    setLoadingMicrosoft(true)
    await signIn('microsoft-entra-id', { callbackUrl: '/app' })
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] px-4"
      aria-label="Tela de login"
    >
      <div className="w-full max-w-sm">
        {/* Card central */}
        <div className="bg-[var(--color-bg-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-8 flex flex-col items-center gap-6">
          <Logo size="lg" />

          <p className="text-center text-[var(--color-label-secondary)] text-sm leading-relaxed">
            Organize suas ideias em raias.<br />Busca inteligente com IA.
          </p>

          <div className="w-full flex flex-col gap-3" role="group" aria-label="Opções de login">
            {/* Google */}
            <Button
              onClick={handleGoogle}
              loading={loadingGoogle}
              disabled={loadingMicrosoft}
              variant="secondary"
              size="lg"
              className="w-full"
              aria-label="Entrar com Google e armazenar notas no Google Drive"
            >
              {!loadingGoogle && (
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              Entrar com Google
            </Button>

            {/* Microsoft */}
            <Button
              onClick={handleMicrosoft}
              loading={loadingMicrosoft}
              disabled={loadingGoogle}
              variant="secondary"
              size="lg"
              className="w-full"
              aria-label="Entrar com Microsoft e armazenar notas no OneDrive"
            >
              {!loadingMicrosoft && (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
              )}
              Entrar com Microsoft
            </Button>
          </div>

          <p className="text-xs text-center text-[var(--color-label-tertiary)] leading-relaxed">
            Ao entrar, você concorda com os{' '}
            <a href="#" className="text-[var(--color-blue)] underline-offset-2 hover:underline focus-visible:underline">
              Termos de Uso
            </a>{' '}
            e a{' '}
            <a href="#" className="text-[var(--color-blue)] underline-offset-2 hover:underline focus-visible:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>

        {/* Tagline abaixo do card */}
        <p className="mt-6 text-center text-xs text-[var(--color-label-quaternary)]">
          Suas notas ficam salvas no seu próprio Drive ou OneDrive.
        </p>
      </div>
    </main>
  )
}
