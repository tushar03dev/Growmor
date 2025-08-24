"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

type User = {
  id?: string
  name: string
  email: string
  role?: "user" | "admin"
}

let tempUser: User

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  verifyOtp: (otp: string) => Promise<boolean>
  isAdmin: boolean
  adminLogin: (email: string, password: string) => Promise<boolean>
  adminLogout: () => void
  isAdminAuthenticated: boolean
  adminToken: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
        }

        const storedAdminToken = localStorage.getItem("adminToken")
        if (storedAdminToken) {
          setAdminToken(storedAdminToken)
          setIsAdminAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])


  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin`, { email, password })
      if (response.data && response.data.token) {
        localStorage.setItem("adminToken", response.data.token)
        setAdminToken(response.data.token)
        setIsAdminAuthenticated(true)

        const adminUserData = {
          id: response.data.id || "admin-" + Math.random().toString(36).substr(2, 9),
          name: response.data.name || "Admin",
          email: email,
          role: "admin" as const,
        }

        setUser(adminUserData)
        localStorage.setItem("adminUser", JSON.stringify(adminUserData))

        return true
      } else {
        console.error("Admin login failed. Please try again.")
        return false
      }
    } catch (error) {
      console.error("Admin login failed:", error)
      return false
    }
  }

  const adminLogout = () => {
    setAdminToken(null)
    setIsAdminAuthenticated(false)
    setUser(null)
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/login")
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password })
      if (response.data) {
        localStorage.setItem("token", response.data.token)
        alert("Login successful!")
        window.location.href = "/"

        const userData = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          name: response.data.name,
          role: response.data.role,
          email,
        }
        localStorage.setItem("user", JSON.stringify(userData))

        setUser(userData)
        return true
      } else {
        console.error("Login failed. Please try again.")
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, { name, email, password })
      if (response.data.success) {
        tempUser = { name, email }
        alert("Otp sent successfully")
        return true
      } else {
        console.error("Otp not sent. Please try again.")
        return false
      }
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    }
  }

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      const { email } = tempUser
      if (!email) {
        console.error("Email is required for otp verification")
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/otp/verify`, { email, otp })

      if (response.data.success) {
        localStorage.setItem("token", response.data.token)

        const userData = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          name: tempUser.name,
          email: tempUser.email,
          role: response.data.role,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      } else {
        console.error("Signup failed. Please try again.")
        return false
      }
    } catch (error) {
      console.error("OTP verification failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const isAdmin = user?.role === "admin"

  return (
      <AuthContext.Provider
          value={{
            user,
            isLoading,
            login,
            signup,
            logout,
            verifyOtp,
            isAdmin,
            adminLogin,
            adminLogout,
            isAdminAuthenticated,
            adminToken,
          }}
      >
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
