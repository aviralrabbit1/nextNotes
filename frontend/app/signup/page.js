"use client";

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signupUser, clearError } from '../store/slices/authSlice'
import Header from '../components/Header'
import Cookies from 'js-cookie'

export default function Signup() {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    password: '',
    confirmPassword: '',
  })
  
  const dispatch = useDispatch()
  const router = useRouter()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      dispatch(clearError())
      return
    }
    
    const { confirmPassword, ...registerData } = formData
    const result = await dispatch(signupUser(registerData)).unwrap();
    console.log("singup from inside handle signup click, password match", result);
    console.log(typeof result)
    
    
    if (!result.error) {
      // Store tokens in cookies
      Cookies.set('access_token', result.access)
      Cookies.set('refresh_token', result.refresh)
      router.push('/notes')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card border rounded-lg mt-10 bg-secondary shadow">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us to start organizing your notes</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {typeof error === 'object' ? error.error || 'Registration failed from page.js' : error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                className="input-field"
                placeholder="Choose a username"
                value={formData.user_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                className="input-field"
                placeholder="Enter your email"
                value={formData.user_email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input-field"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input-field"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-secondary font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}