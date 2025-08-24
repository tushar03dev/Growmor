"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

export default function AdminRedirect() {
    const router = useRouter()

    useEffect(() => {
        const adminAuth = localStorage.getItem("adminAuth")
        if (adminAuth !== "true") {
            // Not authenticated, go back to login page
            router.push("/login")
        }
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold">Redirecting...</h2>
            </div>
        </div>
    )
}
