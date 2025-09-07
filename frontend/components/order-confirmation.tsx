"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, MapPin, Calendar } from "lucide-react"
import { getOrderById } from "@/lib/api/payment"
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

interface OrderConfirmationProps {
    orderId: string
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadOrderDetails()
    }, [orderId])

    const loadOrderDetails = async () => {
        try {
            const orderData = await getOrderById(orderId)
            setOrder(orderData)
        } catch (error) {
            console.error("Failed to load order details:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-muted-foreground">Order not found</p>
                </div>
            </div>
        )
    }

    const totalAmount = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="container py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Success Header */}
                <Card>
                    <CardContent className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                        <p className="text-muted-foreground mb-4">
                            Thank you for your purchase. Your order has been successfully placed.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                <span>Order #{order._id.slice(-8)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Order Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                {order.status === "pending" && "Your order is being processed"}
                                {order.status === "confirmed" && "Order confirmed and being prepared"}
                                {order.status === "shipped" && "Order has been shipped"}
                                {order.status === "delivered" && "Order has been delivered"}
              </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.orderItems.map((item) => (
                            <div key={item._id} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                    {item.plantId.image?.imageUrl ? (
                                        <img
                                            src={item.plantId.image.imageUrl || "/placeholder.svg"}
                                            alt={item.plantId.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <Package className="w-6 h-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.plantId.name}</h4>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                                </div>
                            </div>
                        ))}

                        <Separator />

                        <div className="flex justify-between items-center font-semibold">
                            <span>Total Amount</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Delivery Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <p className="font-medium">
                                {order.address.firstName} {order.address.lastName}
                            </p>
                            <p>{order.address.addressLine1}</p>
                            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                            <p>
                                {order.address.city}, {order.address.state} {order.address.pincode}
                            </p>
                            <p>{order.address.country}</p>
                            <p className="text-sm text-muted-foreground">Phone: {order.address.phone}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button onClick={() => window.print()} variant="outline" className="flex-1">
                        Print Receipt
                    </Button>
                    <Button onClick={() => (window.location.href = "/orders")} className="flex-1">
                        View All Orders
                    </Button>
                </div>
            </div>
        </div>
    )
}
