'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ChevronRight, Clock, FileText } from 'lucide-react'

export function Sidebar() {
  const router = useRouter()
  const { notes } = useAppStore()
  const [expanded, setExpanded] = useState(true)

  const recentNotes = Object.values(notes)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10)

  return (
    <aside
      className="w-56 shrink-0 bg-[var(--color-bg-primary)] border-r border-[var(--color-separator)] flex flex-col h-full overflow-y-auto"
      aria-label="Menu lateral"
    >
      <button
        className="flex items-center gap-2 px-3 py-3 w-full text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls="recent-notes-list"
        aria-label={expanded ? 'Recolher notas recentes' : 'Expandir notas recentes'}
      >
        <ChevronRight
          size={13}
          aria-hidden="true"
          className={cn('text-[var(--color-label-tertiary)] transition-transform shrink-0', expanded && 'rotate-90')}
        />
        <Clock size={13} className="text-[var(--color-label-secondary)] shrink-0" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-label-secondary)]">
          Notas recentes
        </span>
      </button>

      {expanded && (
        <nav id="recent-notes-list" aria-label="Notas recentes">
          {recentNotes.length === 0 ? (
            <p className="px-4 py-3 text-xs text-[var(--color-label-tertiary)]">
              Nenhuma nota ainda.
            </p>
          ) : (
            <ul role="list">
              {recentNotes.map(note => (
                <li key={note.id}>
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
                    onClick={() => router.push(`/app/note/${note.id}?from=/app`)}
                    aria-label={`Abrir ${note.title || 'Sem título'}`}
                  >
                    <FileText size={13} className="shrink-0 text-[var(--color-label-tertiary)]" aria-hidden="true" />
                    <span className="flex-1 truncate text-[var(--color-label-primary)]">
                      {note.title || 'Sem título'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}
    </aside>
  )
}
