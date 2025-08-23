import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../lib/api'
import { authUtils } from '../lib/auth'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials)
    authUtils.setTokens(response.access, response.refresh)
    authUtils.setUser(response.user)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Login failed' })
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.register(userData)
    authUtils.setTokens(response.access, response.refresh)
    authUtils.setUser(response.user)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Registration failed' })
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authApi.logout()
})

const initialState = {
  user: authUtils.getUser(),
  isAuthenticated: authUtils.isAuthenticated(),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    checkAuth: (state) => {
      state.user = authUtils.getUser()
      state.isAuthenticated = authUtils.isAuthenticated()
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.error = null
      })
  },
})

export const { clearError, checkAuth } = authSlice.actions
export default authSlice.reducer
