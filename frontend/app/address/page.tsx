"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AddressList } from "@/components/address-list"

export default function AddressesPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()

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

    return (
        <div className="container py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Manage Addresses</h1>
                <AddressList />
            </div>
        </div>
    )
}
