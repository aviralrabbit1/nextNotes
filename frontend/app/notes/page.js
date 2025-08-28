"use client";

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { fetchNotes, createNote, updateNote, deleteNote } from '../store/slices/notesSlice'
import { logout } from '../store/slices/authSlice'
import Header from '../components/Header'
import NoteForm from '../components/NoteForm'
import NoteList from '../components/NoteList'

export default function Notes() {
  const [editingNote, setEditingNote] = useState(null)
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)
  const { items: notes, isLoading } = useSelector((state) => state.notes)

  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

  const handleCreateNote = async (noteData) => {
    await dispatch(createNote(noteData))
  }

  const handleUpdateNote = async (noteId, noteData) => {
    await dispatch(updateNote({ noteId, noteData }))
    setEditingNote(null)
  }

  const handleDeleteNote = async (noteId) => {
    await dispatch(deleteNote(noteId))
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <NoteForm 
              onSubmit={editingNote ? (data) => handleUpdateNote(editingNote.note_id, data) : handleCreateNote}
              editingNote={editingNote}
              onCancel={() => setEditingNote(null)}
              isLoading={isLoading}
            />
          </div>
          
          <div className="lg:col-span-2">
            <NoteList 
              notes={notes}
              onEdit={setEditingNote}
              onDelete={handleDeleteNote}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}