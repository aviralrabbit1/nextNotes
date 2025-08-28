import '../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '../store'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on route change
    const token = Cookies.get('access_token')
    const publicPaths = ['/login', '/register']
    
    if (!token && !publicPaths.includes(router.pathname)) {
      router.push('/login')
    }
  }, [router])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp