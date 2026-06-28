'use client'

import { use, useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { NoteEditor } from '@/components/editor/Editor'
import { Button } from '@/components/ui/Button'
import { Home, Tag, X, BookOpen, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { localStore } from '@/lib/storage'

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const backTo = searchParams.get('from') ?? '/app'

  const { notes, notebooks, updateNote, moveNoteToNotebook } = useAppStore()
  const note = notes[id]
  const [title, setTitle] = useState(note?.title ?? '')
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (!note && id) {
      const saved = localStore.getNotes().find(n => n.id === id)
      if (saved) useAppStore.getState().addNote(saved)
    }
  }, [note, id])

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[var(--color-label-secondary)]">Folha não encontrada.</p>
      </div>
    )
  }

  function handleTitleBlur() {
    if (title.trim() !== note.title) {
      updateNote(id, { title: title.trim() })
      localStore.saveNote({ ...note, title: title.trim() })
    }
  }

  function handleSaveAndClose() {
    if (title.trim() !== note.title) {
      updateNote(id, { title: title.trim() })
      localStore.saveNote({ ...note, title: title.trim() })
    }
    router.push(backTo)
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTags = [...note.tags, tagInput.trim()]
      updateNote(id, { tags: newTags })
      localStore.saveNote({ ...note, tags: newTags })
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    const newTags = note.tags.filter(t => t !== tag)
    updateNote(id, { tags: newTags })
    localStore.saveNote({ ...note, tags: newTags })
  }

  function handleMoveToNotebook(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    const notebookId = val === '' ? null : val
    moveNoteToNotebook(id, notebookId)
    localStore.saveNote({ ...note, notebookId })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Barra superior */}
      <div className="flex items-center justify-between -ml-2">
        <Link href={backTo}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Home size={14} aria-hidden="true" />
            Home
          </Button>
        </Link>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveAndClose}
          className="gap-1.5"
          aria-label="Salvar e fechar folha"
        >
          <Save size={14} aria-hidden="true" />
          Salvar e fechar
        </Button>
      </div>

      {/* Título */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        aria-label="Título da folha"
        placeholder="Sem título"
        className={[
          'w-full text-3xl font-bold bg-transparent border-none outline-none',
          'text-[var(--color-label-primary)] placeholder:text-[var(--color-label-quaternary)]',
          'focus-visible:ring-0',
        ].join(' ')}
        style={{ fontFamily: 'var(--font-display)' }}
      />

      {/* Caderno */}
      <div className="flex items-center gap-2">
        <BookOpen size={13} className="text-[var(--color-label-tertiary)]" aria-hidden="true" />
        <select
          value={note.notebookId ?? ''}
          onChange={handleMoveToNotebook}
          aria-label="Caderno desta folha"
          className="text-xs bg-transparent border border-[var(--color-separator)] rounded-[var(--radius-md)] px-2 py-1 text-[var(--color-label-secondary)] cursor-pointer"
        >
          <option value="">Sem caderno (folha solta)</option>
          {notebooks.map(nb => (
            <option key={nb.id} value={nb.id}>{nb.name}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Tags da folha">
        {note.tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]">
            <Tag size={10} aria-hidden="true" />
            {tag}
            <button
              onClick={() => removeTag(tag)}
              aria-label={`Remover tag ${tag}`}
              className="ml-0.5 hover:text-[var(--color-red)] transition-colors"
            >
              <X size={10} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="+ Tag (Enter)"
          aria-label="Adicionar tag (pressione Enter)"
          className="text-xs bg-transparent border-none outline-none text-[var(--color-label-secondary)] placeholder:text-[var(--color-label-quaternary)] w-28"
        />
      </div>

      {/* Editor */}
      <NoteEditor noteId={id} initialContent={note.content} />
    </div>
  )
}
