"use client";

import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {useAuth} from "@/components/auth-provider"; // Adjust import path accordingly

export type PlantImage = {
    imageUrl?: string;
    key?: string;
    contentType?: string;
    imageName?: string;
    size?: number;
};

export type Plant = {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: PlantImage;
    categoryId: string; // could also be { _id: string; name: string } if you populate
    discountPercentage?: number;
    sale?: boolean;
    salePrice?: number;
    featured?: boolean;
    isTrending?: boolean;
    isBestSeller?: boolean;
    createdAt: string;
    cartItems?: string[];   // ObjectIds (or CartItem[])
    orderItems?: string[];  // ObjectIds (or OrderItem[])
    reviews?: string[];     // ObjectIds (or Review[])
    viewLogs?: string[];    // ObjectIds (or ViewLog[])
};


export type CartItem = {
    id: string;      // cart item id
    quantity: number;
    plant: Plant;    // full plant details
};

type CartContextType = {
    items: CartItem[];
    setItems: (carts: CartItem[]) => void;
    addItem: (id: string, quantity: number) => Promise<boolean>;
    removeItem: (id: string) => Promise<boolean>;
    updateQuantity: (id: string, quantity: number) => Promise<boolean>;
    clearCart: () => Promise<boolean>;
    totalItems: number;
    totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function CartProvider({children}: { children: ReactNode }) {
    const {user} = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);


    const addItem = async (id: string, quantity: number) => {
        try {

            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found");
                return false;
            }

            const response = await axios.post(
                `${API_URL}/cart`,
                {plantId: id, quantity},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


            setItems(response.data.items ?? []);

            toast({
                title: "Added to cart",
                description: `${response.data.plantId.name} added to your cart`,
            });

            return true;


        } catch (error) {
            console.error("Failed to add item to cart:", error);
            toast({title: "Error", description: "Failed to add item to cart"});
            return false;
        }
    };

    const removeItem = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found");
                return false;
            }

            const response = await axios.delete(`${API_URL}/cart/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setItems(response.data);
            toast({title: "Removed from cart", description: "Item removed from cart"});
            return true;
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            toast({title: "Error", description: "Failed to remove item from cart"});
            return false;
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return false;
        try {

            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found");
                return false;
            }

            const response = await axios.put(`${API_URL}/cart/${id}`, {quantity}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setItems(response.data);
            return true;
        } catch (error) {
            console.error("Failed to update cart item quantity:", error);
            toast({title: "Error", description: "Failed to update cart item quantity"});
            return false;
        }
    };

    const clearCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found");
                return false;
            }
            const response = await axios.delete(`${API_URL}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems([]);
            toast({
                title: "Cart cleared",
                description: "All items have been removed from your cart",
            });
            return true;
        } catch (error) {
            console.error("Failed to clear cart:", error);
            toast({title: "Error", description: "Failed to clear cart"});
            return false;
        }
    };

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + item.plant.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                setItems,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
