import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../api/client'

interface User {
  id: string
  email: string
  full_name: string
  role: 'customer' | 'admin'
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  googleLogin: (credential: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

interface RegisterData {
  email: string
  password: string
  full_name: string
  phone?: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('snazzy_token')
    if (!token) { setLoading(false); return }

    api.get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('snazzy_token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('snazzy_token', data.token)
    setUser(data.user)
  }

  async function register(form: RegisterData) {
    const { data } = await api.post('/api/auth/register', form)
    localStorage.setItem('snazzy_token', data.token)
    setUser(data.user)
  }

  async function googleLogin(credential: string) {
    const { data } = await api.post('/api/auth/google', { credential })
    localStorage.setItem('snazzy_token', data.token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('snazzy_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, googleLogin, logout,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
