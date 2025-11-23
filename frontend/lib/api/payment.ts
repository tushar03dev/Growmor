import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

// -------------------- Types --------------------
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

// -------------------- API Calls --------------------
export const createRazorpayOrder = async (
    orderData: CreateOrderRequest
): Promise<RazorpayOrderResponse> => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Authentication token not found")

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
    if (!token) throw new Error("Authentication token not found")

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
    if (!token) throw new Error("Authentication token not found")

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
    if (!token) throw new Error("Authentication token not found")

    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.data
}

export const getUserOrders = async () => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Authentication token not found")

    const response = await axios.get(`${API_URL}/orders/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.data
}

// -------------------- Razorpay Checkout --------------------
declare global {
    interface Window {
        Razorpay: any
    }
}

export const openRazorpayCheckout = (
    order: RazorpayOrderResponse,
    onSuccess: (response: PaymentVerificationRequest) => void
) => {
    if (!RAZORPAY_KEY_ID) {
        throw new Error("Razorpay Key ID is missing. Did you set NEXT_PUBLIC_RAZORPAY_KEY_ID?")
    }

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "My Store",
        description: "Order Payment",
        order_id: order.id,
        handler: function (response: any) {
            // send payment data to backend for verification
            onSuccess({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            })
        },
        prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9876543210",
        },
        theme: {
            color: "#3399cc",
        },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
}

// -------------------- Payment Flow --------------------
export const startPaymentFlow = async (orderData: CreateOrderRequest) => {
    try {
        // Step 1: create order on backend
        const order = await createRazorpayOrder(orderData)

        // Step 2: open Razorpay checkout
        openRazorpayCheckout(order, async (paymentResponse) => {
            // Step 3: verify payment with backend
            const verification = await verifyPayment(paymentResponse)
            console.log("Verification Result:", verification)
        })
    } catch (error) {
        console.error("Payment Error:", error)
    }
}
