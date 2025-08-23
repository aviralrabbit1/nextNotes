'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { loginUser, clearError } from '../store/authSlice'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const dispatch = useDispatch()
  const router = useRouter()
  const { isAuthenticated, loading, error } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(formData))
    if (result.type === 'auth/login/fulfilled') {
      router.push('/')
    }
  }

  if (isAuthenticated) {
    return <div className="loading">Redirecting...</div>
  }

  return (
    <>
      <Header />
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">Login</h2>
          
          {error && (
            <div className="error-message">
              {error.email?.[0] || error.password?.[0] || error.non_field_errors?.[0] || error.message || 'Login failed'}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-link">
            Don't have an account? <Link href="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </>
  )
}
