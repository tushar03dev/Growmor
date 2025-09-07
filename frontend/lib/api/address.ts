import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface Address {
    _id?: string
    userId?: string
    firstName: string
    lastName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country: string
    isDefault?: boolean
    createdAt?: string
    updatedAt?: string
}

export interface CreateAddressRequest {
    firstName: string
    lastName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country: string
    isDefault?: boolean
}

export const getUserAddresses = async (): Promise<Address[]> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.get(`${API_URL}/addresses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.data
}

export const createAddress = async (addressData: CreateAddressRequest): Promise<Address> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.post(`${API_URL}/addresses`, addressData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    return response.data
}

export const updateAddress = async (
    addressId: string,
    addressData: Partial<CreateAddressRequest>,
): Promise<Address> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.put(`${API_URL}/addresses/${addressId}`, addressData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    return response.data
}

export const deleteAddress = async (addressId: string): Promise<void> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    await axios.delete(`${API_URL}/addresses/${addressId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const setDefaultAddress = async (addressId: string): Promise<Address> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.patch(
        `${API_URL}/addresses/${addressId}/default`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}
