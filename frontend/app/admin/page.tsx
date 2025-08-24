"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, ArrowLeft } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check admin credentials (in production, this should be server-side)
      if (email === "admin@growmor.com" && password === "admin123") {
        // Store admin authentication status
        localStorage.setItem("adminAuthenticated", "true")
        router.push("/admin/dashboard")
      } else {
        setError("Invalid admin credentials. Please check your email and password.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="absolute left-4 top-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mb-6 flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">GROWMOR Admin</span>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Shield className="h-6 w-6 mr-2" />
              Admin Access
            </CardTitle>
            <CardDescription>Enter your admin credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@growmor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              <p>Demo credentials:</p>
              <p>Email: admin@growmor.com</p>
              <p>Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
