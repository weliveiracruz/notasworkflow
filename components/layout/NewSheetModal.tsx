'use client'

import { useState, useEffect, useRef } from 'react'
import { X, BookOpen, FileText } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { DEFAULT_LANES } from '@/types'

export function NewSheetModal() {
  const router = useRouter()
  const { notebooks, addNote, newSheetOpen, newSheetLaneId, closeNewSheet } = useAppStore()
  const [title, setTitle] = useState('')
  const [notebookId, setNotebookId] = useState('')
  const [laneId, setLaneId] = useState('todo')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (newSheetOpen) {
      setTitle('')
      setNotebookId('')
      setLaneId(newSheetLaneId)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [newSheetOpen, newSheetLaneId])

  function handleCreate() {
    if (!title.trim()) return
    const id = generateId()
    addNote({
      id,
      title: title.trim(),
      content: '',
      tags: [],
      laneId,
      notebookId: notebookId || null,
      folderId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    closeNewSheet()
    router.push(`/app/note/${id}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') closeNewSheet()
  }

  if (!newSheetOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Nova folha"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeNewSheet} />

      <div className="relative w-full max-w-md mx-4 bg-[var(--color-bg-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] border border-[var(--color-separator)] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-blue)]/10 text-[var(--color-blue)]">
              <FileText size={14} />
            </span>
            <h2 className="text-sm font-semibold text-[var(--color-label-primary)]">Nova folha</h2>
          </div>
          <button
            onClick={closeNewSheet}
            className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--color-label-tertiary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-label-primary)] transition-colors"
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[var(--color-label-secondary)]">Título</label>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nome da folha…"
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-separator)] bg-[var(--color-bg-secondary)] text-[var(--color-label-primary)] placeholder:text-[var(--color-label-quaternary)] outline-none focus:border-[var(--color-blue)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[var(--color-label-secondary)] flex items-center gap-1.5">
            <BookOpen size={12} aria-hidden="true" />
            Caderno
          </label>
          <select
            value={notebookId}
            onChange={e => setNotebookId(e.target.value)}
            aria-label="Selecionar caderno"
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-separator)] bg-[var(--color-bg-secondary)] text-[var(--color-label-primary)] outline-none focus:border-[var(--color-blue)] transition-colors cursor-pointer"
          >
            <option value="">Folha solta (sem caderno)</option>
            {notebooks.map(nb => (
              <option key={nb.id} value={nb.id}>{nb.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[var(--color-label-secondary)]">Status</label>
          <select
            value={laneId}
            onChange={e => setLaneId(e.target.value)}
            aria-label="Selecionar status"
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-separator)] bg-[var(--color-bg-secondary)] text-[var(--color-label-primary)] outline-none focus:border-[var(--color-blue)] transition-colors cursor-pointer"
          >
            {DEFAULT_LANES.map(lane => (
              <option key={lane.id} value={lane.id}>{lane.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={closeNewSheet}
            className="px-3 py-1.5 text-sm rounded-[var(--radius-md)] text-[var(--color-label-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-4 py-1.5 text-sm rounded-[var(--radius-md)] bg-[var(--color-blue)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Criar folha
          </button>
        </div>
      </div>
    </div>
  )
}
