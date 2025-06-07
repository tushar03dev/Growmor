import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import axios from "axios"
import { toast } from "../components/ui/use-toast"

export const useCart = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!session) return { items: [] }
      const { data } = await axios.get("/api/cart")
      return data
    },
    enabled: !!session,
  })

  const addToCart = useMutation({
    mutationFn: async ({ plantId, quantity }: { plantId: string; quantity: number }) => {
      const { data } = await axios.post("/api/cart", { plantId, quantity })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart",
      })
    },
  })

  const updateCartItem = useMutation({
    mutationFn: async ({ plantId, quantity }: { plantId: string; quantity: number }) => {
      const { data } = await axios.put(`/api/cart/${plantId}`, { quantity })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const removeFromCart = useMutation({
    mutationFn: async (plantId: string) => {
      const { data } = await axios.delete(`/api/cart/${plantId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      })
    },
  })

  return {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
  }
}
