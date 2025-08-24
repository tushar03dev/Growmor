"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Upload, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/components/product-card"
import { dummyProducts } from "@/lib/dummy-data"

export default function AdminProductsPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    featured: false,
    sale: false,
    salePrice: "",
    scientificName: "",
    careLevel: "",
    lightRequirement: "",
    wateringFrequency: "",
    soilType: "",
    humidity: "",
    temperature: "",
    fertilizer: "",
    toxicity: "",
    growthRate: "",
    matureSize: "",
    bloomTime: "",
    origin: "",
    tags: "",
    weight: "",
    dimensions: "",
    potSize: "",
    plantAge: "",
  })

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/")
      return
    }

    setProducts(dummyProducts)
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return null
  }

  const filteredProducts = products.filter(
      (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      featured: false,
      sale: false,
      salePrice: "",
      scientificName: "",
      careLevel: "",
      lightRequirement: "",
      wateringFrequency: "",
      soilType: "",
      humidity: "",
      temperature: "",
      fertilizer: "",
      toxicity: "",
      growthRate: "",
      matureSize: "",
      bloomTime: "",
      origin: "",
      tags: "",
      weight: "",
      dimensions: "",
      potSize: "",
      plantAge: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
      featured: product.featured || false,
      sale: product.sale || false,
      salePrice: product.salePrice?.toString() || "",
      scientificName: "",
      careLevel: "",
      lightRequirement: "",
      wateringFrequency: "",
      soilType: "",
      humidity: "",
      temperature: "",
      fertilizer: "",
      toxicity: "",
      growthRate: "",
      matureSize: "",
      bloomTime: "",
      origin: "",
      tags: "",
      weight: "",
      dimensions: "",
      potSize: "",
      plantAge: "",
    })
    setIsDialogOpen(true)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload with progress
    const uploadSimulation = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadSimulation)
          setIsUploading(false)
          // Create a blob URL for the uploaded file
          const imageUrl = URL.createObjectURL(file)
          setFormData((prev) => ({ ...prev, image: imageUrl }))
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleSaveProduct = () => {
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      image: formData.image || "/placeholder.svg?height=400&width=400",
      featured: formData.featured,
      sale: formData.sale,
      salePrice: formData.salePrice ? Number.parseFloat(formData.salePrice) : undefined,
    }

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? productData : p)))
    } else {
      setProducts((prev) => [...prev, productData])
    }

    setIsDialogOpen(false)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Plant Management</h1>
            <p className="text-muted-foreground">Complete CRUD control over your plant inventory</p>
          </div>
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plant
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                placeholder="Search plants by name, category, or scientific name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader className="pb-3">
                  <div className="relative aspect-square overflow-hidden rounded-md">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {product.featured && <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>}
                      {product.sale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.sale ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary">${product.salePrice?.toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                            </div>
                        ) : (
                            <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Add/Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Plant" : "Add New Plant"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update the plant information below." : "Fill in the comprehensive plant details."}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="care">Care Details</TabsTrigger>
                <TabsTrigger value="physical">Physical</TabsTrigger>
                <TabsTrigger value="media">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plant Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter plant name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scientificName">Scientific Name</Label>
                    <Input
                        id="scientificName"
                        value={formData.scientificName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, scientificName: e.target.value }))}
                        placeholder="e.g., Monstera deliciosa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">Indoor Plants</SelectItem>
                        <SelectItem value="outdoor">Outdoor Plants</SelectItem>
                        <SelectItem value="succulents">Succulents</SelectItem>
                        <SelectItem value="herbs">Herbs</SelectItem>
                        <SelectItem value="flowering">Flowering Plants</SelectItem>
                        <SelectItem value="foliage">Foliage Plants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                        id="origin"
                        value={formData.origin}
                        onChange={(e) => setFormData((prev) => ({ ...prev, origin: e.target.value }))}
                        placeholder="e.g., Tropical South America"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                        placeholder="0"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter detailed plant description"
                        rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="e.g., low-light, pet-friendly, air-purifying"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
                    />
                    <Label htmlFor="featured">Featured Plant</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="sale"
                        checked={formData.sale}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, sale: !!checked }))}
                    />
                    <Label htmlFor="sale">On Sale</Label>
                  </div>

                  {formData.sale && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="salePrice">Sale Price ($)</Label>
                        <Input
                            id="salePrice"
                            type="number"
                            step="0.01"
                            value={formData.salePrice}
                            onChange={(e) => setFormData((prev) => ({ ...prev, salePrice: e.target.value }))}
                            placeholder="0.00"
                        />
                      </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="care" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="careLevel">Care Level</Label>
                    <Select
                        value={formData.careLevel}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, careLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select care level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lightRequirement">Light Requirement</Label>
                    <Select
                        value={formData.lightRequirement}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, lightRequirement: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select light requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Light</SelectItem>
                        <SelectItem value="medium">Medium Light</SelectItem>
                        <SelectItem value="bright">Bright Light</SelectItem>
                        <SelectItem value="direct">Direct Sunlight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wateringFrequency">Watering Frequency</Label>
                    <Input
                        id="wateringFrequency"
                        value={formData.wateringFrequency}
                        onChange={(e) => setFormData((prev) => ({ ...prev, wateringFrequency: e.target.value }))}
                        placeholder="e.g., Weekly, Bi-weekly"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity Level</Label>
                    <Input
                        id="humidity"
                        value={formData.humidity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, humidity: e.target.value }))}
                        placeholder="e.g., 40-60%"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature Range</Label>
                    <Input
                        id="temperature"
                        value={formData.temperature}
                        onChange={(e) => setFormData((prev) => ({ ...prev, temperature: e.target.value }))}
                        placeholder="e.g., 65-75°F"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Input
                        id="soilType"
                        value={formData.soilType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, soilType: e.target.value }))}
                        placeholder="e.g., Well-draining potting mix"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fertilizer">Fertilizer Requirements</Label>
                    <Input
                        id="fertilizer"
                        value={formData.fertilizer}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fertilizer: e.target.value }))}
                        placeholder="e.g., Monthly liquid fertilizer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toxicity">Toxicity</Label>
                    <Select
                        value={formData.toxicity}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, toxicity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select toxicity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pet-safe">Pet Safe</SelectItem>
                        <SelectItem value="toxic-pets">Toxic to Pets</SelectItem>
                        <SelectItem value="toxic-humans">Toxic to Humans</SelectItem>
                        <SelectItem value="non-toxic">Non-Toxic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="physical" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="matureSize">Mature Size</Label>
                    <Input
                        id="matureSize"
                        value={formData.matureSize}
                        onChange={(e) => setFormData((prev) => ({ ...prev, matureSize: e.target.value }))}
                        placeholder="e.g., 6-8 feet tall"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="growthRate">Growth Rate</Label>
                    <Select
                        value={formData.growthRate}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, growthRate: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select growth rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloomTime">Bloom Time</Label>
                    <Input
                        id="bloomTime"
                        value={formData.bloomTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, bloomTime: e.target.value }))}
                        placeholder="e.g., Spring to Summer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="potSize">Pot Size</Label>
                    <Input
                        id="potSize"
                        value={formData.potSize}
                        onChange={(e) => setFormData((prev) => ({ ...prev, potSize: e.target.value }))}
                        placeholder="e.g., 6 inch diameter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                        placeholder="e.g., 2.5 lbs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (H x W)</Label>
                    <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: e.target.value }))}
                        placeholder="e.g., 24\" x 18\""
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plantAge">Plant Age</Label>
                    <Input
                        id="plantAge"
                        value={formData.plantAge}
                        onChange={(e) => setFormData((prev) => ({ ...prev, plantAge: e.target.value }))}
                        placeholder="e.g., 6 months old"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Image from Computer</Label>
                    <div className="flex items-center gap-4">
                      <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? "Uploading..." : "Choose File"}
                      </Button>
                      <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                      />
                    </div>
                    {isUploading && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} className="w-full" />
                          <p className="text-sm text-muted-foreground">{uploadProgress}% uploaded</p>
                        </div>
                    )}
                  </div>

                  {formData.image && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="relative w-full h-48 border rounded-md overflow-hidden">
                          <Image src={formData.image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                          <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} disabled={!formData.name || !formData.price || !formData.category}>
                {editingProduct ? "Update Plant" : "Add Plant"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
