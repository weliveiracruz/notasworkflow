'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Toolbar } from './Toolbar'
import { useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { localStore } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface EditorProps {
  noteId: string
  initialContent: string
  className?: string
}

export function NoteEditor({ noteId, initialContent, className }: EditorProps) {
  const updateNote = useAppStore(s => s.updateNote)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const save = useCallback((html: string) => {
    const note = { ...localStore.getNotes().find(n => n.id === noteId)!, content: html }
    if (note.id) {
      updateNote(noteId, { content: html })
      localStore.saveNote(note)
      if (statusRef.current) statusRef.current.textContent = 'Nota salva'
      setTimeout(() => { if (statusRef.current) statusRef.current.textContent = '' }, 2000)
    }
  }, [noteId, updateNote])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Comece a escrever sua nota…' }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[60vh] p-6',
        'aria-label': 'Área de edição da nota',
        'aria-multiline': 'true',
        role: 'textbox',
      },
    },
    onUpdate({ editor }) {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (statusRef.current) statusRef.current.textContent = 'Salvando…'
      saveTimer.current = setTimeout(() => save(editor.getHTML()), 2000)
    },
  })

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current) }, [])

  return (
    <div className={cn('flex flex-col border border-[var(--color-separator)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-bg-primary)]', className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1" />

      {/* Live region auto-save WCAG 4.1.3 */}
      <div
        ref={statusRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  )
}
