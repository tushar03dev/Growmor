"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Heart, Star, Truck, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import type { Product } from "@/components/product-card"
import { dummyProducts } from "@/lib/dummy-data"

export default function PlantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundProduct = dummyProducts.find((p) => p.id === params.id)
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      router.push("/plants")
    }
  }, [params.id, router])

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-muted-foreground mt-2">The product you&#39;re looking for doesn&#39;t exist.</p>
          <Button onClick={() => router.push("/plants")} className="mt-4">
            Back to Plants
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale ? product.salePrice || product.price : product.price,
      image: product.image,
      quantity,
    })
  }

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login")
      return
    }
    handleAddToCart()
    router.push("/checkout")
  }

  const images = [product.image, product.image, product.image] // In real app, multiple images

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image src={images[selectedImage] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            {product.sale && <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">Sale</Badge>}
            {product.featured && (
              <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600">Featured</Badge>
            )}
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
                  src={image || "/placeholder.svg"}
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
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8) • 124 reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {product.sale ? (
              <>
                <span className="text-3xl font-bold text-primary">${product.salePrice?.toFixed(2)}</span>
                <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <Badge variant="destructive">Save ${(product.price - (product.salePrice || 0)).toFixed(2)}</Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

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
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} available</span>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} variant="outline" className="flex-1">
                Buy Now
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Plant Guarantee</p>
                <p className="text-xs text-muted-foreground">30-day guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">Hassle-free returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="care">Care Guide</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">About {product.name}</h3>
              <p className="text-muted-foreground mb-4">
                {product.description} This beautiful plant is perfect for both beginners and experienced plant parents.
                It thrives in various lighting conditions and requires minimal maintenance while providing maximum
                beauty.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Scientific name: Monstera deliciosa</li>
                <li>Native to: Central America</li>
                <li>Mature size: 6-10 feet indoors</li>
                <li>Growth rate: Moderate to fast</li>
                <li>Pet-friendly: No, toxic to pets</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="care" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Light Requirements</h4>
                  <p className="text-muted-foreground mb-4">
                    Bright, indirect light. Can tolerate some direct morning sun but avoid harsh afternoon sun.
                  </p>

                  <h4 className="font-medium mb-2">Watering</h4>
                  <p className="text-muted-foreground mb-4">
                    Water when the top inch of soil feels dry. Typically every 1-2 weeks.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Humidity</h4>
                  <p className="text-muted-foreground mb-4">
                    Prefers higher humidity (50-60%) but adapts to average home humidity.
                  </p>

                  <h4 className="font-medium mb-2">Temperature</h4>
                  <p className="text-muted-foreground mb-4">
                    Ideal temperature range: 65-80°F (18-27°C). Avoid cold drafts.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shipping Options</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Standard Shipping (5-7 business days): $9.99</li>
                    <li>Express Shipping (2-3 business days): $19.99</li>
                    <li>Free Standard Shipping on orders over $50</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Plant Care During Shipping</h4>
                  <p className="text-muted-foreground">
                    All plants are carefully packaged with protective materials and shipped in climate-controlled
                    vehicles to ensure they arrive healthy and ready to thrive in their new home.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">4.8</span>
                  <span className="text-muted-foreground">(124 reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="font-medium">Sarah M.</span>
                      <span className="text-sm text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-muted-foreground">
                      Beautiful plant! Arrived in perfect condition and has been thriving in my living room. The
                      packaging was excellent and the plant looks exactly like the photos.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
