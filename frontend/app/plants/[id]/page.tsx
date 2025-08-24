"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  isTrending: boolean;
  isBestSeller: boolean;
  image: {
    imageUrl: string;
  };
  categoryId: {
    _id: string;
    name: string;
    description: string;
  };
}

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/plants/${params.id}`
        );
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        router.push("/plants");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-muted-foreground mt-2">
            The product you&#39;re looking for doesn&#39;t exist.
          </p>
          <Button onClick={() => router.push("/plants")} className="mt-4">
            Back to Plants
          </Button>
        </div>
      </div>
    );
  }

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: discountedPrice,
      image: product.image.imageUrl,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  const images = [product.image, product.image, product.image];

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image
              src={images[selectedImage]?.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative overflow-hidden rounded-md border-2 ${
                  selectedImage === index ? "border-primary" : "border-muted"
                }`}
              >
                <Image
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              {product.isTrending && <Badge>🔥 Trending</Badge>}
              {product.isBestSeller && (
                <Badge variant="secondary">⭐ Best Seller</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {product.discountPercentage > 0 ? (
              <>
                <span className="text-3xl font-bold text-primary">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
                <Badge variant="destructive">
                  -{product.discountPercentage}%
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Quantity + Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1"
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over $50
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Plant Guarantee</p>
                <p className="text-xs text-muted-foreground">
                  30-day guarantee
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  Hassle-free returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">
                About {product.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {product.description} This beautiful plant is perfect for both
                beginners and experienced plant parents. It thrives in various
                lighting conditions and requires minimal maintenance while
                providing maximum beauty.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">
                Shipping Information
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Standard Shipping (5-7 business days): $9.99</li>
                <li>Express Shipping (2-3 business days): $19.99</li>
                <li>Free Standard Shipping on orders over $50</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">4.8</span>
                  <span className="text-muted-foreground">(124 reviews)</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
