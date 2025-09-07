"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AddressList } from "@/components/address-list"
import { UpiPaymentForm } from "@/components/upi-payment-form"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { ChevronLeft, MapPin, CreditCard } from "lucide-react"
import type { Address } from "@/lib/api/address"

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, totalPrice, totalItems } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"address" | "payment">("address")
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (items.length === 0) {
      router.push("/cart")
      return
    }
  }, [user, items, router])

  if (!user || items.length === 0) {
    return null
  }

  const shippingCost = totalPrice >= 500 ? 0 : 50 // Free shipping above ₹500
  const tax = totalPrice * 0.18 // 18% GST
  const finalTotal = totalPrice + shippingCost + tax

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
  }

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address")
      return
    }
    setCurrentStep("payment")
  }

  const handlePaymentSuccess = () => {
    router.push("/order-confirmation")
  }

  const handleBackToAddress = () => {
    setCurrentStep("address")
  }

  return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {currentStep === "payment" && (
                <Button variant="ghost" size="sm" onClick={handleBackToAddress}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
            )}
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 text-sm">
            <div
                className={`flex items-center gap-2 ${currentStep === "address" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      currentStep === "address"
                          ? "bg-primary text-primary-foreground"
                          : selectedAddress
                              ? "bg-green-500 text-white"
                              : "bg-muted"
                  }`}
              >
                {selectedAddress && currentStep === "payment" ? "✓" : "1"}
              </div>
              <span>Delivery Address</span>
            </div>
            <div className="w-8 h-px bg-muted"></div>
            <div
                className={`flex items-center gap-2 ${currentStep === "payment" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      currentStep === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
              >
                2
              </div>
              <span>Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {currentStep === "address" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Select Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddressList
                        onSelectAddress={handleAddressSelect}
                        selectedAddressId={selectedAddress?._id}
                        showSelection={true}
                    />

                    {selectedAddress && (
                        <div className="mt-6 pt-6 border-t">
                          <Button onClick={handleContinueToPayment} className="w-full">
                            Continue to Payment
                          </Button>
                        </div>
                    )}
                  </CardContent>
                </Card>
            )}

            {currentStep === "payment" && selectedAddress && (
                <div className="space-y-6">
                  {/* Selected Address Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {selectedAddress.firstName} {selectedAddress.lastName}
                        </p>
                        <p>{selectedAddress.street}</p>
                        <p>
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                        </p>
                        <p>{selectedAddress.country}</p>
                        <p className="text-sm text-muted-foreground">Phone: {selectedAddress.phone}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleBackToAddress} className="mt-3 bg-transparent">
                        Change Address
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Payment Method Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PaymentMethodSelector />
                    </CardContent>
                  </Card>

                  {/* UPI Payment Form */}
                  <Card>
                    <CardContent className="pt-6">
                      <UpiPaymentForm selectedAddress={selectedAddress} onSuccess={handlePaymentSuccess} />
                    </CardContent>
                  </Card>
                </div>
            )}
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                            src={item.plant.image?.imageUrl || "/placeholder.svg"}
                            alt={item.plant.name}
                            fill
                            className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.plant.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">₹{(item.plant.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>

              {totalPrice < 500 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Add ₹{(500 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
              )}

              {/* Security Badge */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure checkout powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
