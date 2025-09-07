"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { OrderConfirmation } from "@/components/order-confirmation"

export default function OrderConfirmationPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    useEffect(() => {
        if (!orderId) {
            router.push("/orders")
        }
    }, [orderId, router])

    if (isLoading) {
        return <div className="container py-8 text-center">Loading...</div>
    }

    if (!user || !orderId) {
        return null
    }

    return <OrderConfirmation orderId={orderId} />
}
