"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { OrderHistory } from "@/components/order-history"
import { OrderConfirmation } from "@/components/order-confirmation"

export default function OrdersPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return <div className="container py-8 text-center">Loading...</div>
    }

    if (!user) {
        return null
    }

    const handleViewOrder = (orderId: string) => {
        setSelectedOrderId(orderId)
    }

    const handleBackToOrders = () => {
        setSelectedOrderId(null)
    }

    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                {selectedOrderId ? (
                    <div>
                        <button
                            onClick={handleBackToOrders}
                            className="mb-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                        >
                            ← Back to Orders
                        </button>
                        <OrderConfirmation orderId={selectedOrderId} />
                    </div>
                ) : (
                    <div>
                        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                        <OrderHistory onViewOrder={handleViewOrder} />
                    </div>
                )}
            </div>
        </div>
    )
}
