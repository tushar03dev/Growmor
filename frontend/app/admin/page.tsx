"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import AdminDashboard from "@/app/admin/dashboard/page";

export default function AdminRedirect() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth")
    if (adminAuth !== "true") {
      setIsAuthenticated(false)
      router.push("/login")

    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (isAuthenticated === null) {
    // Loading state while checking
    return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold">Checking authentication...</h2>
          </div>
        </div>
    )
  }

  if (isAuthenticated) {
    return <AdminDashboard />
  }

  // While redirecting
  return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold">Redirecting...</h2>
        </div>
      </div>
  )
}
