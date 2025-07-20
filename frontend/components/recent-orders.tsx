"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const orders = [
    {
        id: "ORD-001",
        customer: "John Doe",
        email: "john@example.com",
        amount: "$89.99",
        status: "delivered",
        date: "2024-01-15",
    },
    {
        id: "ORD-002",
        customer: "Jane Smith",
        email: "jane@example.com",
        amount: "$129.50",
        status: "shipped",
        date: "2024-01-14",
    },
    {
        id: "ORD-003",
        customer: "Bob Johnson",
        email: "bob@example.com",
        amount: "$45.00",
        status: "pending",
        date: "2024-01-13",
    },
    {
        id: "ORD-004",
        customer: "Alice Brown",
        email: "alice@example.com",
        amount: "$199.99",
        status: "packed",
        date: "2024-01-12",
    },
    {
        id: "ORD-005",
        customer: "Charlie Wilson",
        email: "charlie@example.com",
        amount: "$75.25",
        status: "cancelled",
        date: "2024-01-11",
    },
]

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    packed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function RecentOrders() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                            <div>
                                <div className="font-medium">{order.customer}</div>
                                <div className="text-sm text-muted-foreground">{order.email}</div>
                            </div>
                        </TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>
                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
