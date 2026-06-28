import { create } from 'zustand'
import { Notebook, Note } from '@/types'
import { generateId } from './utils'

const NOTEBOOK_COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF2D55', '#AF52DE', '#5856D6']

// 'all' = todas as folhas, 'loose' = folhas soltas, string = id do caderno
export type ActiveFilter = 'all' | 'loose' | string

interface AppState {
  notebooks: Notebook[]
  notes: Record<string, Note>
  activeFilter: ActiveFilter
  searchQuery: string

  newSheetOpen: boolean
  newSheetLaneId: string
  openNewSheet: (laneId?: string) => void
  closeNewSheet: () => void

  setNotebooks: (notebooks: Notebook[]) => void
  setNotes: (notes: Note[]) => void

  addNote: (note: Note) => void
  updateNote: (id: string, patch: Partial<Note>) => void
  deleteNote: (id: string) => void
  moveNote: (noteId: string, toLaneId: string) => void
  moveNoteToNotebook: (noteId: string, notebookId: string | null) => void

  addNotebook: (name: string) => void
  updateNotebook: (id: string, patch: Partial<Notebook>) => void
  deleteNotebook: (id: string) => void

  setActiveFilter: (filter: ActiveFilter) => void
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  notebooks: [],
  notes: {},
  activeFilter: 'all',
  searchQuery: '',

  newSheetOpen: false,
  newSheetLaneId: 'todo',
  openNewSheet: (laneId = 'todo') => set({ newSheetOpen: true, newSheetLaneId: laneId }),
  closeNewSheet: () => set({ newSheetOpen: false }),

  setNotebooks: (notebooks) => set({ notebooks }),
  setNotes: (notes) => set({ notes: Object.fromEntries(notes.map(n => [n.id, n])) }),

  addNote: (note) => set(s => ({ notes: { ...s.notes, [note.id]: note } })),
  updateNote: (id, patch) =>
    set(s => ({
      notes: {
        ...s.notes,
        [id]: { ...s.notes[id], ...patch, updatedAt: new Date().toISOString() },
      },
    })),
  deleteNote: (id) =>
    set(s => {
      const notes = { ...s.notes }
      delete notes[id]
      return { notes }
    }),
  moveNote: (noteId, toLaneId) =>
    set(s => ({
      notes: {
        ...s.notes,
        [noteId]: { ...s.notes[noteId], laneId: toLaneId, updatedAt: new Date().toISOString() },
      },
    })),
  moveNoteToNotebook: (noteId, notebookId) =>
    set(s => ({
      notes: {
        ...s.notes,
        [noteId]: { ...s.notes[noteId], notebookId, updatedAt: new Date().toISOString() },
      },
    })),

  addNotebook: (name) =>
    set(s => ({
      notebooks: [
        ...s.notebooks,
        {
          id: generateId(),
          name,
          color: NOTEBOOK_COLORS[s.notebooks.length % NOTEBOOK_COLORS.length],
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateNotebook: (id, patch) =>
    set(s => ({
      notebooks: s.notebooks.map(nb => (nb.id === id ? { ...nb, ...patch } : nb)),
    })),
  deleteNotebook: (id) =>
    set(s => ({
      notebooks: s.notebooks.filter(nb => nb.id !== id),
      notes: Object.fromEntries(
        Object.entries(s.notes).map(([k, n]) =>
          n.notebookId === id ? [k, { ...n, notebookId: null }] : [k, n]
        )
      ),
    })),

  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
