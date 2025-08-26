'use client'

import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { logoutUser } from '../store/authSlice'

export default function Header() {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/login')
  }

  return (
    <div className="header">
      <div className="header-content">
        <div className="logo">Keep Notes</div>
        <div className="nav-links">
          <span className="nav-link">About</span>
          <span className="nav-link">Notes</span>
          <span className="nav-link">Account</span>
          {user && (
            <>
              <span className="nav-link">{user.first_name}</span>
              <span className="nav-link" onClick={handleLogout}>
                Logout
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
