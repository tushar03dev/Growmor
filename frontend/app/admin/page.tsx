"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, FileText, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/")
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return null
  }

  const stats = [
    {
      title: "Total Products",
      value: "124",
      description: "Active products in store",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: "1,234",
      description: "Orders this month",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: "$12,345",
      description: "Revenue this month",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "Blog Posts",
      value: "45",
      description: "Published articles",
      icon: FileText,
      color: "text-purple-600",
    },
  ]

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove products from your store",
      href: "/admin/products",
      icon: Package,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "Manage Blog",
      description: "Create and manage blog posts and articles",
      href: "/admin/blog",
      icon: FileText,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
    {
      title: "View Orders",
      description: "Monitor and manage customer orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      title: "Analytics",
      description: "View sales and performance analytics",
      href: "/admin/analytics",
      icon: TrendingUp,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    },
  ]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New order received", time: "2 minutes ago", type: "order" },
              { action: "Product 'Monstera Deliciosa' updated", time: "1 hour ago", type: "product" },
              { action: "Blog post 'Plant Care Tips' published", time: "3 hours ago", type: "blog" },
              { action: "New customer registered", time: "5 hours ago", type: "user" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
