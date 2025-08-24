"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Package,
    ShoppingCart,
    DollarSign,
    Users,
    FileText,
    AlertTriangle,
    CheckCircle,
    Shield,
} from "lucide-react"
import { AnalyticsChart } from "@/components/analytics-chart"
import { RecentOrders } from "@/components/recent-orders"
import { TopProducts } from "@/components/top-products"

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const adminAuth = localStorage.getItem("adminAuth")
        if (adminAuth === "true") {
            setIsAuthenticated(true)
        } else {
            router.push("/admin")
        }
        setIsLoading(false)
    }, [router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Verifying admin access...</h2>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    const stats = [
        {
            title: "Total Revenue",
            value: "$45,231.89",
            description: "+20.1% from last month",
            icon: DollarSign,
            color: "text-green-600",
            trend: "up",
        },
        {
            title: "Orders",
            value: "2,350",
            description: "+180.1% from last month",
            icon: ShoppingCart,
            color: "text-blue-600",
            trend: "up",
        },
        {
            title: "Products",
            value: "1,234",
            description: "+19% from last month",
            icon: Package,
            color: "text-purple-600",
            trend: "up",
        },
        {
            title: "Active Users",
            value: "573",
            description: "+201 since last hour",
            icon: Users,
            color: "text-orange-600",
            trend: "up",
        },
    ]

    const quickStats = [
        {
            title: "Low Stock Items",
            value: "12",
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950",
        },
        {
            title: "Pending Orders",
            value: "23",
            icon: ShoppingCart,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-950",
        },
        {
            title: "Published Posts",
            value: "45",
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950",
        },
        {
            title: "Completed Orders",
            value: "89",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950",
        },
    ]

    return (
        <div className="min-h-screen bg-muted/40 p-4">

            <div className="container py-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">Here's what's happening with your plant store today.</p>
                    </div>

                    {/* Main Stats */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {quickStats.map((stat) => (
                            <Card key={stat.title} className={stat.bgColor}>
                                <CardContent className="flex items-center p-6">
                                    <stat.icon className={`h-8 w-8 ${stat.color} mr-4`} />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts and Tables */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Sales Overview</CardTitle>
                                <CardDescription>Revenue and orders over the last 12 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnalyticsChart />
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Products</CardTitle>
                                <CardDescription>Best selling plants this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TopProducts />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest orders from your customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentOrders />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
