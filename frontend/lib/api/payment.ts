import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface RazorpayOrderResponse {
    id: string
    amount: number
    currency: string
    receipt: string
    status: string
}

export interface PaymentVerificationRequest {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

export interface CreateOrderRequest {
    amount: number
    currency?: string
    receipt?: string
    notes?: Record<string, string>
}

export interface OrderCreationRequest {
    userId: string
    addressId: string
    orderItems: {
        plantId: string
        quantity: number
        price: number
    }[]
    paymentId: string
}

export const createRazorpayOrder = async (orderData: CreateOrderRequest): Promise<RazorpayOrderResponse> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.post(`${API_URL}/payments/create-order`, orderData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    return response.data
}

export const verifyPayment = async (verificationData: PaymentVerificationRequest) => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.post(`${API_URL}/payments/verify`, verificationData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    return response.data
}

export const createOrder = async (orderData: OrderCreationRequest) => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.post(`${API_URL}/orders/create`, orderData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    return response.data
}

export const getOrderById = async (orderId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.data
}

export const getUserOrders = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.get(`${API_URL}/orders/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.data
}
