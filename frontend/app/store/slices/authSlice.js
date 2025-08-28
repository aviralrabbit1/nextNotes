// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../lib/api'

// Async thunks
export const loginUser = createAsyncThunk(
  'login',
  async ({ user_email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(user_email, password)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed')
    }
  }
)

export const signupUser = createAsyncThunk(
  'signup',
  async ({ user_name, user_email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(user_name, user_email, password)
      return response.data
    } catch (error) {
      return rejectWithValue(
          error.response?.data?.error ||  // backend error {"error": "Invalid credentials"})
          error.response?.data ||         // fallback whole response
          error.message ||                // JS error message
          'Registration failed from authSlice'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.access
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.access
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer