import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] ** 2
    magB += b[i] ** 2
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1)
}

export function textSearch(query: string, notes: Array<{ title: string; content: string; id: string }>) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  return notes
    .map(note => {
      const haystack = `${note.title} ${note.content}`.toLowerCase()
      const hits = terms.filter(t => haystack.includes(t)).length
      return { id: note.id, score: hits / terms.length }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function extractExcerpt(content: string, query: string, maxLen = 120): string {
  const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const term = query.split(/\s+/)[0].toLowerCase()
  const idx = plain.toLowerCase().indexOf(term)
  if (idx === -1) return plain.slice(0, maxLen) + (plain.length > maxLen ? '…' : '')
  const start = Math.max(0, idx - 40)
  const end = Math.min(plain.length, idx + maxLen - 40)
  return (start > 0 ? '…' : '') + plain.slice(start, end) + (end < plain.length ? '…' : '')
}
