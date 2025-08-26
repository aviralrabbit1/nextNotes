import { configureStore } from '@reduxjs/toolkit'
import notesSlice from './notesSlice'
import authSlice from './authSlice'

export const store = configureStore({
  reducer: {
    notes: notesSlice,
    auth: authSlice,
  },
})