'use client'

import { Note, Notebook } from '@/types'

const PREFIX = 'notas-workflow:'

export const localStore = {
  getNotebooks(): Notebook[] {
    try {
      return JSON.parse(localStorage.getItem(`${PREFIX}notebooks`) ?? '[]')
    } catch { return [] }
  },
  saveNotebooks(notebooks: Notebook[]) {
    localStorage.setItem(`${PREFIX}notebooks`, JSON.stringify(notebooks))
  },
  getNotes(): Note[] {
    try {
      return JSON.parse(localStorage.getItem(`${PREFIX}notes`) ?? '[]')
    } catch { return [] }
  },
  saveNote(note: Note) {
    const notes = this.getNotes()
    const idx = notes.findIndex(n => n.id === note.id)
    if (idx >= 0) notes[idx] = note
    else notes.push(note)
    localStorage.setItem(`${PREFIX}notes`, JSON.stringify(notes))
  },
  deleteNote(id: string) {
    const notes = this.getNotes().filter(n => n.id !== id)
    localStorage.setItem(`${PREFIX}notes`, JSON.stringify(notes))
  },
  getEmbedding(noteId: string): number[] | null {
    try {
      return JSON.parse(localStorage.getItem(`${PREFIX}embed:${noteId}`) ?? 'null')
    } catch { return null }
  },
  saveEmbedding(noteId: string, embedding: number[]) {
    localStorage.setItem(`${PREFIX}embed:${noteId}`, JSON.stringify(embedding))
  },
}
