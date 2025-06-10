"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  verifyOtp: (token: string, otp: string) => Promise<boolean>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // This would be replaced with actual API call
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response - in real app, this would come from your backend
      const mockUser = {
        id: "user123",
        name: email.split("@")[0],
        email,
        role: email.includes("admin") ? ("admin" as const) : ("user" as const),
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // This would be replaced with actual API call
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store OTP token (in real app, this would come from your backend)
      const mockOtpToken = "mock-otp-token-123456"
      localStorage.setItem("otpToken", JSON.stringify(mockOtpToken))

      return true
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    }
  }

  const verifyOtp = async (token: string, otp: string): Promise<boolean> => {
    try {
      // This would be replaced with actual API call
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user creation after OTP verification
      const mockUser = {
        id: "user456",
        name: "New User",
        email: "user@example.com",
        role: "user" as const,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.removeItem("otpToken")

      return true
    } catch (error) {
      console.error("OTP verification failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, verifyOtp, isAdmin }}>
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
