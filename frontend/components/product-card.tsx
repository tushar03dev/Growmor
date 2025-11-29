"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  image: {
    imageUrl: string;
  };
  categoryId: {
    _id: string;
    name: string;
    description: string;
    plants: never[];
    __v: number;
  };
  stock: number;
  featured?: boolean;
  sale?: boolean;
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = async(e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const success = await addItem(product._id,1);
      if(success) {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
    }
  };


  return (
    <Link href={`/plants/${product._id}`}>
      <div
        className="group relative rounded-lg border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg plant-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-64 aspect-square overflow-hidden">
          <Image
            src={product.image?.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {product.sale && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          )}

          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
              Featured
            </Badge>
          )}

          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
                onClick={(e) => handleAddToCart(e, product)}
                className="mx-2"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {product.sale ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    ${product.salePrice?.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
