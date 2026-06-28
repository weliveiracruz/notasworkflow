'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = `modal-${title.replace(/\s+/g, '-').toLowerCase()}`

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) {
      el.showModal()
    } else {
      el.close()
    }
  }, [open])

  useEffect(() => {
    const el = dialogRef.current
    const onCancel = (e: Event) => { e.preventDefault(); onClose() }
    el?.addEventListener('cancel', onCancel)
    return () => el?.removeEventListener('cancel', onCancel)
  }, [onClose])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-modal="true"
      className={cn(
        'fixed inset-0 m-auto w-full max-w-lg p-0 rounded-[var(--radius-xl)]',
        'bg-[var(--color-bg-primary)] shadow-[var(--shadow-lg)]',
        'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
        'open:flex open:flex-col',
        className,
      )}
      onClick={(e) => { if (e.target === dialogRef.current) onClose() }}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--color-separator)]">
        <h2 id={titleId} className="text-lg font-semibold text-[var(--color-label-primary)]">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Fechar modal"
          className="w-8 h-8 p-0 rounded-full"
        >
          <X size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  )
}
