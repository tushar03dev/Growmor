"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Smartphone, Check, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { createRazorpayOrder, verifyPayment, createOrder } from "@/lib/api/payment"
import { initiateRazorpayPayment, type RazorpayOptions } from "@/lib/razorpay"
import type { Address } from "@/lib/api/address"

interface UpiPaymentFormProps {
    selectedAddress: Address
    onSuccess?: () => void
}

export function UpiPaymentForm({ selectedAddress, onSuccess }: UpiPaymentFormProps) {
    const [paymentMethod, setPaymentMethod] = useState("upi")
    const [upiId, setUpiId] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const { items, clearCart, totalPrice } = useCart()
    const { user } = useAuth()
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user || !selectedAddress) {
            toast({
                title: "Error",
                description: "Please select an address and ensure you're logged in.",
                variant: "destructive",
            })
            return
        }

        setIsProcessing(true)

        try {
            // Create Razorpay order
            const orderData = {
                amount: Math.round(totalPrice * 100), // Convert to paise
                currency: "INR",
                receipt: `order_${Date.now()}`,
                notes: {
                    userId: user.id || "",
                    addressId: selectedAddress._id || "",
                },
            }

            const razorpayOrder = await createRazorpayOrder(orderData)

            // Configure Razorpay options for UPI-only payment
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "GrowMor Plants",
                description: "Plant Order Payment",
                order_id: razorpayOrder.id,
                handler: async (response: any) => {
                    try {
                        // Verify payment
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })

                        // Create order in database
                        const orderItems = items.map((item) => ({
                            plantId: item.plant._id,
                            quantity: item.quantity,
                            price: item.plant.price,
                        }))

                        await createOrder({
                            userId: user.id || "",
                            addressId: selectedAddress._id || "",
                            orderItems,
                            paymentId: response.razorpay_payment_id,
                        })

                        toast({
                            title: "Payment successful!",
                            description: "Your order has been placed successfully.",
                        })

                        clearCart()

                        if (onSuccess) {
                            onSuccess()
                        } else {
                            router.push("/order-confirmation")
                        }
                    } catch (error) {
                        console.error("Payment verification failed:", error)
                        toast({
                            title: "Payment verification failed",
                            description: "Please contact support if amount was deducted.",
                            variant: "destructive",
                        })
                    } finally {
                        setIsProcessing(false)
                    }
                },
                prefill: {
                    name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
                    email: user.email || "",
                    contact: selectedAddress.phone,
                },
                notes: {
                    address: selectedAddress.addressLine1,
                    city: selectedAddress.city,
                },
                theme: {
                    color: "#22c55e",
                },
                method: {
                    upi: true,
                    card: false,
                    netbanking: false,
                    wallet: false,
                },
            }

            // Launch Razorpay payment
            await initiateRazorpayPayment(options)
        } catch (error) {
            console.error("Payment initiation failed:", error)
            toast({
                title: "Payment failed",
                description: "Failed to initiate payment. Please try again.",
                variant: "destructive",
            })
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choose Payment Method</h3>
                <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                        <Label
                            htmlFor="upi"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <Smartphone className="mb-3 h-6 w-6 text-green-600" />
                            <span className="text-sm font-medium">UPI Payment</span>
                            <span className="text-xs text-muted-foreground mt-1">Pay using any UPI app</span>
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem value="upi-collect" id="upi-collect" className="peer sr-only" />
                        <Label
                            htmlFor="upi-collect"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <Wallet className="mb-3 h-6 w-6 text-blue-600" />
                            <span className="text-sm font-medium">UPI ID</span>
                            <span className="text-xs text-muted-foreground mt-1">Enter your UPI ID</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {paymentMethod === "upi-collect" && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input
                            id="upi-id"
                            placeholder="yourname@paytm / yourname@gpay"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g., 9876543210@paytm, username@gpay)</p>
                    </div>
                </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Supported UPI Apps:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Google Pay
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        PhonePe
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Paytm
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        BHIM
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Secure payment powered by Razorpay</p>
            </div>

            <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                    <>Processing...</>
                ) : (
                    <>
                        <Check className="mr-2 h-4 w-4" /> Pay ₹{totalPrice.toFixed(2)}
                    </>
                )}
            </Button>

            <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p>💳 No card details required for UPI payments</p>
            </div>
        </form>
    )
}
