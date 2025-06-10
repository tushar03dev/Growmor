"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProductCard, type Product } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { dummyProducts } from "@/lib/dummy-data"

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  limit?: number
  showMoreLink?: boolean
  mode?: "featured" | "sale"
}

export function FeaturedProducts({
                                   title = "Featured Plants",
                                   subtitle = "Our selection of premium plants for your home and garden",
                                   limit = 4,
                                   showMoreLink = true,
                                   mode = "featured",
                                 }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let filteredProducts = dummyProducts

    if (mode === "featured") {
      filteredProducts = dummyProducts.filter(p => p.featured)
    } else if (mode === "sale") {
      filteredProducts = dummyProducts.filter(p => p.sale)
    }

    setProducts(filteredProducts.slice(0, limit))
  }, [mode, limit])

  return (
      <section className="py-12">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {showMoreLink && (
              <div className="mt-10 text-center">
                <Link href="/plants">
                  <Button variant="outline" size="lg">
                    View All Plants
                  </Button>
                </Link>
              </div>
          )}
        </div>
      </section>
  )
}
