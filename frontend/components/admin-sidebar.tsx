"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Package,
    FolderTree,
    FileText,
    ShoppingCart,
    BarChart3,
    DollarSign,
    Settings,
    Users,
    Leaf,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"

const menuItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
    },
]

const managementItems = [
    {
        title: "Products",
        url: "/admin/products",
        icon: Package,
    },
    {
        title: "Categories",
        url: "/admin/categories",
        icon: FolderTree,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Blog",
        url: "/admin/blog",
        icon: FileText,
    },
]

const settingsItems = [
    {
        title: "Price & Inventory",
        url: "/admin/inventory",
        icon: DollarSign,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <Leaf className="h-8 w-8 text-green-600" />
                    <div>
                        <h2 className="text-lg font-semibold">GROWMOR</h2>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                            <span>Logout</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
