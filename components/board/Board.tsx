'use client'

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
            <table className="w-full border-collapse" aria-label="Tabela de folhas">
              <thead>
                <tr>
                  {DEFAULT_LANES.map(lane => (
                    <th key={lane.id} className="text-left pb-3 pr-4 last:pr-0" style={{ width: '25%' }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: lane.color }} aria-hidden="true" />
                        <span className="font-semibold text-sm text-[var(--color-label-primary)]">{lane.name}</span>
                        <span className="text-xs text-[var(--color-label-tertiary)] bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded-full">
                          {filteredNotes.filter(n => n.laneId === lane.id).length}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  {DEFAULT_LANES.map(lane => {
                    const laneNotes = filteredNotes.filter(n => n.laneId === lane.id)
                    return (
                      <td key={lane.id} className="pr-4 last:pr-0 pb-2">
                        <div className="flex flex-col gap-2">
                          {laneNotes.map(note => (
                            <NoteCard key={note.id} note={note} />
                          ))}
                          {laneNotes.length === 0 && (
                            <p className="text-xs text-[var(--color-label-quaternary)] py-4 text-center border-2 border-dashed border-[var(--color-separator)] rounded-[var(--radius-md)]">
                              Sem folhas
                            </p>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <DragOverlay>
          {activeNote && <NoteCard note={activeNote} dragHandle={false} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
