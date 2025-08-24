"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Upload, X, Eye, EyeOff } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type Category = {
    id: string
    name: string
    description: string
    image: string
    productCount: number
    isActive: boolean
    slug?: string
    parentCategory?: string
    sortOrder?: number
    seoTitle?: string
    seoDescription?: string
    metaKeywords?: string
    displayOnHomepage?: boolean
    categoryType?: string
    commission?: number
    minOrderValue?: number
    shippingClass?: string
    tags?: string
    createdAt?: string
    updatedAt?: string
}

const dummyCategories: Category[] = [
    {
        id: "1",
        name: "Indoor Plants",
        description: "Perfect plants for indoor spaces",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 45,
        isActive: true,
        slug: "indoor-plants",
        sortOrder: 1,
        displayOnHomepage: true,
        categoryType: "primary",
    },
    {
        id: "2",
        name: "Outdoor Plants",
        description: "Hardy plants for outdoor gardens",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 32,
        isActive: true,
        slug: "outdoor-plants",
        sortOrder: 2,
        displayOnHomepage: true,
        categoryType: "primary",
    },
    {
        id: "3",
        name: "Succulents",
        description: "Low-maintenance succulent plants",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 28,
        isActive: true,
        slug: "succulents",
        sortOrder: 3,
        displayOnHomepage: true,
        categoryType: "primary",
    },
    {
        id: "4",
        name: "Herbs",
        description: "Fresh herbs for cooking",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 15,
        isActive: false,
        slug: "herbs",
        sortOrder: 4,
        displayOnHomepage: false,
        categoryType: "secondary",
    },
]

export default function CategoriesPage() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [categories, setCategories] = useState<Category[]>(dummyCategories)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        slug: "",
        parentCategory: "",
        sortOrder: "",
        seoTitle: "",
        seoDescription: "",
        metaKeywords: "",
        displayOnHomepage: false,
        categoryType: "",
        commission: "",
        minOrderValue: "",
        shippingClass: "",
        tags: "",
    })

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAddCategory = () => {
        setEditingCategory(null)
        setFormData({
            name: "",
            description: "",
            image: "",
            slug: "",
            parentCategory: "",
            sortOrder: "",
            seoTitle: "",
            seoDescription: "",
            metaKeywords: "",
            displayOnHomepage: false,
            categoryType: "",
            commission: "",
            minOrderValue: "",
            shippingClass: "",
            tags: "",
        })
        setIsDialogOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            description: category.description,
            image: category.image,
            slug: category.slug || "",
            parentCategory: category.parentCategory || "",
            sortOrder: category.sortOrder?.toString() || "",
            seoTitle: category.seoTitle || "",
            seoDescription: category.seoDescription || "",
            metaKeywords: category.metaKeywords || "",
            displayOnHomepage: category.displayOnHomepage || false,
            categoryType: category.categoryType || "",
            commission: category.commission?.toString() || "",
            minOrderValue: category.minOrderValue?.toString() || "",
            shippingClass: category.shippingClass || "",
            tags: category.tags || "",
        })
        setIsDialogOpen(true)
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadProgress(0)

        const uploadSimulation = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(uploadSimulation)
                    setIsUploading(false)
                    const imageUrl = URL.createObjectURL(file)
                    setFormData((prev) => ({ ...prev, image: imageUrl }))
                    return 100
                }
                return prev + 10
            })
        }, 200)
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
    }

    const handleNameChange = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
        }))
    }

    const handleSaveCategory = () => {
        const categoryData: Category = {
            id: editingCategory?.id || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            image: formData.image || "/placeholder.svg?height=200&width=300",
            productCount: editingCategory?.productCount || 0,
            isActive: editingCategory?.isActive ?? true,
            slug: formData.slug || generateSlug(formData.name),
            parentCategory: formData.parentCategory || undefined,
            sortOrder: formData.sortOrder ? Number.parseInt(formData.sortOrder) : undefined,
            seoTitle: formData.seoTitle || undefined,
            seoDescription: formData.seoDescription || undefined,
            metaKeywords: formData.metaKeywords || undefined,
            displayOnHomepage: formData.displayOnHomepage,
            categoryType: formData.categoryType || undefined,
            commission: formData.commission ? Number.parseFloat(formData.commission) : undefined,
            minOrderValue: formData.minOrderValue ? Number.parseFloat(formData.minOrderValue) : undefined,
            shippingClass: formData.shippingClass || undefined,
            tags: formData.tags || undefined,
            updatedAt: new Date().toISOString(),
            createdAt: editingCategory?.createdAt || new Date().toISOString(),
        }

        if (editingCategory) {
            setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? categoryData : c)))
        } else {
            setCategories((prev) => [...prev, categoryData])
        }

        setIsDialogOpen(false)
    }

    const handleDeleteCategory = (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId)
        if (
            confirm(
                `Are you sure you want to delete "${category?.name}"? This will affect ${category?.productCount} products and cannot be undone.`,
            )
        ) {
            setCategories((prev) => prev.filter((c) => c.id !== categoryId))
        }
    }

    const toggleCategoryStatus = (categoryId: string) => {
        setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, isActive: !c.isActive } : c)))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
                    <p className="text-muted-foreground">Complete CRUD control over product categories</p>
                </div>
                <Button onClick={handleAddCategory}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search categories by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <Card key={category.id}>
                        <CardHeader className="pb-3">
                            <div className="relative aspect-video overflow-hidden rounded-md">
                                <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                                <div className="absolute top-2 left-2 flex gap-1">
                                    <Badge
                                        variant={category.isActive ? "default" : "secondary"}
                                        className="cursor-pointer"
                                        onClick={() => toggleCategoryStatus(category.id)}
                                    >
                                        {category.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                                        {category.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {category.displayOnHomepage && <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>}
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Badge variant="outline" className="bg-background/80">
                                        {category.categoryType || "Standard"}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <CardTitle className="text-lg">{category.name}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                                {category.slug && <p className="text-xs text-muted-foreground font-mono">/{category.slug}</p>}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{category.productCount} products</span>
                                    {category.sortOrder && (
                                        <span className="text-xs text-muted-foreground">Order: {category.sortOrder}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteCategory(category.id)}
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

            {/* Add/Edit Category Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Update the category information below."
                                : "Fill in the comprehensive category details."}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="seo">SEO & Display</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                            <TabsTrigger value="media">Images</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Enter category name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                        placeholder="category-url-slug"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parentCategory">Parent Category</Label>
                                    <Select
                                        value={formData.parentCategory}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, parentCategory: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parent category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None (Top Level)</SelectItem>
                                            {categories
                                                .filter((c) => c.id !== editingCategory?.id)
                                                .map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categoryType">Category Type</Label>
                                    <Select
                                        value={formData.categoryType}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryType: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primary">Primary</SelectItem>
                                            <SelectItem value="secondary">Secondary</SelectItem>
                                            <SelectItem value="seasonal">Seasonal</SelectItem>
                                            <SelectItem value="featured">Featured</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sortOrder">Sort Order</Label>
                                    <Input
                                        id="sortOrder"
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: e.target.value }))}
                                        placeholder="1"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter category description"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input
                                        id="tags"
                                        value={formData.tags}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                                        placeholder="e.g., popular, trending, new-arrival"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="displayOnHomepage"
                                        checked={formData.displayOnHomepage}
                                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, displayOnHomepage: !!checked }))}
                                    />
                                    <Label htmlFor="displayOnHomepage">Display on Homepage</Label>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="seo" className="space-y-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="seoTitle">SEO Title</Label>
                                    <Input
                                        id="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                                        placeholder="SEO optimized title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="seoDescription">SEO Description</Label>
                                    <Textarea
                                        id="seoDescription"
                                        value={formData.seoDescription}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                                        placeholder="SEO meta description"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                                    <Input
                                        id="metaKeywords"
                                        value={formData.metaKeywords}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, metaKeywords: e.target.value }))}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="commission">Commission Rate (%)</Label>
                                    <Input
                                        id="commission"
                                        type="number"
                                        step="0.01"
                                        value={formData.commission}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, commission: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minOrderValue">Minimum Order Value ($)</Label>
                                    <Input
                                        id="minOrderValue"
                                        type="number"
                                        step="0.01"
                                        value={formData.minOrderValue}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, minOrderValue: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shippingClass">Shipping Class</Label>
                                    <Select
                                        value={formData.shippingClass}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, shippingClass: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shipping class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="express">Express</SelectItem>
                                            <SelectItem value="fragile">Fragile</SelectItem>
                                            <SelectItem value="oversized">Oversized</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                        <Button onClick={handleSaveCategory} disabled={!formData.name}>
                            {editingCategory ? "Update Category" : "Add Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
