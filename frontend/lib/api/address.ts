import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface Address {
    _id?: string
    userId?: string
    firstName: string
    lastName: string
    phone: string
    street: string
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
    street: string
    city: string
    state: string
    pincode: string
    country: string
    isDefault?: boolean
    createdAt?: string
    updatedAt?: string
}

export const getUserAddresses = async (): Promise<Address[] | null> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.get(`${API_URL}/address`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.status === 200) {
        return response.data.addresses
    } else {
        throw new Error("Error creating address")
    }
}

export const createAddress = async (addressData: CreateAddressRequest): Promise<Address| null> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.post(`${API_URL}/address`, addressData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    if(response.status === 201) {
        return response.data;
    } else{
        throw new Error("Could not create address")
    }
}

export const updateAddress = async (
    addressId: string,
    addressData: Partial<CreateAddressRequest>,
): Promise<Address> => {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication token not found")
    }

    const response = await axios.put(`${API_URL}/address/${addressId}`, addressData, {
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

    await axios.delete(`${API_URL}/address/${addressId}`, {
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
        `${API_URL}/address/${addressId}/default`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}
