"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, MapPin, Plus } from "lucide-react"
import { AddressForm } from "./address-form"
import { getUserAddresses, deleteAddress, setDefaultAddress, type Address } from "@/lib/api/address"

interface AddressListProps {
    onSelectAddress?: (address: Address) => void
    selectedAddressId?: string
    showSelection?: boolean
}

export function AddressList({ onSelectAddress, selectedAddressId, showSelection = false }: AddressListProps) {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | undefined>()
    const { toast } = useToast()

    useEffect(() => {
        loadAddresses()
    }, [])

    const loadAddresses = async () => {
        try {
            const data = await getUserAddresses()
            setAddresses(data ?? [])   // make sure it’s always an array
        } catch (error) {
            console.error("Failed to load addresses:", error)
            toast({
                title: "Error",
                description: "Failed to load addresses.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return

        try {
            await deleteAddress(addressId)
            setAddresses((prev) => prev.filter((addr) => addr._id !== addressId))
            toast({
                title: "Address deleted",
                description: "Address has been deleted successfully.",
            })
        } catch (error) {
            console.error("Failed to delete address:", error)
            toast({
                title: "Error",
                description: "Failed to delete address.",
                variant: "destructive",
            })
        }
    }

    const handleSetDefault = async (addressId: string) => {
        try {
            await setDefaultAddress(addressId)
            setAddresses((prev) =>
                prev.map((addr) => ({
                    ...addr,
                    isDefault: addr._id === addressId,
                })),
            )
            toast({
                title: "Default address updated",
                description: "Default address has been updated successfully.",
            })
        } catch (error) {
            console.error("Failed to set default address:", error)
            toast({
                title: "Error",
                description: "Failed to set default address.",
                variant: "destructive",
            })
        }
    }

    const handleFormSuccess = (address: Address) => {
        if (editingAddress) {
            setAddresses((prev) => prev.map((addr) => (addr._id === address._id ? address : addr)))
        } else {
            setAddresses((prev) => [...prev, address])
        }
        setShowForm(false)
        setEditingAddress(undefined)
    }

    const handleFormCancel = () => {
        setShowForm(false)
        setEditingAddress(undefined)
    }

    if (isLoading) {
        return <div className="text-center py-8">Loading addresses...</div>
    }

    if (showForm) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                </div>
                <AddressForm address={editingAddress} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Saved Addresses</h3>
                <Button onClick={() => setShowForm(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                        <Button onClick={() => setShowForm(true)}>Add Your First Address</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <Card
                            key={address._id}
                            className={`cursor-pointer transition-colors ${
                                showSelection && selectedAddressId === address._id ? "ring-2 ring-primary" : "hover:bg-muted/50"
                            }`}
                            onClick={() => showSelection && onSelectAddress?.(address)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                        {address.firstName} {address.lastName}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        {address.isDefault && <Badge variant="secondary">Default</Badge>}
                                        {!showSelection && (
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    title="Edit Address"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditingAddress(address)
                                                        setShowForm(true)
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    title="Delete Address"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteAddress(address._id!)
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>{address.street}</p>
                                    <p>
                                        {address.city}, {address.state} {address.pincode}
                                    </p>
                                    <p>{address.country}</p>
                                    <p>Phone: {address.phone}</p>
                                </div>
                                {!showSelection && !address.isDefault && (
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-transparent"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleSetDefault(address._id!)
                                            }}
                                        >
                                            Set as Default
                                        </Button>
                                    </div>
                                )}
                                {!showSelection && (
                                    <div className="mt-3 flex gap-2 md:hidden">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setEditingAddress(address)
                                                setShowForm(true)
                                            }}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteAddress(address._id!)
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
