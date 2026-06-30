import React, { createContext, useState, useEffect, useContext } from 'react'

type User = { id?: string | number; _id?: string | number; usuarioId?: string | number; userId?: string | number; nickname?: string } | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (nickname: string, password: string) => Promise<boolean>
  logout: () => void
}

const normalizeUser = (user: any) => {
  if (!user) return null

  const normalizedUser = {
    ...user,
    id: user._id ?? user.id ?? user.usuarioId ?? user.userId,
    nickname: user.nickname ?? user.username ?? user.name,
  }

  return normalizedUser
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(normalizeUser(JSON.parse(savedUser)))
    }
    setLoading(false)
  }, [])

  const login = async (nickname: string, password: string) => {
    if (password !== '123456') return false
    const res = await fetch('http://localhost:5000/usuarios')
    const usuarios = await res.json()
    const found = usuarios.find((u: any) => u.nickname === nickname)
    if (found) {
      const normalizedUser = normalizeUser(found)
      setUser(normalizedUser)
      localStorage.setItem('user', JSON.stringify(normalizedUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}