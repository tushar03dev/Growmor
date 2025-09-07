"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Search, Calendar, MapPin, Eye } from "lucide-react"
import { getUserOrders } from "@/lib/api/payment"
import type { Address } from "@/lib/api/address"

interface OrderItem {
    _id: string
    plantId: {
        _id: string
        name: string
        price: number
        image?: {
            imageUrl: string
        }
    }
    quantity: number
    price: number
}

interface Order {
    _id: string
    userId: string
    paymentId: string
    status: string
    createdAt: string
    address: Address
    orderItems: OrderItem[]
    totalAmount?: number
}

interface OrderHistoryProps {
    onViewOrder?: (orderId: string) => void
}

export function OrderHistory({ onViewOrder }: OrderHistoryProps) {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadOrders()
    }, [])

    useEffect(() => {
        filterOrders()
    }, [orders, searchTerm])

    const loadOrders = async () => {
        try {
            const orderData = await getUserOrders()
            setOrders(orderData)
        } catch (error) {
            console.error("Failed to load orders:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const filterOrders = () => {
        if (!searchTerm) {
            setFilteredOrders(orders)
            return
        }

        const filtered = orders.filter(
            (order) =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderItems.some((item) => item.plantId.name.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        setFilteredOrders(filtered)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "confirmed":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            case "delivered":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-muted rounded w-1/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                                <div className="h-3 bg-muted rounded w-1/3"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Button onClick={() => (window.location.href = "/")}>Start Shopping</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search orders by ID or plant name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order) => {
                    const totalAmount = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)

                    return (
                        <Card key={order._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">Order #{order._id.slice(-8)}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Package className="w-4 h-4" />
                                                {totalItems} item{totalItems > 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                        <p className="text-lg font-semibold">₹{totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Order Items Preview */}
                                <div className="space-y-2">
                                    {order.orderItems.slice(0, 2).map((item) => (
                                        <div key={item._id} className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                                {item.plantId.image?.imageUrl ? (
                                                    <img
                                                        src={item.plantId.image.imageUrl || "/placeholder.svg"}
                                                        alt={item.plantId.name}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <span className="flex-1">{item.plantId.name}</span>
                                            <span className="text-muted-foreground">Qty: {item.quantity}</span>
                                        </div>
                                    ))}
                                    {order.orderItems.length > 2 && (
                                        <p className="text-sm text-muted-foreground">
                                            +{order.orderItems.length - 2} more item{order.orderItems.length - 2 > 1 ? "s" : ""}
                                        </p>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p>
                                            {order.address.firstName} {order.address.lastName}
                                        </p>
                                        <p>
                                            {order.address.city}, {order.address.state}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onViewOrder?.(order._id)}
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </Button>
                                    {order.status === "delivered" && (
                                        <Button variant="outline" size="sm">
                                            Reorder
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filteredOrders.length === 0 && searchTerm && (
                <Card>
                    <CardContent className="text-center py-8">
                        <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No orders found matching "{searchTerm}"</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
