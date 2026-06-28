'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Board } from '@/components/board/Board'
import { localStore } from '@/lib/storage'

export default function DashboardPage() {
  const { notebooks, notes, setNotebooks, setNotes, activeFilter } = useAppStore()

  useEffect(() => {
    const savedNotebooks = localStore.getNotebooks()
    const savedNotes = localStore.getNotes()
    if (savedNotebooks.length) setNotebooks(savedNotebooks)
    if (savedNotes.length) setNotes(savedNotes)
  }, [setNotebooks, setNotes])

  useEffect(() => {
    if (notebooks.length) localStore.saveNotebooks(notebooks)
  }, [notebooks])

  useEffect(() => {
    Object.values(notes).forEach(note => localStore.saveNote(note))
  }, [notes])

  const allNotes = Object.values(notes)

  const filteredNotes =
    activeFilter === 'all'
      ? allNotes
      : activeFilter === 'loose'
        ? allNotes.filter(n => n.notebookId === null)
        : allNotes.filter(n => n.notebookId === activeFilter)

  return <Board activeFilter={activeFilter} filteredNotes={filteredNotes} />
}
