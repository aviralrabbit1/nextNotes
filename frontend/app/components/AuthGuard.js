'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from '../store/slices/authSlice'

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="loading">
        Checking authentication...
      </div>
    )
  }

  return children
}
