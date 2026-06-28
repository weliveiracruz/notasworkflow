'use client'

import { Editor } from '@tiptap/react'
import { cn } from '@/lib/utils'
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Heading2, Heading3, Quote, Minus, Undo, Redo,
} from 'lucide-react'

interface ToolbarProps {
  editor: Editor | null
}

interface ToolbarItem {
  label: string
  icon: React.ElementType
  action: () => void
  isActive?: boolean
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null

  const groups: ToolbarItem[][] = [
    [
      { label: 'Negrito', icon: Bold, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
      { label: 'Itálico', icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
      { label: 'Tachado', icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike') },
      { label: 'Código inline', icon: Code, action: () => editor.chain().focus().toggleCode().run(), isActive: editor.isActive('code') },
    ],
    [
      { label: 'Título 2', icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }) },
      { label: 'Título 3', icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive('heading', { level: 3 }) },
    ],
    [
      { label: 'Lista com marcadores', icon: List, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
      { label: 'Lista numerada', icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
      { label: 'Citação', icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote') },
      { label: 'Divisor', icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run() },
    ],
    [
      { label: 'Desfazer', icon: Undo, action: () => editor.chain().focus().undo().run() },
      { label: 'Refazer', icon: Redo, action: () => editor.chain().focus().redo().run() },
    ],
  ]

  return (
    <div
      role="toolbar"
      aria-label="Formatação de texto"
      className="flex flex-wrap gap-1 p-2 border-b border-[var(--color-separator)] bg-[var(--color-bg-secondary)]"
    >
      {groups.map((group, gi) => (
        <div key={gi} className="flex gap-0.5" role="group">
          {group.map(({ label, icon: Icon, action, isActive }) => (
            <button
              key={label}
              onClick={action}
              aria-label={label}
              aria-pressed={isActive}
              title={label}
              type="button"
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors',
                'hover:bg-[var(--color-bg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]',
                'text-[var(--color-label-secondary)]',
                isActive && 'bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue)]/90',
              )}
            >
              <Icon size={15} aria-hidden="true" />
            </button>
          ))}
          {gi < groups.length - 1 && (
            <div className="w-px bg-[var(--color-separator)] mx-1" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
