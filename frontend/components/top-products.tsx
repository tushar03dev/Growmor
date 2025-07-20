"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const topProducts = [
    {
        id: "1",
        name: "Monstera Deliciosa",
        sales: 89,
        revenue: "$2,670",
        image: "/placeholder.svg?height=40&width=40",
        trend: "up",
    },
    {
        id: "2",
        name: "Snake Plant",
        sales: 67,
        revenue: "$2,010",
        image: "/placeholder.svg?height=40&width=40",
        trend: "up",
    },
    {
        id: "3",
        name: "Fiddle Leaf Fig",
        sales: 45,
        revenue: "$1,800",
        image: "/placeholder.svg?height=40&width=40",
        trend: "down",
    },
    {
        id: "4",
        name: "Peace Lily",
        sales: 38,
        revenue: "$1,140",
        image: "/placeholder.svg?height=40&width=40",
        trend: "up",
    },
    {
        id: "5",
        name: "Rubber Plant",
        sales: 32,
        revenue: "$960",
        image: "/placeholder.svg?height=40&width=40",
        trend: "up",
    },
]

export function TopProducts() {
    return (
        <div className="space-y-4">
            {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {product.sales} sales • {product.revenue}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Badge variant={product.trend === "up" ? "default" : "secondary"}>#{index + 1}</Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
