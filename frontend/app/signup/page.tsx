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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup, verifyOtp } = useAuth()
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const success = await signup(name, email, password)
      if (success) {
        setShowOtpInput(true)
      } else {
        setError("Failed to create account")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    const verified = await verifyOtp(otp)
    if (verified) {
      alert("Account created successfully!")
      router.push("/")
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would redirect to the OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful signup
      await signup(`${provider} User`, `${provider}@example.com`, "password")
      router.push("/")
    } catch (err) {
      setError(`Failed to signup with ${provider}`)
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your information to create a GROWMOR account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

          {/*{!showOtpInput && (*/}
          {/*  <>*/}
          {/*    <OAuthButtons onOAuthLogin={handleOAuthLogin} isLoading={isLoading} />*/}

          {/*    <div className="relative">*/}
          {/*      <div className="absolute inset-0 flex items-center">*/}
          {/*        <Separator />*/}
          {/*      </div>*/}
          {/*      <div className="relative flex justify-center text-xs uppercase">*/}
          {/*        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </>*/}
          {/*)}*/}

          <form onSubmit={handleSignup} className="space-y-4">
            {!showOtpInput ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <Button type="button" className="w-full" onClick={handleOtpVerify}>
                  Verify OTP
                </Button>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
