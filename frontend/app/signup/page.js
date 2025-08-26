'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { registerUser, clearError } from '../store/authSlice'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
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
    const result = await dispatch(registerUser(formData))
    if (result.type === 'auth/register/fulfilled') {
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
          <h2 className="auth-title">Sign up</h2>
          
          {error && (
            <div className="error-message">
              {/* {Object.keys(error).map(key => (
                <div key={key}>
                  {Array.isArray(error[key]) ? error[key][0] : error[key]}
                </div>
              ))} */}
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

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
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
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

          <div className="form-group">
            <label htmlFor="password_confirm" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
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
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <div className="auth-link">
            Already have an account? <Link href="/login">Login</Link>
          </div>
        </form>
      </div>
    </>
  )
}
