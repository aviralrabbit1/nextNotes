'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotes, deleteNote, openModal, closeModal, updateFormData, createNote, updateNote } from '../store/notesSlice'

export default function HomePage() {
  const dispatch = useDispatch()
  const { notes, loading, showModal, editingNote, formData } = useSelector(state => state.notes)

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
      <div className="max-w-6xl mx-auto px-6">
        <div className="greeting">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="greeting">Good Morning Deva!</div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          className="note-card border-dashed border-2 flex items-center justify-center cursor-pointer min-h-32"
          onClick={handleCreateNew}
        >
          <span className="text-4xl text-gray-400">+</span>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => dispatch(closeModal())}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="modal-title">
                {editingNote ? 'Edit Note' : 'Create Note'}
              </div>
              <button 
                onClick={() => dispatch(closeModal())}
                className="text-gray-500 hover:text-gray-700 text-xl"
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
            
            <div className="flex justify-end">
              <button className="btn-primary" onClick={handleSaveNote}>
                Save
              </button>
              <button className="btn-secondary" onClick={() => dispatch(closeModal())}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}