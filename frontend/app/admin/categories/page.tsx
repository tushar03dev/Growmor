"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Upload, ExternalLink, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Category = {
    id: string
    name: string
    description: string
    image: string
    productCount: number
    isActive: boolean
    slug: string
    createdAt: string
    updatedAt: string
}

const dummyCategories: Category[] = [
    {
        id: "1",
        name: "Indoor Plants",
        description: "Perfect plants for indoor spaces, bringing nature inside your home",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 45,
        isActive: true,
        slug: "indoor",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
    },
    {
        id: "2",
        name: "Outdoor Plants",
        description: "Hardy plants for outdoor gardens and landscaping",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 32,
        isActive: true,
        slug: "outdoor",
        createdAt: "2024-01-16",
        updatedAt: "2024-01-21",
    },
    {
        id: "3",
        name: "Succulents",
        description: "Low-maintenance succulent plants perfect for beginners",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 28,
        isActive: true,
        slug: "succulents",
        createdAt: "2024-01-17",
        updatedAt: "2024-01-22",
    },
    {
        id: "4",
        name: "Herbs",
        description: "Fresh herbs for cooking and aromatherapy",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 15,
        isActive: false,
        slug: "herbs",
        createdAt: "2024-01-18",
        updatedAt: "2024-01-23",
    },
]

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(dummyCategories)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        imageUrl: "",
        slug: "",
        isActive: true,
    })

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            image: "",
            imageUrl: "",
            slug: "",
            isActive: true,
        })
        setUploadProgress(0)
        setIsUploading(false)
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
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
                        setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }))
                        return 100
                    }
                    return prev + 10
                })
            }, 200)
        }
    }

    const handleAddCategory = () => {
        setEditingCategory(null)
        resetForm()
        setIsDialogOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            description: category.description,
            image: category.image,
            imageUrl: "",
            slug: category.slug,
            isActive: category.isActive,
        })
        setIsDialogOpen(true)
    }

    const handleSaveCategory = () => {
        const now = new Date().toISOString().split("T")[0]
        const categoryData: Category = {
            id: editingCategory?.id || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            image: formData.image || formData.imageUrl || "/placeholder.svg?height=200&width=300",
            productCount: editingCategory?.productCount || 0,
            isActive: formData.isActive,
            slug: formData.slug || generateSlug(formData.name),
            createdAt: editingCategory?.createdAt || now,
            updatedAt: now,
        }

        if (editingCategory) {
            setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? categoryData : c)))
        } else {
            setCategories((prev) => [...prev, categoryData])
        }

        setIsDialogOpen(false)
        resetForm()
        setEditingCategory(null)
    }

    const handleDeleteCategory = (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId)
        if (category && category.productCount > 0) {
            if (
                !confirm(
                    `This category has ${category.productCount} products. Are you sure you want to delete it? This will also remove the category from all associated products.`,
                )
            ) {
                return
            }
        } else if (!confirm("Are you sure you want to delete this category?")) {
            return
        }
        setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    }

    const toggleCategoryStatus = (categoryId: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString().split("T")[0] } : c,
            ),
        )
    }

    const CategoryForm = () => (
        <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                            const name = e.target.value
                            setFormData((prev) => ({
                                ...prev,
                                name,
                                slug: prev.slug || generateSlug(name),
                            }))
                        }}
                        placeholder="Enter category name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="category-url-slug"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description"
                    rows={3}
                    required
                />
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active Category</Label>
            </div>

            <div className="space-y-4">
                <Label>Category Image</Label>

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
                        <div className="relative w-32 h-24 border rounded-lg overflow-hidden">
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
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories Management</h2>
                    <p className="text-muted-foreground">Manage your product categories with full CRUD operations</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
                        {viewMode === "grid" ? "Table View" : "Grid View"}
                    </Button>
                    <Button onClick={handleAddCategory}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Total: {categories.length}</span>
                    <span>Active: {categories.filter((c) => c.isActive).length}</span>
                    <span>Products: {categories.reduce((sum, c) => sum + c.productCount, 0)}</span>
                </div>
            </div>

            {/* Categories Display */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <Card key={category.id}>
                            <CardHeader className="pb-3">
                                <div className="relative aspect-video overflow-hidden rounded-md">
                                    <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                                    <div className="absolute top-2 right-2">
                                        <Badge
                                            variant={category.isActive ? "default" : "secondary"}
                                            className="cursor-pointer"
                                            onClick={() => toggleCategoryStatus(category.id)}
                                        >
                                            {category.isActive ? (
                                                <>
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3 w-3 mr-1" />
                                                    Inactive
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <CardTitle className="text-lg">{category.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Slug: {category.slug}</span>
                                        <span>Updated: {category.updatedAt}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{category.productCount} products</Badge>
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
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <div className="relative w-16 h-12 rounded-md overflow-hidden">
                                                <Image
                                                    src={category.image || "/placeholder.svg"}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{category.name}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-1">{category.description}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{category.productCount}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={category.isActive ? "default" : "secondary"}
                                                className="cursor-pointer"
                                                onClick={() => toggleCategoryStatus(category.id)}
                                            >
                                                {category.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{category.updatedAt}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteCategory(category.id)}
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
            )}

            {/* Add/Edit Category Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Update the category information below."
                                : "Fill in the details to add a new category with image upload support."}
                        </DialogDescription>
                    </DialogHeader>

                    <CategoryForm />

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false)
                                resetForm()
                                setEditingCategory(null)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveCategory} disabled={isUploading}>
                            {editingCategory ? "Update Category" : "Add Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
