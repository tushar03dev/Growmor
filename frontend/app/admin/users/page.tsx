"use client"

import { useState } from "react"
import { Search, UserPlus, Edit, Trash2, Shield, ShieldOff, Mail, Phone, Calendar, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
    id: string
    name: string
    email: string
    role: "user" | "admin"
    status: "active" | "inactive" | "suspended"
    avatar?: string
    phone?: string
    registrationDate: string
    lastLogin: string
    totalOrders: number
    totalSpent: number
    emailVerified: boolean
    phoneVerified: boolean
    address?: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    preferences: {
        newsletter: boolean
        smsNotifications: boolean
        emailNotifications: boolean
    }
    activityLog: Array<{
        date: string
        action: string
        details: string
        ipAddress?: string
    }>
}

const dummyUsers: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "user",
        status: "active",
        avatar: "/placeholder.svg?height=40&width=40",
        phone: "+1 (555) 123-4567",
        registrationDate: "2024-01-15",
        lastLogin: "2024-01-25",
        totalOrders: 12,
        totalSpent: 456.78,
        emailVerified: true,
        phoneVerified: true,
        address: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
        },
        preferences: {
            newsletter: true,
            smsNotifications: false,
            emailNotifications: true,
        },
        activityLog: [
            {
                date: "2024-01-25",
                action: "Login",
                details: "User logged in successfully",
                ipAddress: "192.168.1.1",
            },
            {
                date: "2024-01-24",
                action: "Order Placed",
                details: "Order #ORD-2024-001 placed",
            },
        ],
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "admin",
        status: "active",
        avatar: "/placeholder.svg?height=40&width=40",
        phone: "+1 (555) 987-6543",
        registrationDate: "2023-12-01",
        lastLogin: "2024-01-25",
        totalOrders: 5,
        totalSpent: 234.56,
        emailVerified: true,
        phoneVerified: false,
        preferences: {
            newsletter: true,
            smsNotifications: true,
            emailNotifications: true,
        },
        activityLog: [
            {
                date: "2024-01-25",
                action: "Admin Login",
                details: "Admin panel accessed",
                ipAddress: "192.168.1.2",
            },
        ],
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "user",
        status: "suspended",
        phone: "+1 (555) 456-7890",
        registrationDate: "2024-01-10",
        lastLogin: "2024-01-20",
        totalOrders: 3,
        totalSpent: 89.99,
        emailVerified: false,
        phoneVerified: false,
        preferences: {
            newsletter: false,
            smsNotifications: false,
            emailNotifications: true,
        },
        activityLog: [
            {
                date: "2024-01-22",
                action: "Account Suspended",
                details: "Account suspended due to policy violation",
            },
        ],
    },
    {
        id: "4",
        name: "Alice Wilson",
        email: "alice.wilson@example.com",
        role: "user",
        status: "inactive",
        registrationDate: "2023-11-15",
        lastLogin: "2023-12-01",
        totalOrders: 0,
        totalSpent: 0,
        emailVerified: true,
        phoneVerified: false,
        preferences: {
            newsletter: true,
            smsNotifications: false,
            emailNotifications: false,
        },
        activityLog: [
            {
                date: "2023-12-01",
                action: "Last Login",
                details: "User last seen",
            },
        ],
    },
]

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>(dummyUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "user" as "user" | "admin",
        status: "active" as "active" | "inactive" | "suspended",
        emailVerified: false,
        phoneVerified: false,
        newsletter: true,
        smsNotifications: false,
        emailNotifications: true,
    })

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = filterRole === "all" || user.role === filterRole
        const matchesStatus = filterStatus === "all" || user.status === filterStatus

        return matchesSearch && matchesRole && matchesStatus
    })

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "user",
            status: "active",
            emailVerified: false,
            phoneVerified: false,
            newsletter: true,
            smsNotifications: false,
            emailNotifications: true,
        })
    }

    const handleAddUser = () => {
        resetForm()
        setIsAddDialogOpen(true)
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            newsletter: user.preferences.newsletter,
            smsNotifications: user.preferences.smsNotifications,
            emailNotifications: user.preferences.emailNotifications,
        })
        setIsEditDialogOpen(true)
    }

    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        setIsViewDialogOpen(true)
    }

    const handleSaveUser = () => {
        const userData: User = {
            id: selectedUser?.id || Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            registrationDate: selectedUser?.registrationDate || new Date().toISOString().split("T")[0],
            lastLogin: selectedUser?.lastLogin || "Never",
            totalOrders: selectedUser?.totalOrders || 0,
            totalSpent: selectedUser?.totalSpent || 0,
            emailVerified: formData.emailVerified,
            phoneVerified: formData.phoneVerified,
            address: selectedUser?.address,
            preferences: {
                newsletter: formData.newsletter,
                smsNotifications: formData.smsNotifications,
                emailNotifications: formData.emailNotifications,
            },
            activityLog: selectedUser?.activityLog || [
                {
                    date: new Date().toISOString().split("T")[0],
                    action: "Account Created",
                    details: "User account created by admin",
                },
            ],
        }

        if (selectedUser) {
            setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? userData : user)))
            setIsEditDialogOpen(false)
        } else {
            setUsers((prev) => [...prev, userData])
            setIsAddDialogOpen(false)
        }

        resetForm()
        setSelectedUser(null)
    }

    const handleDeleteUser = (userId: string) => {
        const user = users.find((u) => u.id === userId)
        if (user && confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            setUsers((prev) => prev.filter((user) => user.id !== userId))
        }
    }

    const handleStatusChange = (userId: string, newStatus: "active" | "inactive" | "suspended") => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? {
                        ...user,
                        status: newStatus,
                        activityLog: [
                            ...user.activityLog,
                            {
                                date: new Date().toISOString().split("T")[0],
                                action: "Status Changed",
                                details: `Account status changed to ${newStatus}`,
                            },
                        ],
                    }
                    : user,
            ),
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "default"
            case "inactive":
                return "secondary"
            case "suspended":
                return "destructive"
            default:
                return "outline"
        }
    }

    const getRoleColor = (role: string) => {
        return role === "admin" ? "default" : "outline"
    }

    const activeUsers = users.filter((user) => user.status === "active").length
    const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0)
    const totalOrders = users.reduce((sum, user) => sum + user.totalOrders, 0)

    const UserForm = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                        value={formData.role}
                        onValueChange={(value: "user" | "admin") => setFormData((prev) => ({ ...prev, role: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive" | "suspended") =>
                        setFormData((prev) => ({ ...prev, status: value }))
                    }
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

            <div className="space-y-4">
                <Label>Verification Status</Label>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="emailVerified"
                            checked={formData.emailVerified}
                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, emailVerified: checked }))}
                        />
                        <Label htmlFor="emailVerified">Email Verified</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="phoneVerified"
                            checked={formData.phoneVerified}
                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, phoneVerified: checked }))}
                        />
                        <Label htmlFor="phoneVerified">Phone Verified</Label>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="newsletter"
                            checked={formData.newsletter}
                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, newsletter: checked }))}
                        />
                        <Label htmlFor="newsletter">Newsletter Subscription</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="smsNotifications"
                            checked={formData.smsNotifications}
                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, smsNotifications: checked }))}
                        />
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="emailNotifications"
                            checked={formData.emailNotifications}
                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, emailNotifications: checked }))}
                        />
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Users Management</h1>
                    <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
                </div>
                <Button onClick={handleAddUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">Active: {activeUsers}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">From {totalOrders} orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
                        <p className="text-xs text-muted-foreground">Administrative accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                        <ShieldOff className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {users.filter((u) => u.status === "suspended").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">All Users</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="user">Users</SelectItem>
                                <SelectItem value="admin">Admins</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-48">
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
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Spent</TableHead>
                                        <TableHead>Last Login</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                            {user.emailVerified && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    Verified
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {user.phone && (
                                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {user.phone}
                                                                {user.phoneVerified && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        Verified
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleColor(user.role) as any}>
                                                    {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={user.status}
                                                    onValueChange={(value: "active" | "inactive" | "suspended") =>
                                                        handleStatusChange(user.id, value)
                                                    }
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <Badge variant={getStatusColor(user.status) as any} className="border-0">
                                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                        </Badge>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.totalOrders}</Badge>
                                            </TableCell>
                                            <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {user.lastLogin}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)}>
                                                        <Activity className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteUser(user.id)}
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
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent User Activity</CardTitle>
                            <CardDescription>Track user actions and system events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>IP Address</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users
                                        .flatMap((user) =>
                                            user.activityLog.map((activity) => ({
                                                ...activity,
                                                userName: user.name,
                                                userEmail: user.email,
                                                userId: user.id,
                                            })),
                                        )
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .slice(0, 20)
                                        .map((activity, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{activity.date}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{activity.userName}</div>
                                                        <div className="text-sm text-muted-foreground">{activity.userEmail}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{activity.action}</Badge>
                                                </TableCell>
                                                <TableCell>{activity.details}</TableCell>
                                                <TableCell>{activity.ipAddress || "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add User Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account with role and permissions</DialogDescription>
                    </DialogHeader>
                    <UserForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser}>Add User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information and permissions</DialogDescription>
                    </DialogHeader>
                    <UserForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser}>Update User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View User Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>Complete user profile and activity information</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                                    <AvatarFallback className="text-lg">{selectedUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={getRoleColor(selectedUser.role) as any}>{selectedUser.role}</Badge>
                                        <Badge variant={getStatusColor(selectedUser.status) as any}>{selectedUser.status}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Contact Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {selectedUser.email}
                                            {selectedUser.emailVerified && (
                                                <Badge variant="outline" className="text-xs">
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                        {selectedUser.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {selectedUser.phone}
                                                {selectedUser.phoneVerified && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium">Account Statistics</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>Registration: {selectedUser.registrationDate}</div>
                                        <div>Last Login: {selectedUser.lastLogin}</div>
                                        <div>Total Orders: {selectedUser.totalOrders}</div>
                                        <div>Total Spent: ${selectedUser.totalSpent.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {selectedUser.address && (
                                <div className="space-y-4">
                                    <h4 className="font-medium">Address</h4>
                                    <div className="text-sm text-muted-foreground">
                                        {selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.state}{" "}
                                        {selectedUser.address.zipCode}, {selectedUser.address.country}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="font-medium">Preferences</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={selectedUser.preferences.newsletter ? "default" : "secondary"}>
                                            Newsletter: {selectedUser.preferences.newsletter ? "Yes" : "No"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={selectedUser.preferences.smsNotifications ? "default" : "secondary"}>
                                            SMS: {selectedUser.preferences.smsNotifications ? "Yes" : "No"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={selectedUser.preferences.emailNotifications ? "default" : "secondary"}>
                                            Email: {selectedUser.preferences.emailNotifications ? "Yes" : "No"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium">Recent Activity</h4>
                                <div className="space-y-2">
                                    {selectedUser.activityLog.slice(0, 5).map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                                            <div>
                                                <div className="font-medium">{activity.action}</div>
                                                <div className="text-muted-foreground">{activity.details}</div>
                                            </div>
                                            <div className="text-muted-foreground">{activity.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
