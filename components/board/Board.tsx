'use client'

import Link from 'next/link'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import { Lane } from './Lane'
import { NoteCard } from './NoteCard'
import { useAppStore, ActiveFilter } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Plus, LayoutGrid, Table2 } from 'lucide-react'
import { Note, DEFAULT_LANES } from '@/types'

type Layout = 'kanban' | 'table'

interface BoardProps {
  activeFilter: ActiveFilter
  filteredNotes: Note[]
}

export function Board({ activeFilter, filteredNotes }: BoardProps) {
  const { notes, moveNote, notebooks, openNewSheet } = useAppStore()
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [layout, setLayout] = useState<Layout>('kanban')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveNote(null)
    if (!over || active.id === over.id) return

    const noteId = active.id as string
    const target = over.id as string

    const toLaneId = DEFAULT_LANES.find(l => l.id === target)?.id
      ?? (notes[target] ? notes[target].laneId : null)

    if (toLaneId) moveNote(noteId, toLaneId)
  }

  function filterLabel() {
    if (activeFilter === 'all') return 'Todas as folhas'
    if (activeFilter === 'loose') return 'Folhas soltas'
    return notebooks.find(nb => nb.id === activeFilter)?.name ?? 'Folhas'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => openNewSheet()} aria-label="Nova folha">
            <Plus size={14} aria-hidden="true" />
            Nova folha
          </Button>
          <span className="text-sm text-[var(--color-label-secondary)]">{filterLabel()}</span>
        </div>
        <div
          className="flex items-center gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]"
          role="group"
          aria-label="Alternar layout"
        >
          <button
            onClick={() => setLayout('kanban')}
            className={`p-1.5 rounded-[var(--radius-sm)] transition-colors ${layout === 'kanban' ? 'bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)] text-[var(--color-label-primary)]' : 'text-[var(--color-label-tertiary)] hover:text-[var(--color-label-secondary)]'}`}
            aria-label="Layout kanban"
            aria-pressed={layout === 'kanban'}
          >
            <LayoutGrid size={15} aria-hidden="true" />
          </button>
          <button
            onClick={() => setLayout('table')}
            className={`p-1.5 rounded-[var(--radius-sm)] transition-colors ${layout === 'table' ? 'bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)] text-[var(--color-label-primary)]' : 'text-[var(--color-label-tertiary)] hover:text-[var(--color-label-secondary)]'}`}
            aria-label="Layout tabela"
            aria-pressed={layout === 'table'}
          >
            <Table2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={e => setActiveNote(notes[e.active.id as string] ?? null)}
        onDragEnd={handleDragEnd}
      >
        {layout === 'kanban' ? (
          <div
            className="flex gap-4 px-6 pb-6 overflow-x-auto flex-1"
            role="region"
            aria-label="Board de folhas"
          >
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {activeNote ? `Movendo folha: ${activeNote.title}` : ''}
            </div>
            {DEFAULT_LANES.map(lane => (
              <Lane
                key={lane.id}
                lane={lane}
                notes={filteredNotes.filter(n => n.laneId === lane.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-auto px-6 pb-6">
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {activeNote ? `Movendo folha: ${activeNote.title}` : ''}
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse"
                style={{ minWidth: `${DEFAULT_LANES.length * 220}px` }}
              >
                <caption className="sr-only">
                  Folhas organizadas por status. {filteredNotes.length} folha{filteredNotes.length !== 1 ? 's' : ''} no total.
                </caption>
                <thead>
                  <tr>
                    {DEFAULT_LANES.map(lane => {
                      const count = filteredNotes.filter(n => n.laneId === lane.id).length
                      return (
                        <th
                          key={lane.id}
                          scope="col"
                          className="text-left pb-3 pr-4 last:pr-0 border-b border-[var(--color-separator)]"
                          style={{ width: `${100 / DEFAULT_LANES.length}%` }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: lane.color }} aria-hidden="true" />
                            <span className="font-semibold text-sm text-[var(--color-label-primary)]">{lane.name}</span>
                            <span
                              className="text-xs text-[var(--color-label-tertiary)] bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded-full"
                              aria-label={`${count} folha${count !== 1 ? 's' : ''}`}
                            >
                              {count}
                            </span>
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const laneNoteMap = Object.fromEntries(
                      DEFAULT_LANES.map(lane => [lane.id, filteredNotes.filter(n => n.laneId === lane.id)])
                    )
                    const rowCount = Math.max(...DEFAULT_LANES.map(l => laneNoteMap[l.id].length), 1)

                    return Array.from({ length: rowCount }, (_, rowIdx) => (
                      <tr key={rowIdx} className="align-top group">
                        {DEFAULT_LANES.map(lane => {
                          const note = laneNoteMap[lane.id][rowIdx]
                          return (
                            <td
                              key={lane.id}
                              className="pr-4 last:pr-0 pt-2 pb-1 border-b border-[var(--color-separator)]/50 align-top"
                            >
                              {note ? (
                                <Link
                                  href={`/app/note/${note.id}?from=/app`}
                                  className={[
                                    'flex flex-col gap-1 px-3 py-2.5 rounded-[var(--radius-md)]',
                                    'border border-transparent transition-colors',
                                    'hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-separator)]',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]',
                                  ].join(' ')}
                                  aria-label={`Abrir folha: ${note.title || 'Sem título'}, status ${DEFAULT_LANES.find(l => l.id === note.laneId)?.name ?? ''}`}
                                >
                                  <span className="text-sm font-medium text-[var(--color-label-primary)] line-clamp-1">
                                    {note.title || 'Sem título'}
                                  </span>
                                  {note.tags.length > 0 && (
                                    <span className="flex gap-1 flex-wrap" aria-label="Tags">
                                      {note.tags.slice(0, 2).map(tag => (
                                        <span
                                          key={tag}
                                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-[var(--color-label-tertiary)]">
                                    <span className="sr-only">Atualizado em </span>
                                    {new Date(note.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                  </span>
                                </Link>
                              ) : (
                                <span className="block h-[58px]" aria-hidden="true" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DragOverlay>
          {activeNote && <NoteCard note={activeNote} dragHandle={false} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
