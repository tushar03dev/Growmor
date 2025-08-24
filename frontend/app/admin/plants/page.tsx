"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Upload, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { dummyProducts } from "@/lib/dummy-data"
import type { Product } from "@/components/product-card"
import Image from "next/image"

export default function AdminPlantsPage() {
    const [plants, setPlants] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingPlant, setEditingPlant] = useState<Product | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        salePrice: "",
        category: "",
        stock: "",
        featured: false,
        sale: false,
        image: "",
        imageUrl: "",
    })

    useEffect(() => {
        setPlants(dummyProducts)
    }, [])

    const filteredPlants = plants.filter(
        (plant) =>
            plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            salePrice: "",
            category: "",
            stock: "",
            featured: false,
            sale: false,
            image: "",
            imageUrl: "",
        })
        setUploadProgress(0)
        setIsUploading(false)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsUploading(true)
            setUploadProgress(0)

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setIsUploading(false)
                        // In real app, this would be the uploaded image URL
                        setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }))
                        return 100
                    }
                    return prev + 10
                })
            }, 200)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const plantData: Product = {
            id: editingPlant?.id || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            price: Number.parseFloat(formData.price),
            salePrice: formData.sale ? Number.parseFloat(formData.salePrice) : undefined,
            category: formData.category,
            stock: Number.parseInt(formData.stock),
            featured: formData.featured,
            sale: formData.sale,
            image: formData.image || formData.imageUrl || "/placeholder.svg?height=400&width=400",
        }

        if (editingPlant) {
            setPlants((prev) => prev.map((plant) => (plant.id === editingPlant.id ? plantData : plant)))
            setIsEditDialogOpen(false)
        } else {
            setPlants((prev) => [...prev, plantData])
            setIsAddDialogOpen(false)
        }

        resetForm()
        setEditingPlant(null)
    }

    const handleEdit = (plant: Product) => {
        setEditingPlant(plant)
        setFormData({
            name: plant.name,
            description: plant.description,
            price: plant.price.toString(),
            salePrice: plant.salePrice?.toString() || "",
            category: plant.category,
            stock: plant.stock.toString(),
            featured: plant.featured || false,
            sale: plant.sale || false,
            image: plant.image,
            imageUrl: "",
        })
        setIsEditDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this plant?")) {
            setPlants((prev) => prev.filter((plant) => plant.id !== id))
        }
    }

    const PlantForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Plant Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
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
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured">Featured Plant</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="sale"
                        checked={formData.sale}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, sale: checked }))}
                    />
                    <Label htmlFor="sale">On Sale</Label>
                </div>
            </div>

            {formData.sale && (
                <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price ($)</Label>
                    <Input
                        id="salePrice"
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, salePrice: e.target.value }))}
                        required
                    />
                </div>
            )}

            <div className="space-y-4">
                <Label>Plant Image</Label>

                <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm">
                        Image URL
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="imageUrl"
                            placeholder="https://example.com/image.jpg"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setFormData((prev) => ({ ...prev, image: prev.imageUrl }))}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">OR</div>

                <div className="space-y-2">
                    <Label htmlFor="imageFile" className="text-sm">
                        Upload Image
                    </Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <div className="space-y-2">
                            <Label htmlFor="imageFile" className="cursor-pointer">
                                <span className="text-sm font-medium text-primary hover:text-primary/80">Click to upload</span>
                                <span className="text-sm text-muted-foreground"> or drag and drop</span>
                            </Label>
                            <Input id="imageFile" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>

                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="w-full" />
                        </div>
                    )}
                </div>

                {(formData.image || formData.imageUrl) && (
                    <div className="space-y-2">
                        <Label className="text-sm">Preview</Label>
                        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                            <Image
                                src={formData.image || formData.imageUrl || "/placeholder.svg"}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        resetForm()
                        setIsAddDialogOpen(false)
                        setIsEditDialogOpen(false)
                        setEditingPlant(null)
                    }}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                    {editingPlant ? "Update Plant" : "Add Plant"}
                </Button>
            </DialogFooter>
        </form>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Plants Management</h1>
                    <p className="text-muted-foreground">Manage your plant inventory with full CRUD operations</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Plant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Plant</DialogTitle>
                            <DialogDescription>Create a new plant entry with complete details and image upload</DialogDescription>
                        </DialogHeader>
                        <PlantForm />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Plant Inventory</CardTitle>
                    <CardDescription>
                        Total plants: {plants.length} | Showing: {filteredPlants.length}
                    </CardDescription>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search plants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlants.map((plant) => (
                                <TableRow key={plant.id}>
                                    <TableCell>
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                            <Image src={plant.image || "/placeholder.svg"} alt={plant.name} fill className="object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{plant.name}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">{plant.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{plant.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {plant.sale ? (
                                                <>
                                                    <span className="font-medium text-green-600">${plant.salePrice?.toFixed(2)}</span>
                                                    <span className="text-sm text-muted-foreground line-through">${plant.price.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="font-medium">${plant.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={plant.stock > 10 ? "default" : plant.stock > 0 ? "secondary" : "destructive"}>
                                            {plant.stock} units
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {plant.featured && <Badge className="text-xs">Featured</Badge>}
                                            {plant.sale && (
                                                <Badge variant="destructive" className="text-xs">
                                                    Sale
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(plant)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(plant.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Plant</DialogTitle>
                        <DialogDescription>Update plant details and manage inventory</DialogDescription>
                    </DialogHeader>
                    <PlantForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}
