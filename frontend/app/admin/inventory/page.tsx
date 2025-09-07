"use client"

import { useState, useEffect } from "react"
import { Search, Package, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Edit, Loader2 } from "lucide-react"
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
import { getLowStockProducts, updateProductStock, type Plant } from "@/lib/api/admin"
import { useAuth } from "@/components/auth-provider"

export default function InventoryPage() {
    const { isAdmin } = useAuth()
    const [inventory, setInventory] = useState<Plant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Plant | null>(null)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [stockUpdate, setStockUpdate] = useState("")

    useEffect(() => {
        const fetchInventoryData = async () => {
            if (!isAdmin) return

            try {
                setIsLoading(true)
                setError(null)
                const lowStockItems = await getLowStockProducts()
                setInventory(lowStockItems)
            } catch (err) {
                console.error("Failed to fetch inventory data:", err)
                setError("Failed to load inventory data. Please try again.")
                setInventory([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchInventoryData()
    }, [isAdmin])

    const getProductStatus = (product: Plant): "in-stock" | "low-stock" | "out-of-stock" => {
        if (product.stock === 0) return "out-of-stock"
        if (product.stock <= 5) return "low-stock" // Assuming 5 as low stock threshold
        return "in-stock"
    }

    const filteredInventory = inventory.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.categoryId.name.toLowerCase().includes(searchTerm.toLowerCase())

        const status = getProductStatus(item)
        const matchesStatus = statusFilter === "all" || status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleEditStock = (item: Plant) => {
        setEditingItem(item)
        setStockUpdate(item.stock.toString())
        setIsDialogOpen(true)
    }

    const handleUpdateStock = async () => {
        if (!editingItem) return

        try {
            setIsUpdating(editingItem._id)
            const updatedProduct = await updateProductStock(editingItem._id, Number.parseInt(stockUpdate))
            if (updatedProduct) {
                setInventory((prev) =>
                    prev.map((item) => (item._id === editingItem._id ? { ...item, stock: Number.parseInt(stockUpdate) } : item)),
                )
                setIsDialogOpen(false)
            } else {
                setError("Failed to update stock. Please try again.")
            }
        } catch (err) {
            console.error("Failed to update stock:", err)
            setError("Failed to update stock. Please try again.")
        } finally {
            setIsUpdating(null)
        }
    }

    const inventoryStats = {
        totalItems: inventory.length,
        inStock: inventory.filter((item) => getProductStatus(item) === "in-stock").length,
        lowStock: inventory.filter((item) => getProductStatus(item) === "low-stock").length,
        outOfStock: inventory.filter((item) => getProductStatus(item) === "out-of-stock").length,
        totalValue: inventory.reduce((sum, item) => sum + item.stock * item.price, 0),
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "in-stock":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "low-stock":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "out-of-stock":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold">Loading inventory...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Price & Inventory Management</h2>
                    <p className="text-muted-foreground">Manage stock levels, pricing, and inventory operations</p>
                    {error && (
                        <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}
                </div>
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
                        placeholder="Search by name or category..."
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
                                <TableHead>Category</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map((item) => {
                                const status = getProductStatus(item)
                                return (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {item.image?.imageUrl && (
                                                    <img
                                                        src={item.image.imageUrl || "/placeholder.svg"}
                                                        alt={item.name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">{item.description.substring(0, 50)}...</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.categoryId.name}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.stock}</div>
                                        </TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(status)}>{status.replace("-", " ")}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => handleEditStock(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Update Stock Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Stock</DialogTitle>
                        <DialogDescription>Update the stock quantity for {editingItem?.name}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Current Stock: {editingItem?.stock}</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={stockUpdate}
                                onChange={(e) => setStockUpdate(e.target.value)}
                                placeholder="Enter new stock quantity"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStock} disabled={isUpdating === editingItem?._id}>
                            {isUpdating === editingItem?._id ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                "Update Stock"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
