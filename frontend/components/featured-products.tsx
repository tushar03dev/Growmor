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

// ✅ Dummy fallback products
const dummyProducts: Product[] = [
  {
    _id: "dummy-1",
    name: "Monstera Deliciosa",
    description: "A stylish indoor plant with large, glossy leaves.",
    price: 599,
    discountPercentage: 10,
    image: {
      imageUrl: "/Monstera_Deliciosa.webp",
    },
    categoryId: {
      _id: "c1",
      name: "Indoor Plants",
      description: "Plants suitable for indoor decoration.",
      plants: [],
      __v: 0,
    },
    stock: 20,
    featured: true,
    sale: false,
  },
  {
    _id: "dummy-2",
    name: "Snake Plant",
    description: "Low-maintenance plant perfect for bedrooms and offices.",
    price: 399,
    discountPercentage: 5,
    image: {
      imageUrl: "/Hero_slider2.jpg",
    },
    categoryId: {
      _id: "c2",
      name: "Air Purifying",
      description: "Plants known for purifying indoor air.",
      plants: [],
      __v: 0,
    },
    stock: 15,
    featured: false,
    sale: true,
    salePrice: 349,
  },
  {
    _id: "dummy-3",
    name: "Succulent Mix",
    description: "A collection of hardy succulents for any space.",
    price: 299,
    discountPercentage: 0,
    image: {
      imageUrl: "/niche garage.jpg",
    },
    categoryId: {
      _id: "c3",
      name: "Succulents",
      description: "Small water-retaining plants for minimal care.",
      plants: [],
      __v: 0,
    },
    stock: 25,
    featured: true,
    sale: false,
  },
];

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
    // const fetchProducts = async () => {
    //   try {
    //     setLoading(true);
    //
    //     let url = "";
    //     if (mode === "trending") {
    //       url = `${process.env.NEXT_PUBLIC_API_URL}/plants/trending`;
    //     } else if (mode === "featured") {
    //       url = `${process.env.NEXT_PUBLIC_API_URL}/plants/featured`;
    //     } else if (mode === "sale") {
    //       url = `${process.env.NEXT_PUBLIC_API_URL}/plants/sale`;
    //     }
    //
    //     if (!url) {
    //       console.error("No API URL found for mode:", mode);
    //       setProducts(dummyProducts.slice(0, limit));
    //       return;
    //     }
    //
    //     const res = await fetch(url, { cache: "no-store" });
    //
    //     if (!res.ok) throw new Error("Failed to fetch products");
    //
    //     const data: Product[] = await res.json();
    //     if (data && data.length > 0) {
    //       setProducts(data.slice(0, limit));
    //     } else {
    //       // ✅ fallback if backend returns empty
    //       setProducts(dummyProducts.slice(0, limit));
    //     }
    //   } catch (error) {
    //     console.error("Error fetching products:", error);
    //     // ✅ fallback if API fails
    //     setProducts(dummyProducts.slice(0, limit));
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    setProducts(dummyProducts.slice(0, limit));
    setLoading(false);

    //fetchProducts();
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
