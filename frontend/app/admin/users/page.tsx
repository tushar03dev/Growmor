"use client"

import { useState } from "react"
import { Search, UserIcon, Mail, Phone, Calendar, Edit, Trash2, UserPlus, Shield, ShieldCheck } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type AdminUser = {
    id: string
    name: string
    email: string
    phone: string
    role: "user" | "admin" | "moderator"
    status: "active" | "inactive" | "suspended"
    joinDate: string
    lastLogin: string
    totalOrders: number
    totalSpent: number
    address: string
    avatar?: string
}

const dummyUsers: AdminUser[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        role: "user",
        status: "active",
        joinDate: "2024-01-15",
        lastLogin: "2024-01-20",
        totalOrders: 5,
        totalSpent: 299.95,
        address: "123 Main St, City, State 12345",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567891",
        role: "admin",
        status: "active",
        joinDate: "2023-12-01",
        lastLogin: "2024-01-21",
        totalOrders: 12,
        totalSpent: 899.5,
        address: "456 Oak Ave, City, State 12345",
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "+1234567892",
        role: "user",
        status: "inactive",
        joinDate: "2024-01-10",
        lastLogin: "2024-01-18",
        totalOrders: 2,
        totalSpent: 149.98,
        address: "789 Pine St, City, State 12345",
    },
]

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>(dummyUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "user" as AdminUser["role"],
        status: "active" as AdminUser["status"],
        address: "",
    })

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm)

        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    const handleEditUser = (user: AdminUser) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            address: user.address,
        })
        setIsDialogOpen(true)
    }

    const handleAddUser = () => {
        setEditingUser(null)
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "user",
            status: "active",
            address: "",
        })
        setIsDialogOpen(true)
    }

    const handleSaveUser = () => {
        const userData: AdminUser = {
            id: editingUser?.id || Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            address: formData.address,
            joinDate: editingUser?.joinDate || new Date().toISOString().split("T")[0],
            lastLogin: editingUser?.lastLogin || new Date().toISOString().split("T")[0],
            totalOrders: editingUser?.totalOrders || 0,
            totalSpent: editingUser?.totalSpent || 0,
        }

        if (editingUser) {
            setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? userData : user)))
        } else {
            setUsers((prev) => [...prev, userData])
        }

        setIsDialogOpen(false)
    }

    const handleDeleteUser = (userId: string) => {
        const user = users.find((u) => u.id === userId)
        if (confirm(`Are you sure you want to delete user "${user?.name}"? This action cannot be undone.`)) {
            setUsers((prev) => prev.filter((user) => user.id !== userId))
        }
    }

    const userStats = {
        totalUsers: users.length,
        activeUsers: users.filter((user) => user.status === "active").length,
        adminUsers: users.filter((user) => user.role === "admin").length,
        totalRevenue: users.reduce((sum, user) => sum + user.totalSpent, 0),
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "moderator":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "user":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "inactive":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "suspended":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "admin":
                return ShieldCheck
            case "moderator":
                return Shield
            case "user":
                return UserIcon
            default:
                return UserIcon
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage users, roles, and permissions</p>
                </div>
                <Button onClick={handleAddUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* User Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UserIcon className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.activeUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.adminUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${userStats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => {
                                const RoleIcon = getRoleIcon(user.role)
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="flex items-center space-x-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="text-sm">{user.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Phone className="h-3 w-3" />
                                                    <span className="text-sm">{user.phone}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <RoleIcon className="h-4 w-4" />
                                                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                        </TableCell>
                                        <TableCell>{user.totalOrders}</TableCell>
                                        <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                                        <TableCell>{user.lastLogin}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Add/Edit User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? "Update user information and permissions" : "Create a new user account"}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: AdminUser["status"]) => setFormData((prev) => ({ ...prev, status: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                        placeholder="Full address"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="permissions" className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">User Role</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value: AdminUser["role"]) => setFormData((prev) => ({ ...prev, role: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User - Basic access</SelectItem>
                                            <SelectItem value="moderator">Moderator - Content management</SelectItem>
                                            <SelectItem value="admin">Admin - Full access</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">Role Permissions:</h4>
                                    {formData.role === "user" && (
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• View and purchase products</li>
                                            <li>• Manage personal account</li>
                                            <li>• View order history</li>
                                        </ul>
                                    )}
                                    {formData.role === "moderator" && (
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• All user permissions</li>
                                            <li>• Manage blog posts</li>
                                            <li>• Moderate user content</li>
                                            <li>• View basic analytics</li>
                                        </ul>
                                    )}
                                    {formData.role === "admin" && (
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Full system access</li>
                                            <li>• Manage all users</li>
                                            <li>• Access admin dashboard</li>
                                            <li>• Modify system settings</li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser}>{editingUser ? "Update User" : "Create User"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
