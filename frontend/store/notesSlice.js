import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notesApi } from '../lib/api'

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
  return await notesApi.getAllNotes()
})

export const createNote = createAsyncThunk('notes/createNote', async (noteData) => {
  return await notesApi.createNote(noteData)
})

export const updateNote = createAsyncThunk('notes/updateNote', async ({ noteId, noteData }) => {
  return await notesApi.updateNote(noteId, noteData)
})

export const deleteNote = createAsyncThunk('notes/deleteNote', async (noteId) => {
  await notesApi.deleteNote(noteId)
  return noteId
})

const initialState = {
  notes: [],
  loading: false,
  showModal: false,
  editingNote: null,
  formData: { note_title: '', note_content: '' }
}

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.showModal = true
      state.editingNote = action.payload || null
      state.formData = action.payload 
        ? { note_title: action.payload.note_title, note_content: action.payload.note_content }
        : { note_title: '', note_content: '' }
    },
    closeModal: (state) => {
      state.showModal = false
      state.editingNote = null
      state.formData = { note_title: '', note_content: '' }
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false
        state.notes = action.payload
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload)
        state.showModal = false
        state.formData = { note_title: '', note_content: '' }
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(note => note.note_id === action.payload.note_id)
        if (index !== -1) {
          state.notes[index] = action.payload
        }
        state.showModal = false
        state.editingNote = null
        state.formData = { note_title: '', note_content: '' }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(note => note.note_id !== action.payload)
      })
  },
})

export const { openModal, closeModal, updateFormData } = notesSlice.actions
export default notesSlice.reducer