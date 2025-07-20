"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Search } from "lucide-react"
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

type Category = {
    id: string
    name: string
    description: string
    image: string
    productCount: number
    isActive: boolean
}

const dummyCategories: Category[] = [
    {
        id: "1",
        name: "Indoor Plants",
        description: "Perfect plants for indoor spaces",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 45,
        isActive: true,
    },
    {
        id: "2",
        name: "Outdoor Plants",
        description: "Hardy plants for outdoor gardens",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 32,
        isActive: true,
    },
    {
        id: "3",
        name: "Succulents",
        description: "Low-maintenance succulent plants",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 28,
        isActive: true,
    },
    {
        id: "4",
        name: "Herbs",
        description: "Fresh herbs for cooking",
        image: "/placeholder.svg?height=200&width=300",
        productCount: 15,
        isActive: false,
    },
]

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(dummyCategories)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
    })

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAddCategory = () => {
        setEditingCategory(null)
        setFormData({
            name: "",
            description: "",
            image: "",
        })
        setIsDialogOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            description: category.description,
            image: category.image,
        })
        setIsDialogOpen(true)
    }

    const handleSaveCategory = () => {
        const categoryData: Category = {
            id: editingCategory?.id || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            image: formData.image || "/placeholder.svg?height=200&width=300",
            productCount: editingCategory?.productCount || 0,
            isActive: editingCategory?.isActive ?? true,
        }

        if (editingCategory) {
            setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? categoryData : c)))
        } else {
            setCategories((prev) => [...prev, categoryData])
        }

        setIsDialogOpen(false)
    }

    const handleDeleteCategory = (categoryId: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
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
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage your product categories</p>
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
                        placeholder="Search categories..."
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
                                <div className="absolute top-2 right-2">
                                    <Badge
                                        variant={category.isActive ? "default" : "secondary"}
                                        className="cursor-pointer"
                                        onClick={() => toggleCategoryStatus(category.id)}
                                    >
                                        {category.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <CardTitle className="text-lg">{category.name}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{category.productCount} products</span>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Update the category information below."
                                : "Fill in the details to add a new category."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter category name"
                            />
                        </div>

                        <div className="space-y-2">
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

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={formData.image}
                                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveCategory}>{editingCategory ? "Update Category" : "Add Category"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
