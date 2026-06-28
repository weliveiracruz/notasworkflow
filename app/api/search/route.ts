import { NextRequest, NextResponse } from 'next/server'
import { cosineSimilarity, textSearch, extractExcerpt } from '@/lib/utils'

async function getGroqEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch('https://api.groq.com/openai/v1/embeddings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'nomic-embed-text-v1_5', input: text }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.data?.[0]?.embedding ?? null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const { query, notes } = await req.json()

  if (!query?.trim() || !Array.isArray(notes)) {
    return NextResponse.json({ results: [] })
  }

  const queryEmbedding = await getGroqEmbedding(query)

  if (queryEmbedding) {
    const results = notes
      .filter((n: { embedding?: number[] }) => Array.isArray(n.embedding))
      .map((n: { id: string; title: string; content: string; embedding: number[] }) => ({
        id: n.id,
        score: cosineSimilarity(queryEmbedding, n.embedding),
        excerpt: extractExcerpt(n.content, query),
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 10)

    return NextResponse.json({ results, mode: 'semantic' })
  }

  // Fallback textual
  const results = textSearch(query, notes).map(r => ({
    ...r,
    excerpt: extractExcerpt(
      notes.find((n: { id: string }) => n.id === r.id)?.content ?? '',
      query,
    ),
  }))

  return NextResponse.json({ results, mode: 'text' })
}
