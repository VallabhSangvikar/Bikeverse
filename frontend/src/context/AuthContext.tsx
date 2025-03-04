import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

// Interface matching the MongoDB Schema
interface User {
  id: string
  email: string
  role: "buyer" | "seller" | "admin"
  name: string
  phone?: string
  setup: boolean
  businessType?: "showroom" | "individual"
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
    coordinates?: {
      latitude?: number
      longitude?: number
    }
  }
  documents?: {
    idProof?: string
    businessLicense?: string
    verificationStatus: "pending" | "verified" | "rejected"
  }
  rating?: number
}

interface AuthResponse {
  user: User
  token: string
}

interface UpdateUserData {
  name?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
    coordinates?: {
      latitude?: number
      longitude?: number
    }
  }
  businessType?: "showroom" | "individual"
  documents?: {
    idProof?: string
    businessLicense?: string
  }
  setup?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string, role: "buyer" | "seller") => Promise<void>
  updateUserSetup: (data: UpdateUserData) => Promise<void>
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
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
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
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    } catch (error) {
      throw new Error('Signup failed')
    }
  }

  const updateUserSetup = async (userData: UpdateUserData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication required')
      
      const response = await fetch(`${API_URL}/auth/setup`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) throw new Error('Failed to update user profile')

      const updatedUser = await response.json()
      
      // Update local storage and state with the updated user data
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      throw new Error('Profile update failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUserSetup, isLoading }}>
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