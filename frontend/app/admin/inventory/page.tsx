"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, TrendingUp, Package, DollarSign, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { dummyProducts } from "@/lib/dummy-data"
import type { Product } from "@/components/product-card"
import Image from "next/image"

type InventoryItem = Product & {
    cost: number
    reorderPoint: number
    reorderQuantity: number
    supplier: string
    lastRestocked: string
    priceHistory: Array<{
        date: string
        price: number
        reason: string
    }>
    stockMovements: Array<{
        date: string
        type: "in" | "out" | "adjustment"
        quantity: number
        reason: string
        reference?: string
    }>
}

type BulkPriceUpdate = {
    category: string
    adjustmentType: "percentage" | "fixed"
    adjustmentValue: number
    reason: string
}

export default function InventoryManagementPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [filterStock, setFilterStock] = useState("all")
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false)
    const [isPriceUpdateOpen, setIsPriceUpdateOpen] = useState(false)
    const [isBulkPriceUpdateOpen, setIsBulkPriceUpdateOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

    // Form states
    const [stockAdjustment, setStockAdjustment] = useState({
        type: "in" as "in" | "out" | "adjustment",
        quantity: "",
        reason: "",
        reference: "",
    })

    const [priceUpdate, setPriceUpdate] = useState({
        newPrice: "",
        newSalePrice: "",
        reason: "",
    })

    const [bulkPriceUpdate, setBulkPriceUpdate] = useState<BulkPriceUpdate>({
        category: "all",
        adjustmentType: "percentage",
        adjustmentValue: 0,
        reason: "",
    })

    useEffect(() => {
        // Convert dummy products to inventory items with additional data
        const inventoryData: InventoryItem[] = dummyProducts.map((product) => ({
            ...product,
            cost: product.price * 0.6, // 40% markup
            reorderPoint: Math.max(5, Math.floor(product.stock * 0.2)),
            reorderQuantity: Math.max(10, Math.floor(product.stock * 0.5)),
            supplier: "Green Thumb Nursery",
            lastRestocked: "2024-01-15",
            priceHistory: [
                {
                    date: "2024-01-01",
                    price: product.price * 0.9,
                    reason: "Initial pricing",
                },
                {
                    date: "2024-01-15",
                    price: product.price,
                    reason: "Market adjustment",
                },
            ],
            stockMovements: [
                {
                    date: "2024-01-15",
                    type: "in" as const,
                    quantity: product.stock,
                    reason: "Initial stock",
                    reference: "PO-2024-001",
                },
            ],
        }))
        setInventory(inventoryData)
    }, [])

    const filteredInventory = inventory.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = filterCategory === "all" || item.category === filterCategory

        const matchesStock =
            filterStock === "all" ||
            (filterStock === "low" && item.stock <= item.reorderPoint) ||
            (filterStock === "out" && item.stock === 0) ||
            (filterStock === "good" && item.stock > item.reorderPoint)

        return matchesSearch && matchesCategory && matchesStock
    })

    const lowStockItems = inventory.filter((item) => item.stock <= item.reorderPoint && item.stock > 0)
    const outOfStockItems = inventory.filter((item) => item.stock === 0)
    const totalValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0)
    const totalCost = inventory.reduce((sum, item) => sum + item.cost * item.stock, 0)

    const handleStockAdjustment = () => {
        if (!selectedItem) return

        const adjustment = {
            date: new Date().toISOString().split("T")[0],
            type: stockAdjustment.type,
            quantity: Number.parseInt(stockAdjustment.quantity),
            reason: stockAdjustment.reason,
            reference: stockAdjustment.reference,
        }

        let newStock = selectedItem.stock
        if (stockAdjustment.type === "in") {
            newStock += adjustment.quantity
        } else if (stockAdjustment.type === "out") {
            newStock = Math.max(0, newStock - adjustment.quantity)
        } else {
            newStock = adjustment.quantity
        }

        setInventory((prev) =>
            prev.map((item) =>
                item.id === selectedItem.id
                    ? {
                        ...item,
                        stock: newStock,
                        stockMovements: [...item.stockMovements, adjustment],
                        lastRestocked: stockAdjustment.type === "in" ? adjustment.date : item.lastRestocked,
                    }
                    : item,
            ),
        )

        setIsStockAdjustmentOpen(false)
        setStockAdjustment({ type: "in", quantity: "", reason: "", reference: "" })
        setSelectedItem(null)
    }

    const handlePriceUpdate = () => {
        if (!selectedItem) return

        const priceHistory = {
            date: new Date().toISOString().split("T")[0],
            price: Number.parseFloat(priceUpdate.newPrice),
            reason: priceUpdate.reason,
        }

        setInventory((prev) =>
            prev.map((item) =>
                item.id === selectedItem.id
                    ? {
                        ...item,
                        price: Number.parseFloat(priceUpdate.newPrice),
                        salePrice: priceUpdate.newSalePrice ? Number.parseFloat(priceUpdate.newSalePrice) : undefined,
                        priceHistory: [...item.priceHistory, priceHistory],
                    }
                    : item,
            ),
        )

        setIsPriceUpdateOpen(false)
        setPriceUpdate({ newPrice: "", newSalePrice: "", reason: "" })
        setSelectedItem(null)
    }

    const handleBulkPriceUpdate = () => {
        const targetItems =
            bulkPriceUpdate.category === "all"
                ? inventory
                : inventory.filter((item) => item.category === bulkPriceUpdate.category)

        const updatedInventory = inventory.map((item) => {
            if (!targetItems.find((target) => target.id === item.id)) return item

            let newPrice = item.price
            if (bulkPriceUpdate.adjustmentType === "percentage") {
                newPrice = item.price * (1 + bulkPriceUpdate.adjustmentValue / 100)
            } else {
                newPrice = item.price + bulkPriceUpdate.adjustmentValue
            }

            return {
                ...item,
                price: Math.max(0.01, Number.parseFloat(newPrice.toFixed(2))),
                priceHistory: [
                    ...item.priceHistory,
                    {
                        date: new Date().toISOString().split("T")[0],
                        price: newPrice,
                        reason: bulkPriceUpdate.reason,
                    },
                ],
            }
        })

        setInventory(updatedInventory)
        setIsBulkPriceUpdateOpen(false)
        setBulkPriceUpdate({ category: "all", adjustmentType: "percentage", adjustmentValue: 0, reason: "" })
    }

    const getStockStatus = (item: InventoryItem) => {
        if (item.stock === 0) return { label: "Out of Stock", variant: "destructive" as const }
        if (item.stock <= item.reorderPoint) return { label: "Low Stock", variant: "secondary" as const }
        return { label: "In Stock", variant: "default" as const }
    }

    const getProfitMargin = (item: InventoryItem) => {
        return (((item.price - item.cost) / item.price) * 100).toFixed(1)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Price & Inventory Management</h1>
                    <p className="text-muted-foreground">Manage stock levels, pricing, and inventory operations</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isBulkPriceUpdateOpen} onOpenChange={setIsBulkPriceUpdateOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Bulk Price Update
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bulk Price Update</DialogTitle>
                                <DialogDescription>Update prices for multiple products at once</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={bulkPriceUpdate.category}
                                        onValueChange={(value) => setBulkPriceUpdate((prev) => ({ ...prev, category: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="indoor">Indoor Plants</SelectItem>
                                            <SelectItem value="outdoor">Outdoor Plants</SelectItem>
                                            <SelectItem value="succulents">Succulents</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Adjustment Type</Label>
                                        <Select
                                            value={bulkPriceUpdate.adjustmentType}
                                            onValueChange={(value: "percentage" | "fixed") =>
                                                setBulkPriceUpdate((prev) => ({ ...prev, adjustmentType: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{bulkPriceUpdate.adjustmentType === "percentage" ? "Percentage (%)" : "Amount ($)"}</Label>
                                        <Input
                                            type="number"
                                            step={bulkPriceUpdate.adjustmentType === "percentage" ? "0.1" : "0.01"}
                                            value={bulkPriceUpdate.adjustmentValue}
                                            onChange={(e) =>
                                                setBulkPriceUpdate((prev) => ({ ...prev, adjustmentValue: Number.parseFloat(e.target.value) }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Reason</Label>
                                    <Textarea
                                        value={bulkPriceUpdate.reason}
                                        onChange={(e) => setBulkPriceUpdate((prev) => ({ ...prev, reason: e.target.value }))}
                                        placeholder="Reason for price adjustment"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsBulkPriceUpdateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleBulkPriceUpdate}>Update Prices</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Cost: ${totalCost.toFixed(2)} | Profit: ${(totalValue - totalCost).toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
                        <p className="text-xs text-muted-foreground">Need reordering</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <Package className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
                        <p className="text-xs text-muted-foreground">Immediate attention needed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory.length}</div>
                        <p className="text-xs text-muted-foreground">Active products</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="inventory" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="inventory">Inventory Overview</TabsTrigger>
                    <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
                    <TabsTrigger value="movements">Stock Movements</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="indoor">Indoor Plants</SelectItem>
                                <SelectItem value="outdoor">Outdoor Plants</SelectItem>
                                <SelectItem value="succulents">Succulents</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStock} onValueChange={setFilterStock}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Stock Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stock Levels</SelectItem>
                                <SelectItem value="good">In Stock</SelectItem>
                                <SelectItem value="low">Low Stock</SelectItem>
                                <SelectItem value="out">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Inventory Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Margin</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInventory.map((item) => {
                                        const stockStatus = getStockStatus(item)
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                            <Image
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{item.name}</div>
                                                            <div className="text-sm text-muted-foreground">ID: {item.id}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{item.category}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Badge variant={stockStatus.variant}>{item.stock} units</Badge>
                                                        <div className="text-xs text-muted-foreground">Reorder at: {item.reorderPoint}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">${item.price.toFixed(2)}</div>
                                                        {item.sale && item.salePrice && (
                                                            <div className="text-sm text-green-600">Sale: ${item.salePrice.toFixed(2)}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>${item.cost.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{getProfitMargin(item)}%</Badge>
                                                </TableCell>
                                                <TableCell>${(item.price * item.stock).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedItem(item)
                                                                setStockAdjustment({ type: "in", quantity: "", reason: "", reference: "" })
                                                                setIsStockAdjustmentOpen(true)
                                                            }}
                                                        >
                                                            <Package className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedItem(item)
                                                                setPriceUpdate({
                                                                    newPrice: item.price.toString(),
                                                                    newSalePrice: item.salePrice?.toString() || "",
                                                                    reason: "",
                                                                })
                                                                setIsPriceUpdateOpen(true)
                                                            }}
                                                        >
                                                            <DollarSign className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-4">
                    <div className="grid gap-4">
                        {outOfStockItems.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-red-600 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        Out of Stock ({outOfStockItems.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {outOfStockItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-8 h-8 rounded overflow-hidden">
                                                        <Image
                                                            src={item.image || "/placeholder.svg"}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-medium">{item.name}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedItem(item)
                                                        setStockAdjustment({
                                                            type: "in",
                                                            quantity: item.reorderQuantity.toString(),
                                                            reason: "Restock",
                                                            reference: "",
                                                        })
                                                        setIsStockAdjustmentOpen(true)
                                                    }}
                                                >
                                                    Restock
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {lowStockItems.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-yellow-600 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        Low Stock ({lowStockItems.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {lowStockItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-8 h-8 rounded overflow-hidden">
                                                        <Image
                                                            src={item.image || "/placeholder.svg"}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">{item.name}</span>
                                                        <div className="text-sm text-muted-foreground">
                                                            {item.stock} left (reorder at {item.reorderPoint})
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedItem(item)
                                                        setStockAdjustment({
                                                            type: "in",
                                                            quantity: item.reorderQuantity.toString(),
                                                            reason: "Restock",
                                                            reference: "",
                                                        })
                                                        setIsStockAdjustmentOpen(true)
                                                    }}
                                                >
                                                    Restock
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="movements" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Stock Movements</CardTitle>
                            <CardDescription>Track all inventory changes and adjustments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Reference</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventory
                                        .flatMap((item) =>
                                            item.stockMovements.map((movement) => ({
                                                ...movement,
                                                productName: item.name,
                                                productId: item.id,
                                            })),
                                        )
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .slice(0, 20)
                                        .map((movement, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{movement.date}</TableCell>
                                                <TableCell>{movement.productName}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            movement.type === "in" ? "default" : movement.type === "out" ? "secondary" : "outline"
                                                        }
                                                    >
                                                        {movement.type === "in" ? "Stock In" : movement.type === "out" ? "Stock Out" : "Adjustment"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                          <span
                              className={
                                  movement.type === "in" ? "text-green-600" : movement.type === "out" ? "text-red-600" : ""
                              }
                          >
                            {movement.type === "in" ? "+" : movement.type === "out" ? "-" : ""}
                              {movement.quantity}
                          </span>
                                                </TableCell>
                                                <TableCell>{movement.reason}</TableCell>
                                                <TableCell>{movement.reference || "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Stock Adjustment Dialog */}
            <Dialog open={isStockAdjustmentOpen} onOpenChange={setIsStockAdjustmentOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Stock Adjustment</DialogTitle>
                        <DialogDescription>Adjust stock levels for {selectedItem?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Adjustment Type</Label>
                            <Select
                                value={stockAdjustment.type}
                                onValueChange={(value: "in" | "out" | "adjustment") =>
                                    setStockAdjustment((prev) => ({ ...prev, type: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in">Stock In (Add)</SelectItem>
                                    <SelectItem value="out">Stock Out (Remove)</SelectItem>
                                    <SelectItem value="adjustment">Set Exact Amount</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{stockAdjustment.type === "adjustment" ? "New Stock Level" : "Quantity"}</Label>
                            <Input
                                type="number"
                                value={stockAdjustment.quantity}
                                onChange={(e) => setStockAdjustment((prev) => ({ ...prev, quantity: e.target.value }))}
                                placeholder="Enter quantity"
                            />
                            {selectedItem && (
                                <p className="text-sm text-muted-foreground">Current stock: {selectedItem.stock} units</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Reason</Label>
                            <Textarea
                                value={stockAdjustment.reason}
                                onChange={(e) => setStockAdjustment((prev) => ({ ...prev, reason: e.target.value }))}
                                placeholder="Reason for adjustment"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Reference (Optional)</Label>
                            <Input
                                value={stockAdjustment.reference}
                                onChange={(e) => setStockAdjustment((prev) => ({ ...prev, reference: e.target.value }))}
                                placeholder="PO number, invoice, etc."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStockAdjustmentOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleStockAdjustment}>Update Stock</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Price Update Dialog */}
            <Dialog open={isPriceUpdateOpen} onOpenChange={setIsPriceUpdateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Price</DialogTitle>
                        <DialogDescription>Update pricing for {selectedItem?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Regular Price ($)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={priceUpdate.newPrice}
                                    onChange={(e) => setPriceUpdate((prev) => ({ ...prev, newPrice: e.target.value }))}
                                />
                                {selectedItem && (
                                    <p className="text-sm text-muted-foreground">Current: ${selectedItem.price.toFixed(2)}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Sale Price ($)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={priceUpdate.newSalePrice}
                                    onChange={(e) => setPriceUpdate((prev) => ({ ...prev, newSalePrice: e.target.value }))}
                                    placeholder="Optional"
                                />
                                {selectedItem?.salePrice && (
                                    <p className="text-sm text-muted-foreground">Current: ${selectedItem.salePrice.toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Price Change</Label>
                            <Textarea
                                value={priceUpdate.reason}
                                onChange={(e) => setPriceUpdate((prev) => ({ ...prev, reason: e.target.value }))}
                                placeholder="Market adjustment, cost change, promotion, etc."
                            />
                        </div>
                        {selectedItem && priceUpdate.newPrice && (
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium">Price Change Summary:</p>
                                <p className="text-sm text-muted-foreground">
                                    Old: ${selectedItem.price.toFixed(2)} → New: ${Number.parseFloat(priceUpdate.newPrice).toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Change:{" "}
                                    {(
                                        ((Number.parseFloat(priceUpdate.newPrice) - selectedItem.price) / selectedItem.price) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPriceUpdateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePriceUpdate}>Update Price</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
