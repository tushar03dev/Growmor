const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AdminStats {
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    totalUsers: number
    pendingOrders: number
    lowStockItems: number
    completedOrders: number
    publishedPosts: number
}

export interface Order {
    _id: string
    userId: {
        _id: string
        name: string
        email: string
    }
    paymentId: string
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    createdAt: string
    address: {
        _id: string
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    orderItems: OrderItem[]
    totalAmount: number
}

export interface OrderItem {
    _id: string
    plantId: {
        _id: string
        name: string
        price: number
        image: {
            imageUrl: string
        }
    }
    quantity: number
    price: number
}

export interface Review {
    _id: string
    userId: {
        _id: string
        name: string
        email: string
    }
    plantId: {
        _id: string
        name: string
        image: {
            imageUrl: string
        }
    }
    rating: number
    comment: string
    createdAt: string
}

export interface Plant {
    _id: string
    name: string
    description: string
    price: number
    stock: number
    image: {
        imageUrl: string
        imageName: string
    }
    categoryId: {
        _id: string
        name: string
    }
    discountPercentage: number
    sale: boolean
    salePrice?: number
    featured: boolean
    isTrending: boolean
    isBestSeller: boolean
    createdAt: string
}

// Safe API call wrapper
async function safeApiCall<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await apiCall()
    } catch (error) {
        console.error("API call failed:", error)
        return fallback
    }
}

// Get admin token from localStorage
function getAdminToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("adminToken")
    }
    return null
}

// Create axios config with admin token
function getAuthConfig() {
    const token = getAdminToken()
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    }
}

// Dashboard Stats
export async function getAdminStats(): Promise<AdminStats> {
    return safeApiCall(
        async () => {
            const response = await fetch(`${API_BASE_URL}/admin/stats`, getAuthConfig())
            //if (!response.ok) throw new Error("Failed to fetch stats")
            return response.json()
        },
        {
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalUsers: 0,
            pendingOrders: 0,
            lowStockItems: 0,
            completedOrders: 0,
            publishedPosts: 0,
        },
    )
}

// Orders Management
export async function getAllOrders(page = 1, limit = 10, status?: string): Promise<{ orders: Order[]; total: number }> {
    return safeApiCall(
        async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(status && { status }),
            })
            const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, getAuthConfig())
            if (!response.ok) throw new Error("Failed to fetch orders")
            return response.json()
        },
        { orders: [], total: 0 },
    )
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
    return safeApiCall(async () => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
            method: "PUT",
            ...getAuthConfig(),
            body: JSON.stringify({ status }),
        })
        if (!response.ok) throw new Error("Failed to update order status")
        return response.json()
    }, null)
}

// Reviews Management
export async function getAllReviews(page = 1, limit = 10): Promise<{ reviews: Review[]; total: number }> {
    return safeApiCall(
        async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            })
            const response = await fetch(`${API_BASE_URL}/admin/reviews?${params}`, getAuthConfig())
            if (!response.ok) throw new Error("Failed to fetch reviews")
            return response.json()
        },
        { reviews: [], total: 0 },
    )
}

export async function deleteReview(reviewId: string): Promise<boolean> {
    return safeApiCall(async () => {
        const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
            method: "DELETE",
            ...getAuthConfig(),
        })
        return response.ok
    }, false)
}

// Analytics Data
export async function getAnalyticsData(period = "12months"): Promise<any[]> {
    return safeApiCall(async () => {
        const response = await fetch(`${API_BASE_URL}/admin/analytics?period=${period}`, getAuthConfig())
        if (!response.ok) throw new Error("Failed to fetch analytics")
        return response.json()
    }, [])
}

// Inventory Management
export async function getLowStockProducts(): Promise<Plant[]> {
    return safeApiCall(async () => {
        const response = await fetch(`${API_BASE_URL}/admin/inventory/low-stock`, getAuthConfig())
        if (!response.ok) throw new Error("Failed to fetch low stock products")
        return response.json()
    }, [])
}

export async function updateProductStock(productId: string, stock: number): Promise<Plant | null> {
    return safeApiCall(async () => {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/stock`, {
            method: "PUT",
            ...getAuthConfig(),
            body: JSON.stringify({ stock }),
        })
        if (!response.ok) throw new Error("Failed to update stock")
        return response.json()
    }, null)
}

// Top Products
export async function getTopProducts(limit = 5): Promise<Plant[]> {
    return safeApiCall(async () => {
        const response = await fetch(`${API_BASE_URL}/admin/products/top?limit=${limit}`, getAuthConfig())
        if (!response.ok) throw new Error("Failed to fetch top products")
        return response.json()
    }, [])
}

// Recent Orders for Dashboard
export async function getRecentOrders(limit = 5): Promise<Order[]> {
    return safeApiCall(async () => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/recent?limit=${limit}`, getAuthConfig())
        if (!response.ok) throw new Error("Failed to fetch recent orders")
        return response.json()
    }, [])
}
