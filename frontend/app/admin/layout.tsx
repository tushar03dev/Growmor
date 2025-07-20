"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const { user, isAdmin, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.push("/login")
        }
    }, [user, isAdmin, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user || !isAdmin) {
        return null
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <AdminHeader />
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}
