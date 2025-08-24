"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard, type Product } from "@/components/product-card";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showMoreLink?: boolean;
  mode?: "featured" | "sale" | "trending";
}

export function FeaturedProducts({
  title = "Featured Plants",
  subtitle = "Our selection of premium plants for your home and garden",
  limit = 4,
  showMoreLink = true,
  mode = "trending", // default to trending
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = "";
        if (mode === "trending") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/plants/trending`;
        } else if (mode === "featured") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/plants/trending`;
        } else if (mode === "sale") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/plants/trending`;
        }

        if (!url) {
          console.error("No API URL found for mode:", mode);
          return;
        }

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await res.json(); // use response directly
        setProducts(data.slice(0, limit));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [mode, limit]);

  return (
    <section className="py-12">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

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
  );
}
