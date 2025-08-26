import { useSelector } from 'react-redux'

export const useAuth = () => {
  const auth = useSelector(state => state.auth)
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
  }
}
