'use client'

import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LogOut, Cloud } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()

  const provider = (session as { provider?: string })?.provider
  const storageLabel = provider === 'google'
    ? 'Google Drive'
    : provider === 'microsoft-entra-id'
    ? 'Microsoft OneDrive'
    : 'Armazenamento local'

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-label-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
        Configurações
      </h1>

      {/* Perfil */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-label-secondary)] uppercase tracking-wider mb-4">
          Conta
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <Avatar src={session?.user?.image} name={session?.user?.name} size="lg" />
          <div>
            <p className="font-semibold text-[var(--color-label-primary)]">{session?.user?.name ?? 'Usuário'}</p>
            <p className="text-sm text-[var(--color-label-secondary)]">{session?.user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-label-secondary)] mb-4">
          <Cloud size={16} aria-hidden="true" />
          Notas salvas em: <span className="font-medium text-[var(--color-label-primary)]">{storageLabel}</span>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="gap-2"
        >
          <LogOut size={14} aria-hidden="true" />
          Sair da conta
        </Button>
      </Card>

      {/* Acessibilidade */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-label-secondary)] uppercase tracking-wider mb-3">
          Acessibilidade
        </h2>
        <p className="text-sm text-[var(--color-label-secondary)]">
          Este aplicativo é compatível com <strong>WCAG 2.2 nível AA</strong>.
          Navegação completa por teclado, suporte a leitores de tela e modo escuro automático.
        </p>
      </Card>

      {/* Sobre */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-label-secondary)] uppercase tracking-wider mb-3">
          Sobre
        </h2>
        <p className="text-sm text-[var(--color-label-secondary)]">
          <strong>Notas Workflow</strong> v1.0 — Organize ideias em raias com busca semântica via IA.
        </p>
      </Card>
    </div>
  )
}
