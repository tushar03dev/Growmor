"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalyticsChart } from "@/components/analytics-chart"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("monthly")

    const metrics = {
        today: {
            orders: 23,
            revenue: 1250.5,
            customers: 18,
            products: 45,
        },
        weekly: {
            orders: 156,
            revenue: 8750.25,
            customers: 89,
            products: 234,
        },
        monthly: {
            orders: 678,
            revenue: 35420.75,
            customers: 345,
            products: 1023,
        },
        quarterly: {
            orders: 2034,
            revenue: 106262.25,
            customers: 1034,
            products: 3069,
        },
        yearly: {
            orders: 8136,
            revenue: 425049.0,
            customers: 4136,
            products: 12276,
        },
    }

    const currentMetrics = metrics[timeRange as keyof typeof metrics]

    const topProducts = [
        { name: "Monstera Deliciosa", sales: 234, revenue: 7020, trend: "up" },
        { name: "Snake Plant", sales: 189, revenue: 5670, trend: "up" },
        { name: "Fiddle Leaf Fig", sales: 156, revenue: 6240, trend: "down" },
        { name: "Peace Lily", sales: 134, revenue: 3350, trend: "up" },
        { name: "Rubber Plant", sales: 98, revenue: 2940, trend: "up" },
    ]

    const customerSegments = [
        { segment: "New Customers", count: 145, percentage: 35 },
        { segment: "Returning Customers", count: 200, percentage: 48 },
        { segment: "VIP Customers", count: 70, percentage: 17 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">Detailed insights into your store performance</p>
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
                                <div className="text-2xl font-bold">{currentMetrics.orders.toLocaleString()}</div>
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
                                <div className="text-2xl font-bold">${currentMetrics.revenue.toLocaleString()}</div>
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
                                <div className="text-2xl font-bold">{currentMetrics.customers.toLocaleString()}</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +15.3% from last period
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentMetrics.products.toLocaleString()}</div>
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
                                <AnalyticsChart />
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Products</CardTitle>
                                <CardDescription>Best performing products</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={product.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline">#{index + 1}</Badge>
                                                <div>
                                                    <p className="text-sm font-medium">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {product.sales} sales • ${product.revenue}
                                                    </p>
                                                </div>
                                            </div>
                                            {product.trend === "up" ? (
                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                    ))}
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
                            <AnalyticsChart />
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
                                {topProducts.map((product, index) => (
                                    <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <Badge variant="outline">#{index + 1}</Badge>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${product.revenue.toLocaleString()}</p>
                                            <div className="flex items-center text-sm">
                                                {product.trend === "up" ? (
                                                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                                                )}
                                                <span className={product.trend === "up" ? "text-green-600" : "text-red-600"}>
                          {product.trend === "up" ? "+12%" : "-5%"}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                        <span className="text-2xl font-bold text-green-600">+145</span>
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
