'use client'

import { Lane as LaneType, Note } from '@/types'
import { NoteCard } from './NoteCard'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'

interface LaneProps {
  lane: LaneType
  notes: Note[]
}

export function Lane({ lane, notes }: LaneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: lane.id })

  return (
    <section
      aria-label={`Raia: ${lane.name}`}
      className="flex flex-col w-64 shrink-0 min-h-[calc(100vh-10rem)]"
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-3 h-3 rounded-full" style={{ background: lane.color }} aria-hidden="true" />
        <h2 className="font-semibold text-sm text-[var(--color-label-primary)]">{lane.name}</h2>
        <span
          className="text-xs text-[var(--color-label-secondary)] bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded-full"
          aria-label={`${notes.length} folhas`}
        >
          {notes.length}
        </span>
      </div>

      {/* Dropzone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 flex flex-col gap-2 rounded-[var(--radius-lg)] p-2 min-h-40 transition-colors',
          isOver
            ? 'bg-[var(--color-blue)]/8 border-2 border-dashed border-[var(--color-blue)]'
            : 'bg-[var(--color-bg-secondary)]/50 border-2 border-transparent',
        )}
      >
        <SortableContext items={notes.map(n => n.id)} strategy={verticalListSortingStrategy}>
          {notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </SortableContext>

        {notes.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-[var(--color-label-quaternary)] text-center">
              Arraste folhas<br />ou crie uma nova
            </p>
          </div>
        )}
      </div>

      {/* Botão nova folha */}
    </section>
  )
}
