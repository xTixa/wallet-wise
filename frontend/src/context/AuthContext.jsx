import { useState } from 'react'
import api from '../lib/api.js'
import { AuthContext } from './auth-context.js'
import { applyTheme } from '../lib/theme.js'

function readStoredUser() {
  const raw = localStorage.getItem('ww_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('ww_token'))

  function persistSession(data) {
    localStorage.setItem('ww_token', data.token)
    localStorage.setItem('ww_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    applyTheme(data.user.theme)
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    persistSession(data)
    return data.user
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    persistSession(data)
    return data.user
  }

  function logout() {
    localStorage.removeItem('ww_token')
    localStorage.removeItem('ww_user')
    setToken(null)
    setUser(null)
  }

  function updateUser(patch) {
    setUser((current) => {
      if (!current) return current
      const next = { ...current, ...patch }
      localStorage.setItem('ww_user', JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, updateUser, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  )
}
