export interface User {
  id: string
  name: string
  email: string
  image?: string
  provider: 'google' | 'microsoft'
}

export interface Folder {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface Notebook {
  id: string
  name: string
  color: string
  folderId: string | null
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  laneId: string
  notebookId: string | null
  folderId: string | null
  createdAt: string
  updatedAt: string
}

export interface Lane {
  id: string
  name: string
  color: string
  order: number
}

export const DEFAULT_LANES: Lane[] = [
  { id: 'todo', name: 'A fazer', color: '#007AFF', order: 0 },
  { id: 'inprogress', name: 'Em andamento', color: '#FF9500', order: 1 },
  { id: 'blocked', name: 'Bloqueada', color: '#FF2D55', order: 2 },
  { id: 'done', name: 'Concluída', color: '#34C759', order: 3 },
]

export interface SearchResult {
  note: Note
  score: number
  excerpt: string
}
