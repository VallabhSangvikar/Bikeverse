import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "buyer" | "seller"
  verified?: boolean
}

interface AuthResponse {
  user: User
  token: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string, role: "buyer" | "seller") => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) throw new Error('Login failed')

      const data: AuthResponse = await response.json();
      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        verified: data.user.verified
      };
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(data.user)
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const signup = async (name: string, email: string, password: string, role: "buyer" | "seller") => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) throw new Error('Signup failed')

      const data: AuthResponse = await response.json()
      // Ensure we only use the necessary user fields
      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        verified: data.user.verified
      };
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(data.user)
    } catch (error) {
      throw new Error('Signup failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

