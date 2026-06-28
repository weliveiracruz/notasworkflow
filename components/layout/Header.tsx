'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Logo } from './Logo'
import { Avatar } from '@/components/ui/Avatar'
import { SearchBar } from '@/components/search/SearchBar'
import { NewSheetModal } from './NewSheetModal'
import { useAppStore } from '@/lib/store'
import {
  Plus,
  BookOpen,
  FileText,
  ChevronDown,
  Layers,
  Settings,
  LogOut,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type OpenMenu = 'novo' | 'cadernos' | 'folhas' | 'perfil' | null

export function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  const { notebooks, addNotebook, setActiveFilter, openNewSheet } = useAppStore()

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const navRef = useRef<HTMLElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(m => m === 'perfil' ? m : null)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setOpenMenu(m => m === 'perfil' ? null : m)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function toggle(menu: OpenMenu) {
    setOpenMenu(o => o === menu ? null : menu)
  }

  function handleNewNotebook() {
    setOpenMenu(null)
    const name = prompt('Nome do caderno:')
    if (name?.trim()) addNotebook(name.trim())
  }

  function handleNewFolha() {
    setOpenMenu(null)
    openNewSheet()
  }

  function navigate(filter: string) {
    setOpenMenu(null)
    setActiveFilter(filter)
    router.push('/app')
  }

  const userName = session?.user?.name ?? 'Usuário'
  const userImage = session?.user?.image ?? null

  // Estilo base compartilhado pelos três botões de menu
  const menuBtnClass = (menu: OpenMenu) => cn(
    'flex items-center gap-1.5 px-3 h-8 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
    openMenu === menu
      ? 'bg-[var(--color-bg-tertiary,var(--color-bg-secondary))] text-[var(--color-label-primary)]'
      : 'text-[var(--color-label-secondary)] hover:text-[var(--color-label-primary)] hover:bg-[var(--color-bg-secondary)]',
  )

  const dropdownClass = 'absolute left-0 top-full mt-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-separator)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1 z-50'

  return (
    <>
      <header
        className="h-14 px-4 flex items-center gap-2 justify-between bg-[var(--color-bg-primary)]/95 backdrop-blur-md border-b border-[var(--color-separator)] sticky top-0 z-30"
        role="banner"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--color-blue)] focus:text-white focus:px-3 focus:py-1 focus:rounded focus:text-sm"
        >
          Pular para o conteúdo
        </a>

        {/* Logo */}
        <Link href="/app" onClick={() => setActiveFilter('all')} aria-label="Notas Workflow — ir para a home">
          <Logo size="sm" />
        </Link>

        {/* Navegação principal */}
        <nav ref={navRef} className="flex items-center gap-1" aria-label="Menu principal">

          {/* Novo */}
          <div className="relative">
            <button
              onClick={() => toggle('novo')}
              aria-expanded={openMenu === 'novo'}
              aria-haspopup="menu"
              className={menuBtnClass('novo')}
            >
              <Plus size={14} aria-hidden="true" />
              <span>Novo</span>
              <ChevronDown size={12} aria-hidden="true" className={cn('transition-transform', openMenu === 'novo' && 'rotate-180')} />
            </button>

            {openMenu === 'novo' && (
              <div role="menu" aria-label="Criar novo" className={cn(dropdownClass, 'w-48')}>
                <button
                  role="menuitem"
                  onClick={handleNewNotebook}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-blue)]/10 text-[var(--color-blue)] shrink-0">
                    <BookOpen size={14} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-[var(--color-label-primary)]">Novo caderno</p>
                    <p className="text-[10px] text-[var(--color-label-tertiary)]">Organizar folhas</p>
                  </div>
                </button>

                <button
                  role="menuitem"
                  onClick={handleNewFolha}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] bg-[#34C759]/10 text-[#34C759] shrink-0">
                    <FileText size={14} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-[var(--color-label-primary)]">Nova folha</p>
                    <p className="text-[10px] text-[var(--color-label-tertiary)]">Anotação livre</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Cadernos */}
          <div className="relative">
            <button
              onClick={() => toggle('cadernos')}
              aria-expanded={openMenu === 'cadernos'}
              aria-haspopup="menu"
              className={menuBtnClass('cadernos')}
            >
              <BookOpen size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Cadernos</span>
              <ChevronDown size={12} aria-hidden="true" className={cn('transition-transform', openMenu === 'cadernos' && 'rotate-180')} />
            </button>

            {openMenu === 'cadernos' && (
              <div role="menu" aria-label="Cadernos" className={cn(dropdownClass, 'w-52')}>
                <button
                  role="menuitem"
                  onClick={() => navigate('all')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <Layers size={14} className="text-[var(--color-label-tertiary)] shrink-0" aria-hidden="true" />
                  <span className="text-[var(--color-label-primary)]">Todos os cadernos</span>
                </button>

                {notebooks.length > 0 && (
                  <div className="mx-3 my-1 border-t border-[var(--color-separator)]" role="separator" />
                )}

                {notebooks.map(nb => (
                  <button
                    key={nb.id}
                    role="menuitem"
                    onClick={() => navigate(nb.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: nb.color }} aria-hidden="true" />
                    <span className="flex-1 truncate text-[var(--color-label-primary)]">{nb.name}</span>
                  </button>
                ))}

                {notebooks.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[var(--color-label-tertiary)]">Nenhum caderno ainda.</p>
                )}
              </div>
            )}
          </div>

          {/* Folhas */}
          <div className="relative">
            <button
              onClick={() => toggle('folhas')}
              aria-expanded={openMenu === 'folhas'}
              aria-haspopup="menu"
              className={menuBtnClass('folhas')}
            >
              <FileText size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Folhas</span>
              <ChevronDown size={12} aria-hidden="true" className={cn('transition-transform', openMenu === 'folhas' && 'rotate-180')} />
            </button>

            {openMenu === 'folhas' && (
              <div role="menu" aria-label="Folhas" className={cn(dropdownClass, 'w-48')}>
                <button
                  role="menuitem"
                  onClick={() => navigate('all')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <Layers size={14} className="text-[var(--color-label-tertiary)] shrink-0" aria-hidden="true" />
                  <span className="text-[var(--color-label-primary)]">Todas as folhas</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => navigate('loose')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <FileText size={14} className="text-[var(--color-label-tertiary)] shrink-0" aria-hidden="true" />
                  <span className="text-[var(--color-label-primary)]">Folhas soltas</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Busca + Perfil */}
        <div className="flex items-center gap-2">
          <SearchBar className="w-52 hidden md:block" />

          <div ref={profileRef} className="relative">
            <button
              onClick={() => toggle('perfil')}
              aria-expanded={openMenu === 'perfil'}
              aria-haspopup="menu"
              aria-label="Menu do perfil"
              className="flex items-center gap-2 px-2 h-8 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <Avatar src={userImage} name={userName} size="sm" />
              <span className="text-sm font-medium text-[var(--color-label-primary)] hidden md:inline max-w-[100px] truncate">
                {userName.split(' ')[0]}
              </span>
              <ChevronDown
                size={12}
                aria-hidden="true"
                className={cn('text-[var(--color-label-tertiary)] transition-transform hidden md:block', openMenu === 'perfil' && 'rotate-180')}
              />
            </button>

            {openMenu === 'perfil' && (
              <div
                role="menu"
                aria-label="Menu do perfil"
                className="absolute right-0 top-full mt-1.5 w-52 bg-[var(--color-bg-primary)] border border-[var(--color-separator)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1 z-50"
              >
                <div className="px-3 py-2.5 border-b border-[var(--color-separator)]">
                  <p className="text-sm font-semibold text-[var(--color-label-primary)] truncate">{userName}</p>
                  <p className="text-xs text-[var(--color-label-tertiary)] truncate">{session?.user?.email ?? ''}</p>
                </div>

                <Link
                  href="/app/settings"
                  onClick={() => setOpenMenu(null)}
                  role="menuitem"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-label-primary)]"
                >
                  <Settings size={14} aria-hidden="true" />
                  Configurações
                </Link>

                <Link
                  href="/app/settings"
                  onClick={() => setOpenMenu(null)}
                  role="menuitem"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-label-primary)]"
                >
                  <User size={14} aria-hidden="true" />
                  Meu perfil
                </Link>

                <div className="mx-3 my-1 border-t border-[var(--color-separator)]" role="separator" />

                <button
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-red)]"
                >
                  <LogOut size={14} aria-hidden="true" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NewSheetModal />
    </>
  )
}
