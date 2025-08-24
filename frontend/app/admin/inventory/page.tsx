"use client"

import { useState } from "react"
import { Search, Package, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type InventoryItem = {
    id: string
    name: string
    sku: string
    category: string
    currentStock: number
    minStock: number
    maxStock: number
    costPrice: number
    sellingPrice: number
    margin: number
    supplier: string
    lastRestocked: string
    status: "in-stock" | "low-stock" | "out-of-stock" | "discontinued"
}

const dummyInventory: InventoryItem[] = [
    {
        id: "1",
        name: "Monstera Deliciosa",
        sku: "PLT-MON-001",
        category: "Indoor Plants",
        currentStock: 25,
        minStock: 10,
        maxStock: 50,
        costPrice: 25.0,
        sellingPrice: 45.99,
        margin: 45.6,
        supplier: "Green Thumb Nursery",
        lastRestocked: "2024-01-10",
        status: "in-stock",
    },
    {
        id: "2",
        name: "Snake Plant",
        sku: "PLT-SNK-002",
        category: "Indoor Plants",
        currentStock: 5,
        minStock: 8,
        maxStock: 30,
        costPrice: 15.0,
        sellingPrice: 29.99,
        margin: 50.0,
        supplier: "Plant Paradise",
        lastRestocked: "2024-01-05",
        status: "low-stock",
    },
    {
        id: "3",
        name: "Fiddle Leaf Fig",
        sku: "PLT-FIG-003",
        category: "Indoor Plants",
        currentStock: 0,
        minStock: 5,
        maxStock: 20,
        costPrice: 45.0,
        sellingPrice: 89.99,
        margin: 50.0,
        supplier: "Tropical Plants Co",
        lastRestocked: "2023-12-20",
        status: "out-of-stock",
    },
]

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>(dummyInventory)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        currentStock: "",
        minStock: "",
        maxStock: "",
        costPrice: "",
        sellingPrice: "",
        supplier: "",
    })

    const filteredInventory = inventory.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || item.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleEditItem = (item: InventoryItem) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            sku: item.sku,
            category: item.category,
            currentStock: item.currentStock.toString(),
            minStock: item.minStock.toString(),
            maxStock: item.maxStock.toString(),
            costPrice: item.costPrice.toString(),
            sellingPrice: item.sellingPrice.toString(),
            supplier: item.supplier,
        })
        setIsDialogOpen(true)
    }

    const handleAddItem = () => {
        setEditingItem(null)
        setFormData({
            name: "",
            sku: "",
            category: "",
            currentStock: "",
            minStock: "",
            maxStock: "",
            costPrice: "",
            sellingPrice: "",
            supplier: "",
        })
        setIsDialogOpen(true)
    }

    const handleSaveItem = () => {
        const margin =
            ((Number.parseFloat(formData.sellingPrice) - Number.parseFloat(formData.costPrice)) /
                Number.parseFloat(formData.sellingPrice)) *
            100
        const currentStock = Number.parseInt(formData.currentStock)
        const minStock = Number.parseInt(formData.minStock)

        let status: InventoryItem["status"] = "in-stock"
        if (currentStock === 0) status = "out-of-stock"
        else if (currentStock <= minStock) status = "low-stock"

        const itemData: InventoryItem = {
            id: editingItem?.id || Date.now().toString(),
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            currentStock: currentStock,
            minStock: minStock,
            maxStock: Number.parseInt(formData.maxStock),
            costPrice: Number.parseFloat(formData.costPrice),
            sellingPrice: Number.parseFloat(formData.sellingPrice),
            margin: margin,
            supplier: formData.supplier,
            lastRestocked: editingItem?.lastRestocked || new Date().toISOString().split("T")[0],
            status: status,
        }

        if (editingItem) {
            setInventory((prev) => prev.map((item) => (item.id === editingItem.id ? itemData : item)))
        } else {
            setInventory((prev) => [...prev, itemData])
        }

        setIsDialogOpen(false)
    }

    const inventoryStats = {
        totalItems: inventory.length,
        inStock: inventory.filter((item) => item.status === "in-stock").length,
        lowStock: inventory.filter((item) => item.status === "low-stock").length,
        outOfStock: inventory.filter((item) => item.status === "out-of-stock").length,
        totalValue: inventory.reduce((sum, item) => sum + item.currentStock * item.costPrice, 0),
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "in-stock":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "low-stock":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "out-of-stock":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "discontinued":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Price & Inventory Management</h2>
                    <p className="text-muted-foreground">Manage stock levels, pricing, and inventory operations</p>
                </div>
                <Button onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </div>

            {/* Inventory Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventoryStats.inStock}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventoryStats.lowStock}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventoryStats.outOfStock}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${inventoryStats.totalValue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by name, SKU, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Inventory Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Cost Price</TableHead>
                                <TableHead>Selling Price</TableHead>
                                <TableHead>Margin</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-sm text-muted-foreground">{item.supplier}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{item.sku}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{item.currentStock}</div>
                                            <div className="text-sm text-muted-foreground">Min: {item.minStock}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                                    <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                                    <TableCell>{item.margin.toFixed(1)}%</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(item.status)}>{item.status.replace("-", " ")}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Item Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Inventory Item" : "Add New Item"}</DialogTitle>
                        <DialogDescription>
                            {editingItem ? "Update inventory item details" : "Add a new item to inventory"}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                                        placeholder="PLT-XXX-001"
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
                                            <SelectItem value="Indoor Plants">Indoor Plants</SelectItem>
                                            <SelectItem value="Outdoor Plants">Outdoor Plants</SelectItem>
                                            <SelectItem value="Succulents">Succulents</SelectItem>
                                            <SelectItem value="Herbs">Herbs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supplier">Supplier</Label>
                                    <Input
                                        id="supplier"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, supplier: e.target.value }))}
                                        placeholder="Supplier name"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="pricing" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentStock">Current Stock</Label>
                                    <Input
                                        id="currentStock"
                                        type="number"
                                        value={formData.currentStock}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, currentStock: e.target.value }))}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minStock">Minimum Stock</Label>
                                    <Input
                                        id="minStock"
                                        type="number"
                                        value={formData.minStock}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, minStock: e.target.value }))}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxStock">Maximum Stock</Label>
                                    <Input
                                        id="maxStock"
                                        type="number"
                                        value={formData.maxStock}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, maxStock: e.target.value }))}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="costPrice">Cost Price ($)</Label>
                                    <Input
                                        id="costPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                                    <Input
                                        id="sellingPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, sellingPrice: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                                {formData.costPrice && formData.sellingPrice && (
                                    <div className="col-span-2 p-3 bg-muted rounded-lg">
                                        <p className="text-sm font-medium">
                                            Profit Margin:{" "}
                                            {(
                                                ((Number.parseFloat(formData.sellingPrice) - Number.parseFloat(formData.costPrice)) /
                                                    Number.parseFloat(formData.sellingPrice)) *
                                                100
                                            ).toFixed(1)}
                                            %
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveItem}>{editingItem ? "Update Item" : "Add Item"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
