import type React from "react"
import { createContext, useState, useContext } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "buyer" | "seller"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string, role: "buyer" | "seller") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({ id: "1", name: "John Doe", email, role: "buyer" })
  }

  const logout = () => {
    setUser(null)
  }

  const signup = async (name: string, email: string, password: string, role: "buyer" | "seller") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({ id: "1", name, email, role })
  }

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

