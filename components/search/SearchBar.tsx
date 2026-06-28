'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { Search, FileText, BookOpen, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { textSearch, extractExcerpt } from '@/lib/utils'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  excerpt: string
  notebookName: string | null
}

export function SearchBar({ className }: { className?: string }) {
  const { notes, notebooks } = useAppStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const runSearch = useCallback(
    (q: string) => {
      if (!q.trim()) { setResults([]); setOpen(false); return }

      const noteList = Object.values(notes).map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
      }))

      const hits = textSearch(q, noteList).slice(0, 8)
      setResults(
        hits.map(({ id }) => {
          const note = notes[id]
          const nb = note.notebookId ? notebooks.find(nb => nb.id === note.notebookId) : null
          return {
            id,
            title: note.title || 'Sem título',
            excerpt: extractExcerpt(note.content, q),
            notebookName: nb?.name ?? null,
          }
        }),
      )
      setOpen(true)
    },
    [notes, notebooks],
  )

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => runSearch(val), 200)
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setOpen(false)
    inputRef.current?.focus()
  }

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mensagem anunciada ao leitor de telas após debounce da busca
  const announcement = !query.trim()
    ? ''
    : results.length === 0
      ? `Nenhum resultado encontrado para ${query}`
      : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''} para ${query}`

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Região de anúncio para leitores de tela */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Input */}
      <div className="relative flex items-center">
        <Search
          size={15}
          className="absolute left-3 text-[var(--color-label-secondary)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Buscar em todas as folhas…"
          onChange={handleChange}
          onFocus={() => query && results.length > 0 && setOpen(true)}
          onKeyDown={e => e.key === 'Escape' && setOpen(false)}
          aria-label="Buscar folhas"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          className={cn(
            'h-9 w-full rounded-[var(--radius-full)] pl-9 pr-8 text-sm',
            'bg-[var(--color-bg-secondary)] border border-[var(--color-separator-opaque)]',
            'text-[var(--color-label-primary)] placeholder:text-[var(--color-label-tertiary)]',
            'focus:outline-none focus:border-[var(--color-blue)] focus:ring-2 focus:ring-[var(--color-blue)]/20',
            'transition-all [&::-webkit-search-cancel-button]:hidden',
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 text-[var(--color-label-tertiary)] hover:text-[var(--color-label-secondary)] transition-colors"
            aria-label="Limpar busca"
          >
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {open && (
        <div
          className={cn(
            'absolute top-full mt-2 left-0 right-0 z-50',
            'bg-[var(--color-bg-primary)] border border-[var(--color-separator)]',
            'rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]',
            'max-h-[420px] overflow-y-auto',
          )}
          role="listbox"
          aria-label="Resultados da busca"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[var(--color-label-tertiary)]">
              Nenhuma folha encontrada para <strong className="text-[var(--color-label-secondary)]">"{query}"</strong>
            </div>
          ) : (
            <>
              <div className="px-3 py-2 border-b border-[var(--color-separator)]">
                <span className="text-xs text-[var(--color-label-tertiary)]">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"
                </span>
              </div>
              <ul>
                {results.map(result => (
                  <li key={result.id} role="option" aria-selected="false">
                    <Link
                      href={`/app/note/${result.id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-start gap-3 px-3 py-3 transition-colors',
                        'hover:bg-[var(--color-bg-secondary)]',
                        'focus:outline-none focus:bg-[var(--color-bg-secondary)]',
                        'border-b border-[var(--color-separator)] last:border-0',
                      )}
                    >
                      <FileText
                        size={14}
                        className="shrink-0 mt-0.5 text-[var(--color-label-tertiary)]"
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-label-primary)] truncate">
                          {result.title}
                        </p>
                        {result.excerpt && (
                          <p className="text-xs text-[var(--color-label-secondary)] line-clamp-2 mt-0.5 leading-relaxed">
                            {result.excerpt}
                          </p>
                        )}
                        {result.notebookName && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <BookOpen size={10} className="text-[var(--color-label-quaternary)]" aria-hidden="true" />
                            <span className="text-[10px] text-[var(--color-label-tertiary)]">
                              {result.notebookName}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
