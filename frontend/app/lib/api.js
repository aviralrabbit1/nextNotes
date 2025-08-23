import axios from 'axios'
import { authUtils } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authUtils.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = authUtils.getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })
          
          const { access } = response.data
          authUtils.setTokens(access, refreshToken)
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authUtils.removeTokens()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials)
    return response.data
  },

  logout: async () => {
    const refreshToken = authUtils.getRefreshToken()
    if (refreshToken) {
      await api.post('/auth/logout/', { refresh: refreshToken })
    }
    authUtils.removeTokens()
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/')
    return response.data
  },
}

export const notesApi = {
  getAllNotes: async () => {
    const response = await api.get('/notes/')
    return response.data
  },

  createNote: async (noteData) => {
    const response = await api.post('/notes/', noteData)
    return response.data
  },

  updateNote: async (noteId, noteData) => {
    const response = await api.put(`/notes/${noteId}/`, noteData)
    return response.data
  },

  deleteNote: async (noteId) => {
    await api.delete(`/notes/${noteId}/`)
  },
}
