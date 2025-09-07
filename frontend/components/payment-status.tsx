"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { getOrderById } from "@/lib/api/payment"

interface PaymentStatusProps {
    orderId?: string
    paymentId?: string
    onRetry?: () => void
}

type PaymentStatus = "pending" | "success" | "failed" | "processing"

export function PaymentStatus({ orderId, paymentId, onRetry }: PaymentStatusProps) {
    const [status, setStatus] = useState<PaymentStatus>("processing")
    const [orderDetails, setOrderDetails] = useState<any>(null)

    useEffect(() => {
        if (orderId) {
            checkPaymentStatus()
        }
    }, [orderId])

    const checkPaymentStatus = async () => {
        if (!orderId) return

        try {
            const order = await getOrderById(orderId)
            setOrderDetails(order)

            switch (order.status) {
                case "completed":
                case "paid":
                    setStatus("success")
                    break
                case "failed":
                case "cancelled":
                    setStatus("failed")
                    break
                case "pending":
                    setStatus("pending")
                    break
                default:
                    setStatus("processing")
            }
        } catch (error) {
            console.error("Failed to check payment status:", error)
            setStatus("failed")
        }
    }

    const getStatusIcon = () => {
        switch (status) {
            case "success":
                return <CheckCircle className="w-12 h-12 text-green-500" />
            case "failed":
                return <XCircle className="w-12 h-12 text-red-500" />
            case "pending":
                return <Clock className="w-12 h-12 text-yellow-500" />
            default:
                return <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
        }
    }

    const getStatusMessage = () => {
        switch (status) {
            case "success":
                return {
                    title: "Payment Successful!",
                    description: "Your order has been confirmed and will be processed shortly.",
                }
            case "failed":
                return {
                    title: "Payment Failed",
                    description: "There was an issue processing your payment. Please try again.",
                }
            case "pending":
                return {
                    title: "Payment Pending",
                    description: "Your payment is being processed. Please wait a moment.",
                }
            default:
                return {
                    title: "Processing Payment",
                    description: "Please wait while we confirm your payment...",
                }
        }
    }

    const statusMessage = getStatusMessage()

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">{getStatusIcon()}</div>
                <CardTitle>{statusMessage.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">{statusMessage.description}</p>

                {paymentId && (
                    <div className="text-sm text-muted-foreground">
                        <p>Payment ID: {paymentId}</p>
                    </div>
                )}

                {orderDetails && (
                    <div className="text-sm space-y-1">
                        <p>Order ID: {orderDetails._id}</p>
                        <p>Amount: ₹{orderDetails.totalAmount || "N/A"}</p>
                    </div>
                )}

                <div className="flex gap-2 justify-center">
                    {status === "failed" && onRetry && (
                        <Button onClick={onRetry} variant="outline">
                            Try Again
                        </Button>
                    )}

                    {status === "pending" && (
                        <Button onClick={checkPaymentStatus} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Check Status
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
