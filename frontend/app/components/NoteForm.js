import { useState, useEffect } from 'react'

export default function NoteForm({ onSubmit, editingNote, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    note_title: '',
    note_content: '',
  })

  useEffect(() => {
    if (editingNote) {
      setFormData({
        note_title: editingNote.note_title,
        note_content: editingNote.note_content,
      })
    } else {
      setFormData({
        note_title: '',
        note_content: '',
      })
    }
  }, [editingNote])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    if (!editingNote) {
      setFormData({ note_title: '', note_content: '' })
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">
        {editingNote ? 'Edit Note' : 'Create New Note'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="note_title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="note_title"
            id="note_title"
            required
            className="input-field"
            value={formData.note_title}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="note_content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            name="note_content"
            id="note_content"
            rows="5"
            required
            className="input-field"
            value={formData.note_content}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
          </button>
          
          {editingNote && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}