"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { OAuthButtons } from "@/components/oauth-buttons"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const { login,adminLogin } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check admin credentials
      const success = await adminLogin(adminEmail, adminPassword)
      if (success) {
        // Store admin session
        localStorage.setItem("adminAuth", "true")
        router.push("/admin/dashboard")

      } else {
        setError("Invalid admin credentials")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would redirect to the OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful login
      await login(`${provider}@example.com`, "password")
      router.push("/")
    } catch (err) {
      setError(`Failed to login with ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <Link href="/" className="mb-4 flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">GROWMOR</span>
        </Link>

        {isAdminMode ? (
            // Admin Login Form
            <Card className="w-full max-w-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsAdminMode(false)} className="p-1">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-xl">Admin Login</CardTitle>
                </div>
                <CardDescription>Enter admin credentials to access the admin panel</CardDescription>
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
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Access Admin Panel"}
                  </Button>
                </form>
              </CardContent>
            </Card>
        ) : (
            // Regular Login Form
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email and password to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

                <OAuthButtons onOAuthLogin={handleOAuthLogin} isLoading={isLoading} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                          href="/forgot-password"
                          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-primary underline underline-offset-4 hover:text-primary/90">
                    Sign up
                  </Link>
                </div>
                <div className="text-center text-sm">
                  Admin?{" "}
                  <button
                      onClick={() => setIsAdminMode(true)}
                      className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    Access Admin Panel
                  </button>
                </div>
              </CardFooter>
            </Card>
        )}
      </div>
  )
}
