"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getTopProducts, type Plant } from "@/lib/api/admin"
import { Loader2 } from "lucide-react"

export function TopProducts() {
    const [products, setProducts] = useState<Plant[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const topProducts = await getTopProducts(5)
                setProducts(topProducts)
            } catch (error) {
                console.error("Failed to fetch top products:", error)
                setProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchTopProducts()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        )
    }

    if (products.length === 0) {
        return <p className="text-sm text-muted-foreground">No product data available</p>
    }

    return (
        <div className="space-y-4">
            {products.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                            <img
                                src={product.image?.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Stock: {product.stock} • ${product.price}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Badge variant="default">#{index + 1}</Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
