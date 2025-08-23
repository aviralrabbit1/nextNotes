import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export const authUtils = {
  setTokens: (accessToken, refreshToken) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 }) // 1 day
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 }) // 7 days
  },

  getAccessToken: () => {
    return Cookies.get(ACCESS_TOKEN_KEY)
  },

  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_KEY)
  },

  removeTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY)
    Cookies.remove(REFRESH_TOKEN_KEY)
    Cookies.remove(USER_KEY)
  },

  setUser: (user) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 })
  },

  getUser: () => {
    const user = Cookies.get(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    return !!authUtils.getAccessToken()
  }
}
