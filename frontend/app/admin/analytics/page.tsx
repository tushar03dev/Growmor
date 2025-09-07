"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalyticsChart } from "@/components/analytics-chart"
import { Badge } from "@/components/ui/badge"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    Loader2,
    AlertTriangle,
} from "lucide-react"
import { getAnalyticsData, getTopProducts, getAdminStats, type AdminStats, type Plant } from "@/lib/api/admin"
import { useAuth } from "@/components/auth-provider"

export default function AnalyticsPage() {
    const { isAdmin } = useAuth()
    const [timeRange, setTimeRange] = useState("monthly")
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [topProducts, setTopProducts] = useState<Plant[]>([])
    const [analyticsData, setAnalyticsData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            if (!isAdmin) return

            try {
                setIsLoading(true)
                setError(null)

                const [adminStats, products, analytics] = await Promise.all([
                    getAdminStats(),
                    getTopProducts(5),
                    getAnalyticsData(timeRange),
                ])

                setStats(adminStats)
                setTopProducts(products)
                setAnalyticsData(analytics)
            } catch (err) {
                console.error("Failed to fetch analytics data:", err)
                setError("Failed to load analytics data. Using fallback values.")
                setStats({
                    totalRevenue: 0,
                    totalOrders: 0,
                    totalProducts: 0,
                    totalUsers: 0,
                    pendingOrders: 0,
                    lowStockItems: 0,
                    completedOrders: 0,
                    publishedPosts: 0,
                })
                setTopProducts([])
                setAnalyticsData([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalyticsData()
    }, [isAdmin, timeRange])

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold">Loading analytics...</h2>
                </div>
            </div>
        )
    }

    const customerSegments = [
        { segment: "New Customers", count: Math.floor((stats?.totalUsers || 0) * 0.35), percentage: 35 },
        { segment: "Returning Customers", count: Math.floor((stats?.totalUsers || 0) * 0.48), percentage: 48 },
        { segment: "VIP Customers", count: Math.floor((stats?.totalUsers || 0) * 0.17), percentage: 17 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">Detailed insights into your store performance</p>
                    {error && (
                        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
                        </div>
                    )}
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="weekly">This Week</SelectItem>
                        <SelectItem value="monthly">This Month</SelectItem>
                        <SelectItem value="quarterly">This Quarter</SelectItem>
                        <SelectItem value="yearly">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalOrders.toLocaleString() || "0"}</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +12.5% from last period
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString() || "0"}</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +8.2% from last period
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString() || "0"}</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +15.3% from last period
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Products</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalProducts.toLocaleString() || "0"}</div>
                                <div className="flex items-center text-xs text-red-600">
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    -2.1% from last period
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Revenue Trend</CardTitle>
                                <CardDescription>Revenue and orders over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnalyticsChart data={analyticsData} />
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Products</CardTitle>
                                <CardDescription>Best performing products</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.length > 0 ? (
                                        topProducts.map((product, index) => (
                                            <div key={product._id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">#{index + 1}</Badge>
                                                    <div className="flex items-center gap-2">
                                                        {product.image?.imageUrl && (
                                                            <img
                                                                src={product.image.imageUrl || "/placeholder.svg"}
                                                                alt={product.name}
                                                                className="w-8 h-8 object-cover rounded"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium">{product.name}</p>
                                                            <p className="text-xs text-muted-foreground">${product.price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No product data available</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="sales" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Performance</CardTitle>
                            <CardDescription>Detailed sales analytics and trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnalyticsChart data={analyticsData} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Performance</CardTitle>
                            <CardDescription>Top selling products and inventory insights</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.length > 0 ? (
                                    topProducts.map((product, index) => (
                                        <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <Badge variant="outline">#{index + 1}</Badge>
                                                <div className="flex items-center gap-3">
                                                    {product.image?.imageUrl && (
                                                        <img
                                                            src={product.image.imageUrl || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${product.price.toLocaleString()}</p>
                                                <div className="flex items-center text-sm">
                                                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                                                    <span className="text-green-600">+12%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No product data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="customers" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Segments</CardTitle>
                                <CardDescription>Breakdown of customer types</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {customerSegments.map((segment) => (
                                        <div key={segment.segment} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{segment.segment}</p>
                                                <p className="text-sm text-muted-foreground">{segment.count} customers</p>
                                            </div>
                                            <Badge variant="outline">{segment.percentage}%</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Growth</CardTitle>
                                <CardDescription>New vs returning customers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">New Customers</span>
                                        <span className="text-2xl font-bold text-green-600">+{customerSegments[0].count}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Returning Rate</span>
                                        <span className="text-2xl font-bold text-blue-600">68%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Avg. Order Value</span>
                                        <span className="text-2xl font-bold">$85.50</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
