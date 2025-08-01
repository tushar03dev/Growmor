"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";

type User = {
  id?: string
  name: string
  email: string
  role?: "user" | "admin"
}

let tempUser:User;

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
        const storedUser = localStorage.getItem("token")
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        // Redirect to dashboard or another page
        window.location.href = '/';

        const userData = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          name: response.data.name,
          role: response.data.role,
          email,
        }
        localStorage.setItem("user", JSON.stringify(userData))

        setUser(userData)
        return true
      } else{
        console.error('Login failed. Please try again.');
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, { name, email, password });
      if (response.data) {
        // Temporarily store user data
        tempUser = { name, email};
        alert("Otp sent successfully");

        localStorage.setItem("otpToken", JSON.stringify(response.data.token));
        return true
      } else{
        console.error('Otp not sent. Please try again.');
        return false
      }
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    }
  }

  const verifyOtp = async (otpToken: string, otp: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${process.env.NEXT_API_URL}/auth/verify`, {otpToken, otp });

      if (response.data) {
        localStorage.setItem('token', JSON.stringify(response.data.token));

        // Mock user data
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
        console.error('Signup failed. Please try again.');
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
