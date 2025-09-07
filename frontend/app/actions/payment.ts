"use server"

import { createRazorpayOrder, verifyPayment, createOrder } from "@/lib/api/payment"

export async function getRazorpayConfig() {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    if (!keyId) {
        throw new Error("Razorpay configuration missing")
    }

    return {
        keyId,
        name: "GrowMor Plants",
        theme: {
            color: "#22c55e",
        },
    }
}

export async function createPaymentOrder(orderData: {
    amount: number
    currency: string
    receipt: string
    notes: Record<string, string>
}) {
    try {
        const razorpayOrder = await createRazorpayOrder(orderData)
        return { success: true, order: razorpayOrder }
    } catch (error) {
        console.error("Failed to create payment order:", error)
        return { success: false, error: "Failed to create payment order" }
    }
}

export async function verifyPaymentAction(paymentData: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}) {
    try {
        await verifyPayment(paymentData)
        return { success: true }
    } catch (error) {
        console.error("Payment verification failed:", error)
        return { success: false, error: "Payment verification failed" }
    }
}

export async function createOrderAction(orderData: {
    userId: string
    addressId: string
    orderItems: Array<{
        plantId: string
        quantity: number
        price: number
    }>
    paymentId: string
}) {
    try {
        const order = await createOrder(orderData)
        return { success: true, order }
    } catch (error) {
        console.error("Failed to create order:", error)
        return { success: false, error: "Failed to create order" }
    }
}
