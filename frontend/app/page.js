'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotes, deleteNote, openModal, closeModal, updateFormData, createNote, updateNote } from './store/notesSlice'
import AuthGuard from './components/AuthGuard'
import Header from './components/Header'
import { useAuth } from './hooks/useAuth'

export default function HomePage() {
  const dispatch = useDispatch()
  const { notes, loading, showModal, editingNote, formData } = useSelector(state => state.notes)
  const { user } = useAuth()

  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation()
    dispatch(deleteNote(noteId))
  }

  const handleEditNote = (note) => {
    dispatch(openModal(note))
  }

  const handleCreateNew = () => {
    dispatch(openModal())
  }

  const handleSaveNote = () => {
    if (!formData.note_title.trim()) return

    if (editingNote) {
      dispatch(updateNote({ 
        noteId: editingNote.note_id, 
        noteData: formData 
      }))
    } else {
      dispatch(createNote(formData))
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <Header />
        <div className="max-w-6xl mx-auto px-6">
          <div className="loading">Loading your notes...</div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <Header />
      <div className="max-w-6xl mx-auto px-6">
        <div className="greeting">
          Good Morning {user?.first_name || 'User'}!
        </div>
        
        <div className="notes-grid">
          {notes.map((note) => (
            <div 
              key={note.note_id} 
              className="note-card"
              onClick={() => handleEditNote(note)}
            >
              <button 
                className="delete-btn"
                onClick={(e) => handleDeleteNote(e, note.note_id)}
              >
                ×
              </button>
              <div className="note-title">{note.note_title}</div>
              <div className="note-content">{note.note_content}</div>
              <div className="note-date">
                {new Date(note.last_update).toLocaleDateString()}
              </div>
            </div>
          ))}
          
          <div 
            className="note-card add-note-card"
            onClick={handleCreateNew}
          >
            <span className="text-4xl text-gray-400">+</span>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => dispatch(closeModal())}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  {editingNote ? 'Edit Note' : 'Create Note'}
                </div>
                <button 
                  onClick={() => dispatch(closeModal())}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <input
                className="modal-input"
                placeholder="Note title"
                value={formData.note_title}
                onChange={(e) => dispatch(updateFormData({ note_title: e.target.value }))}
              />
              
              <textarea
                className="modal-textarea"
                placeholder="Write your note here..."
                value={formData.note_content}
                onChange={(e) => dispatch(updateFormData({ note_content: e.target.value }))}
              />
              
              <div className="modal-actions">
                <button className="btn btn-modal-save" onClick={handleSaveNote}>
                  Save
                </button>
                <button className="btn btn-modal-cancel" onClick={() => dispatch(closeModal())}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}