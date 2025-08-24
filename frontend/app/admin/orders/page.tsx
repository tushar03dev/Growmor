"use client"

import { useState } from "react"
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Order = {
    id: string
    customer: {
        name: string
        email: string
        phone: string
    }
    items: {
        name: string
        quantity: number
        price: number
    }[]
    total: number
    status: "pending" | "packed" | "shipped" | "delivered" | "cancelled"
    date: string
    shippingAddress: string
    priority: "low" | "normal" | "high" | "urgent"
    estimatedDelivery: string
    notes: string
    lastUpdated: string
}

const dummyOrders: Order[] = [
    {
        id: "ORD-001",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
        },
        items: [
            { name: "Monstera Deliciosa", quantity: 1, price: 45.99 },
            { name: "Snake Plant", quantity: 2, price: 29.99 },
        ],
        total: 105.97,
        status: "pending",
        date: "2024-01-15",
        shippingAddress: "123 Main St, City, State 12345",
        priority: "high",
        estimatedDelivery: "2024-01-20",
        notes: "Customer requested expedited shipping",
        lastUpdated: "2024-01-15T10:30:00Z",
    },
    {
        id: "ORD-002",
        customer: {
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+1234567891",
        },
        items: [{ name: "Fiddle Leaf Fig", quantity: 1, price: 89.99 }],
        total: 89.99,
        status: "shipped",
        date: "2024-01-14",
        shippingAddress: "456 Oak Ave, City, State 12345",
        priority: "normal",
        estimatedDelivery: "2024-01-22",
        notes: "",
        lastUpdated: "2024-01-16T14:20:00Z",
    },
    {
        id: "ORD-003",
        customer: {
            name: "Bob Johnson",
            email: "bob@example.com",
            phone: "+1234567892",
        },
        items: [{ name: "Peace Lily", quantity: 3, price: 24.99 }],
        total: 74.97,
        status: "delivered",
        date: "2024-01-13",
        shippingAddress: "789 Pine St, City, State 12345",
        priority: "normal",
        estimatedDelivery: "2024-01-18",
        notes: "Delivered successfully",
        lastUpdated: "2024-01-18T16:45:00Z",
    },
]

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    packed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const priorityColors = {
    low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    normal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusIcons = {
    pending: Package,
    packed: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
}

const priorityIcons = {
    low: Clock,
    normal: Clock,
    high: AlertTriangle,
    urgent: AlertTriangle,
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(dummyOrders)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingOrder, setEditingOrder] = useState<Order | null>(null)

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.status === statusFilter
        const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus, lastUpdated: new Date().toISOString() } : order,
            ),
        )
    }

    const updateOrderPriority = (orderId: string, newPriority: Order["priority"]) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, priority: newPriority, lastUpdated: new Date().toISOString() } : order,
            ),
        )
    }

    const updateOrderDetails = (orderId: string, updates: Partial<Order>) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, ...updates, lastUpdated: new Date().toISOString() } : order,
            ),
        )
    }

    const viewOrderDetails = (order: Order) => {
        setSelectedOrder(order)
        setEditingOrder(order)
        setIsDialogOpen(true)
    }

    const orderStats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        urgent: orders.filter((o) => o.priority === "urgent").length,
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
                <p className="text-muted-foreground">Manage orders with priority control and manual status updates</p>
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
                        <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                        <Truck className="h-4 w-4 text-blue-600" />
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderStats.urgent}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search orders..."
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
                        <SelectItem value="packed">Packed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Est. Delivery</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => {
                                const StatusIcon = statusIcons[order.status]
                                const PriorityIcon = priorityIcons[order.priority]
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{order.customer.name}</div>
                                                <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.items.length} items</TableCell>
                                        <TableCell>${order.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <PriorityIcon className="h-4 w-4" />
                                                <Select
                                                    value={order.priority}
                                                    onValueChange={(value: Order["priority"]) => updateOrderPriority(order.id, value)}
                                                >
                                                    <SelectTrigger className="w-[100px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                        <SelectItem value="urgent">Urgent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <StatusIcon className="h-4 w-4" />
                                                <Badge className={statusColors[order.status]}>{order.status}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.estimatedDelivery}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value: Order["status"]) => updateOrderStatus(order.id, value)}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="packed">Packed</SelectItem>
                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Management - {selectedOrder?.id}</DialogTitle>
                        <DialogDescription>Complete order information with manual control options</DialogDescription>
                    </DialogHeader>

                    {selectedOrder && editingOrder && (
                        <div className="space-y-6">
                            {/* Priority and Delivery Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                                <div className="space-y-2">
                                    <Label>Priority Level</Label>
                                    <Select
                                        value={editingOrder.priority}
                                        onValueChange={(value: Order["priority"]) => {
                                            setEditingOrder({ ...editingOrder, priority: value })
                                            updateOrderPriority(editingOrder.id, value)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low Priority</SelectItem>
                                            <SelectItem value="normal">Normal Priority</SelectItem>
                                            <SelectItem value="high">High Priority</SelectItem>
                                            <SelectItem value="urgent">Urgent Priority</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Estimated Delivery</Label>
                                    <Input
                                        type="date"
                                        value={editingOrder.estimatedDelivery}
                                        onChange={(e) => {
                                            setEditingOrder({ ...editingOrder, estimatedDelivery: e.target.value })
                                            updateOrderDetails(editingOrder.id, { estimatedDelivery: e.target.value })
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Order Status</Label>
                                    <Select
                                        value={editingOrder.status}
                                        onValueChange={(value: Order["status"]) => {
                                            setEditingOrder({ ...editingOrder, status: value })
                                            updateOrderStatus(editingOrder.id, value)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="packed">Packed</SelectItem>
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
                                        <p className="text-sm text-muted-foreground">{selectedOrder.customer.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Phone</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Order Date</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.date}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                                <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <p className="text-lg font-semibold">Total</p>
                                    <p className="text-lg font-bold">${selectedOrder.total.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="space-y-2">
                                <Label>Order Notes</Label>
                                <Textarea
                                    value={editingOrder.notes}
                                    onChange={(e) => {
                                        setEditingOrder({ ...editingOrder, notes: e.target.value })
                                        updateOrderDetails(editingOrder.id, { notes: e.target.value })
                                    }}
                                    placeholder="Add notes about this order..."
                                    rows={3}
                                />
                            </div>

                            {/* Last Updated */}
                            <div className="text-sm text-muted-foreground">
                                Last updated: {new Date(editingOrder.lastUpdated).toLocaleString()}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
