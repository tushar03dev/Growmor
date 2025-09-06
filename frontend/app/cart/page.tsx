"use client"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import {useEffect} from "react";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";

export default function CartPage() {
  const { setItems, items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()
  const { user } = useAuth()
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) {
      setItems([]);
      return; // no user or no token, no cart fetch
    }

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return false;
        }
        const response = await axios.get(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setItems(response.data.items ?? []);
        return true;
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast({title: "Error", description: "Failed to load cart from server"});
        return true;
      }
    };

    fetchCart();
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some plants to get started!</p>
          <Link href="/plants">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.plant.image?.imageUrl  || "/placeholder.svg"}
                  alt={item.plant.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-medium">{item.plant.name}</h3>
                <p className="text-primary font-semibold">${item.plant.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-right">
                <p className="font-semibold">${(item.plant.price * item.quantity).toFixed(2)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{totalPrice >= 50 ? "Free" : "$9.99"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice >= 50 ? 0 : 9.99) + totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Login to Checkout
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  New customer?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <Link href="/plants">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
