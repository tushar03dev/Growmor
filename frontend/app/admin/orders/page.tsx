"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Package, Truck, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getAllOrders, updateOrderStatus, type Order } from "@/lib/api/admin"
import { useAuth } from "@/components/auth-provider"

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusIcons = {
    pending: Package,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
}

export default function OrdersPage() {
    const { isAdmin } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)

    const ordersPerPage = 10

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAdmin) return

            try {
                setIsLoading(true)
                setError(null)
                const response = await getAllOrders(
                    currentPage,
                    ordersPerPage,
                    statusFilter === "all" ? undefined : statusFilter,
                )
                setOrders(response.orders)
                setTotalOrders(response.total)
            } catch (err) {
                console.error("Failed to fetch orders:", err)
                setError("Failed to load orders. Please try again.")
                setOrders([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [isAdmin, currentPage, statusFilter])

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.email.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesSearch
    })

    const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
        try {
            setIsUpdating(orderId)
            const updatedOrder = await updateOrderStatus(orderId, newStatus)
            if (updatedOrder) {
                setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)))
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus })
                }
            }
        } catch (err) {
            console.error("Failed to update order status:", err)
            setError("Failed to update order status. Please try again.")
        } finally {
            setIsUpdating(null)
        }
    }

    const viewOrderDetails = (order: Order) => {
        setSelectedOrder(order)
        setIsDialogOpen(true)
    }

    const orderStats = {
        total: totalOrders,
        pending: orders.filter((o) => o.status === "pending").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        processing: orders.filter((o) => o.status === "processing").length,
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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
                <p className="text-muted-foreground">Manage orders and track their status</p>
                {error && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}
            </div>

            {/* Order Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Package className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.processing}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                        <Truck className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.shipped}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.delivered}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search orders by ID, customer name, or email..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Loading orders...</span>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => {
                                    const StatusIcon = statusIcons[order.status]
                                    return (
                                        <TableRow key={order._id}>
                                            <TableCell className="font-medium">{order._id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{order.userId.name}</div>
                                                    <div className="text-sm text-muted-foreground">{order.userId.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{order.orderItems.length} items</TableCell>
                                            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon className="h-4 w-4" />
                                                    <Badge className={statusColors[order.status]}>{order.status}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(value: Order["status"]) => handleUpdateOrderStatus(order._id, value)}
                                                        disabled={isUpdating === order._id}
                                                    >
                                                        <SelectTrigger className="w-[120px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="processing">Processing</SelectItem>
                                                            <SelectItem value="shipped">Shipped</SelectItem>
                                                            <SelectItem value="delivered">Delivered</SelectItem>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {isUpdating === order._id && <Loader2 className="h-4 w-4 animate-spin" />}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details - {selectedOrder?._id}</DialogTitle>
                        <DialogDescription>Complete order information and management</DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Status Control */}
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="space-y-2">
                                    <Label>Order Status</Label>
                                    <Select
                                        value={selectedOrder.status}
                                        onValueChange={(value: Order["status"]) => handleUpdateOrderStatus(selectedOrder._id, value)}
                                        disabled={isUpdating === selectedOrder._id}
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium">Name</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.userId.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.userId.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Order Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(selectedOrder.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Payment ID</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.paymentId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {selectedOrder.address && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}{" "}
                                        {selectedOrder.address.zipCode}, {selectedOrder.address.country}
                                    </p>
                                </div>
                            )}

                            {/* Order Items */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.orderItems.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {item.plantId.image?.imageUrl && (
                                                    <img
                                                        src={item.plantId.image.imageUrl || "/placeholder.svg"}
                                                        alt={item.plantId.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium">{item.plantId.name}</p>
                                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                    <p className="text-sm text-muted-foreground">Unit Price: ${item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <p className="text-lg font-semibold">Total</p>
                                    <p className="text-lg font-bold">${selectedOrder.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
