import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = Cookies.get('refresh_token')
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken
        })
        
        const { access } = response.data
        Cookies.set('access_token', access)
        originalRequest.headers.Authorization = `Bearer ${access}`
        
        return api(originalRequest)
      } catch (error) {
        // Redirect to login if refresh fails
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (user_email, password) => api.post('/login/', { user_email, password }),
  signup: (user_name, user_email, password) => 
    api.post('/signup/', { user_name, user_email, password }),
}

// Notes API
export const notesAPI = {
  getNotes: () => api.get('/notes/'),
  createNote: (noteData) => api.post('/notes/', noteData),
  updateNote: (noteId, noteData) => api.put(`/notes/${noteId}/`, noteData),
  deleteNote: (noteId) => api.delete(`/notes/${noteId}/`),
}

export default api