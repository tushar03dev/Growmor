"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { createAddress, updateAddress, type Address, type CreateAddressRequest } from "@/lib/api/address"

interface AddressFormProps {
    address?: Address
    onSuccess: (address: Address) => void
    onCancel: () => void
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState<CreateAddressRequest>({
        firstName: address?.firstName || "",
        lastName: address?.lastName || "",
        phone: address?.phone || "",
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        pincode: address?.pincode || "",
        country: address?.country || "India",
        isDefault: address?.isDefault || false,
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleInputChange = (field: keyof CreateAddressRequest, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let savedAddress: Address | null = null;

            if (address?._id) {
                savedAddress = await updateAddress(address._id, formData);
                if (!savedAddress) throw new Error("Update returned null");

                toast({
                    title: "Address updated",
                    description: "Your address has been updated successfully.",
                });
            } else {
                savedAddress = await createAddress(formData);
                if (!savedAddress) throw new Error("Create returned null");

                toast({
                    title: "Address added",
                    description: "Your address has been added successfully.",
                });
            }

            onSuccess(savedAddress);
        } catch (error) {
            console.error("Failed to save address:", error);
            toast({
                title: "Error",
                description: "Failed to save address. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    required
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => handleInputChange("isDefault", checked as boolean)}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : address ? "Update Address" : "Add Address"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
