import { createContext, useContext, useEffect, useState } from 'react'
import { getAdminSession, loginAdmin, logoutAdmin } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const data = await getAdminSession()
        if (!cancelled) setIsAuthenticated(!!data.authenticated)
      } catch {
        if (!cancelled) setIsAuthenticated(false)
      } finally {
        if (!cancelled) setAuthLoading(false)
      }
    }

    loadSession()
    return () => { cancelled = true }
  }, [])

  async function login(adminKey) {
    await loginAdmin(adminKey)
    setIsAuthenticated(true)
  }

  async function logout() {
    try {
      await logoutAdmin()
    } finally {
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
