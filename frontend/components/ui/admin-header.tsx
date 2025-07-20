"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AdminHeader() {
    const { user } = useAuth()

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
