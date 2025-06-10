"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"

interface PaymentFormProps {
  onSuccess?: () => void
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { clearCart, totalPrice } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate successful payment
    toast({
      title: "Payment successful!",
      description: "Your order has been placed successfully.",
      variant: "default",
    })

    clearCart()
    setIsProcessing(false)

    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/order-confirmation")
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }
    setExpiryDate(value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="card" id="card" className="peer sr-only" />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Credit Card</span>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.5 6.5C19.5 10.5 16.5 12 13.5 12H11.5L10.5 18H7L9.5 4H14.5C17.5 4 19.5 4.5 19.5 6.5Z"
                  fill="#002C8A"
                />
                <path
                  d="M22.5 9.5C22.5 13.5 19.5 15 16.5 15H14.5L13.5 21H10L12.5 7H17.5C20.5 7 22.5 7.5 22.5 9.5Z"
                  fill="#009BE1"
                />
              </svg>
              <span className="text-sm font-medium">PayPal</span>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
            <Label
              htmlFor="apple"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.5 12.5C17.5 9.5 19.5 8 19.5 8C19.5 8 18 6.5 16 6.5C14 6.5 13 8 11.5 8C10 8 8.5 6.5 7 6.5C5.5 6.5 3.5 8 3.5 11.5C3.5 15 6.5 19 8 19C9.5 19 10 18 11.5 18C13 18 13.5 19 15 19C16.5 19 19.5 15.5 19.5 12.5Z"
                  fill="currentColor"
                />
                <path
                  d="M15 3.5C14 4.5 13.5 6 13.5 7C14.5 7 15.5 6.5 16.5 5.5C17.5 4.5 17.5 3 17.5 3C16.5 3 15.5 3 15 3.5Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm font-medium">Apple Pay</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "card" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" /> Pay ${totalPrice.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  )
}
