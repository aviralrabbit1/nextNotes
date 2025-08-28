export default function NoteList({ notes, onEdit, onDelete, isLoading }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notes...</p>
        </div>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
        <p className="text-gray-500 text-center py-8">No notes yet. Create your first note!</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
      
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.note_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">{note.note_title}</h3>
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{note.note_content}</p>
            
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>Created: {formatDate(note.created_on)}</span>
              <span>Updated: {formatDate(note.last_update)}</span>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => onEdit(note)}
                className="text-primary hover:text-secondary font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(note.note_id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}