'use client'

import { useRef, useCallback } from 'react'
import { Note, DEFAULT_LANES } from '@/types'
import { formatDate, cn } from '@/lib/utils'
import { Tag, Clock } from 'lucide-react'
import Link from 'next/link'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppStore } from '@/lib/store'

interface NoteCardProps {
  note: Note
  dragHandle?: boolean
}

export function NoteCard({ note, dragHandle = true }: NoteCardProps) {
  const { moveNote } = useAppStore()
  const articleRef = useRef<HTMLElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const preview = note.content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (!e.shiftKey || !e.altKey) return

    const laneIndex = DEFAULT_LANES.findIndex(l => l.id === note.laneId)

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = DEFAULT_LANES[laneIndex + 1]
      if (next) moveNote(note.id, next.id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = DEFAULT_LANES[laneIndex - 1]
      if (prev) moveNote(note.id, prev.id)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const container = articleRef.current?.parentElement
      if (!container) return
      const cards = Array.from(container.querySelectorAll<HTMLElement>('article[tabindex="0"]'))
      const idx = cards.indexOf(articleRef.current!)
      const target = e.key === 'ArrowDown' ? cards[idx + 1] : cards[idx - 1]
      target?.focus()
    }
  }, [note.id, note.laneId, moveNote])

  return (
    <article
      ref={el => {
        setNodeRef(el)
        ;(articleRef as React.MutableRefObject<HTMLElement | null>).current = el
      }}
      style={style}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Folha: ${note.title || 'Sem título'}, raia ${DEFAULT_LANES.find(l => l.id === note.laneId)?.name ?? ''}`}
      aria-grabbed={isDragging}
      aria-keyshortcuts="Shift+Alt+ArrowLeft Shift+Alt+ArrowRight Shift+Alt+ArrowUp Shift+Alt+ArrowDown"
      className={cn(
        'bg-[var(--color-bg-primary)] rounded-[var(--radius-lg)] p-3',
        'border border-[var(--color-separator)] shadow-[var(--shadow-sm)]',
        'transition-shadow hover:shadow-[var(--shadow-md)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]',
        isDragging && 'opacity-50 shadow-[var(--shadow-lg)] rotate-1',
      )}
    >
      {/* Alça de drag */}
      {dragHandle && (
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-full mb-2 cursor-grab active:cursor-grabbing"
          aria-label="Arrastar nota. Teclado: Shift+Alt+Setas para mover entre raias ou navegar na lista."
          role="button"
          tabIndex={-1}
        >
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="w-1 h-1 rounded-full bg-[var(--color-label-quaternary)]" />
                <div className="w-1 h-1 rounded-full bg-[var(--color-label-quaternary)]" />
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/app/note/${note.id}?from=/app`}
        tabIndex={-1}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue)] rounded-[var(--radius-md)]"
      >
        <h3 className="font-semibold text-sm text-[var(--color-label-primary)] line-clamp-2 mb-1">
          {note.title || 'Sem título'}
        </h3>
        {preview && (
          <p className="text-xs text-[var(--color-label-secondary)] line-clamp-3 mb-2">
            {preview}
          </p>
        )}
      </Link>

      <footer className="flex items-center justify-between gap-2 mt-2">
        {note.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap" aria-label="Tags">
            {note.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
              >
                <Tag size={8} aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className="flex items-center gap-1 text-[10px] text-[var(--color-label-tertiary)] ml-auto whitespace-nowrap">
          <Clock size={10} aria-hidden="true" />
          {formatDate(note.updatedAt)}
        </span>
      </footer>
    </article>
  )
}
