import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notesAPI } from '../../lib/api'

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notesAPI.getNotes()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notes')
    }
  }
)

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await notesAPI.createNote(noteData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create note')
    }
  }
)

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ noteId, noteData }, { rejectWithValue }) => {
    try {
      const response = await notesAPI.updateNote(noteId, noteData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update note')
    }
  }
)

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId, { rejectWithValue }) => {
    try {
      await notesAPI.deleteNote(noteId)
      return noteId
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete note')
    }
  }
)

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.items.findIndex(note => note.note_id === action.payload.note_id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter(note => note.note_id !== action.payload)
      })
  },
})

export const { clearError } = notesSlice.actions
export default notesSlice.reducer