"use client";

import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useRouter } from 'next/navigation'

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <header className="bg-primary border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 bg-secondary">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold color-primary">Keep Notes</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            {user ? (
              <>
                <Link href="/notes" className="text-gray-700 hover:text-primary transition-colors">
                  My Notes
                </Link>
                <span className="text-gray-700">Welcome, {user.user_name}</span>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}