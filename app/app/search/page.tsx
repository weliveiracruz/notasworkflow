'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { localStore } from '@/lib/storage'
import { Note, SearchResult } from '@/types'
import { SearchBar } from '@/components/search/SearchBar'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Sparkles, AlignLeft } from 'lucide-react'

export default function SearchPage() {
  const searchQuery = useAppStore(s => s.searchQuery)
  const notes = useAppStore(s => s.notes)
  const [results, setResults] = useState<(SearchResult & { mode?: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'semantic' | 'text' | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)

    const noteList = Object.values(notes).map(n => ({
      ...n,
      embedding: localStore.getEmbedding(n.id) ?? undefined,
    }))

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, notes: noteList }),
      })
      const data = await res.json()
      setMode(data.mode)
      setResults(
        data.results.map((r: { id: string; score: number; excerpt: string }) => ({
          note: notes[r.id],
          score: r.score,
          excerpt: r.excerpt,
        })).filter((r: SearchResult) => r.note),
      )
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [notes])

  useEffect(() => { search(searchQuery) }, [searchQuery, search])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[var(--color-label-primary)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        Busca
      </h1>

      <SearchBar className="mb-6 w-full" />

      {/* Status de busca WCAG 4.1.3 */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? 'Buscando…' : results.length > 0 ? `${results.length} resultados encontrados` : searchQuery ? 'Nenhum resultado' : ''}
      </div>

      {mode && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-label-secondary)] mb-4">
          {mode === 'semantic' ? <Sparkles size={12} aria-hidden="true" /> : <AlignLeft size={12} aria-hidden="true" />}
          {mode === 'semantic' ? 'Busca semântica com IA' : 'Busca textual (IA indisponível)'}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] animate-pulse" aria-hidden="true" />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && searchQuery && (
        <p className="text-center text-[var(--color-label-secondary)] py-12">
          Nenhuma nota encontrada para "<strong>{searchQuery}</strong>".
        </p>
      )}

      {!loading && !searchQuery && (
        <p className="text-center text-[var(--color-label-tertiary)] py-12 text-sm">
          Digite algo para buscar nas suas notas.
        </p>
      )}

      <ul className="space-y-3" aria-label="Resultados da busca">
        {results.map(({ note, excerpt, score }) => (
          <li key={note.id}>
            <Link href={`/app/note/${note.id}`}>
              <Card className="hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-semibold text-sm text-[var(--color-label-primary)]">
                    {note.title || 'Sem título'}
                  </h2>
                  <span className="text-[10px] text-[var(--color-label-tertiary)] whitespace-nowrap">
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
                {excerpt && (
                  <p className="text-xs text-[var(--color-label-secondary)] line-clamp-3 leading-relaxed">
                    {excerpt}
                  </p>
                )}
                <div className="mt-2 text-[10px] text-[var(--color-label-tertiary)]">
                  Relevância: {Math.round(score * 100)}%
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
