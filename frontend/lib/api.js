import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const notesApi = {
  // Get all notes
  getAllNotes: async () => {
    const response = await api.get('/notes/');
    return response.data;
  },

  // Get single note
  getNote: async (noteId) => {
    const response = await api.get(`/notes/${noteId}/`);
    return response.data;
  },

  // Create note
  createNote: async (noteData) => {
    const response = await api.post('/notes/', noteData);
    return response.data;
  },

  // Update note
  updateNote: async (noteId, noteData) => {
    const response = await api.put(`/notes/${noteId}/`, noteData);
    return response.data;
  },

  // Delete note
  deleteNote: async (noteId) => {
    await api.delete(`/notes/${noteId}/`);
  },
};