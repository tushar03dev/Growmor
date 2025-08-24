"use client"

import { useState } from "react"
import { Save, Globe, Mail, Shield, Bell, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

type Settings = {
    // General Settings
    siteName: string
    siteDescription: string
    siteUrl: string
    adminEmail: string
    supportEmail: string

    // Business Settings
    businessName: string
    businessAddress: string
    businessPhone: string
    taxRate: number
    currency: string
    timezone: string

    // Email Settings
    smtpHost: string
    smtpPort: string
    smtpUsername: string
    smtpPassword: string
    emailFromName: string
    emailFromAddress: string

    // Security Settings
    enableTwoFactor: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number

    // Notification Settings
    emailNotifications: boolean
    orderNotifications: boolean
    lowStockAlerts: boolean
    newUserNotifications: boolean

    // System Settings
    maintenanceMode: boolean
    debugMode: boolean
    cacheEnabled: boolean
    backupFrequency: string
}

const defaultSettings: Settings = {
    siteName: "GROWMOR",
    siteDescription: "Your premier destination for beautiful plants and gardening supplies",
    siteUrl: "https://growmor.com",
    adminEmail: "admin@growmor.com",
    supportEmail: "support@growmor.com",

    businessName: "GROWMOR Plant Store",
    businessAddress: "123 Garden Street, Plant City, PC 12345",
    businessPhone: "+1 (555) 123-4567",
    taxRate: 8.5,
    currency: "USD",
    timezone: "America/New_York",

    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    emailFromName: "GROWMOR",
    emailFromAddress: "noreply@growmor.com",

    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,

    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    newUserNotifications: false,

    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: "daily",
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>(defaultSettings)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsSaving(false)
        // Show success message
        alert("Settings saved successfully!")
    }

    const updateSetting = (key: keyof Settings, value: any) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
                    <p className="text-muted-foreground">Configure your application settings and preferences</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Globe className="h-5 w-5" />
                                <span>General Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input
                                        id="siteName"
                                        value={settings.siteName}
                                        onChange={(e) => updateSetting("siteName", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siteUrl">Site URL</Label>
                                    <Input
                                        id="siteUrl"
                                        value={settings.siteUrl}
                                        onChange={(e) => updateSetting("siteUrl", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Site Description</Label>
                                <Textarea
                                    id="siteDescription"
                                    value={settings.siteDescription}
                                    onChange={(e) => updateSetting("siteDescription", e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">Admin Email</Label>
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        value={settings.adminEmail}
                                        onChange={(e) => updateSetting("adminEmail", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input
                                        id="supportEmail"
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={(e) => updateSetting("supportEmail", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input
                                        id="businessName"
                                        value={settings.businessName}
                                        onChange={(e) => updateSetting("businessName", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessPhone">Business Phone</Label>
                                    <Input
                                        id="businessPhone"
                                        value={settings.businessPhone}
                                        onChange={(e) => updateSetting("businessPhone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessAddress">Business Address</Label>
                                <Textarea
                                    id="businessAddress"
                                    value={settings.businessAddress}
                                    onChange={(e) => updateSetting("businessAddress", e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                    <Input
                                        id="taxRate"
                                        type="number"
                                        step="0.1"
                                        value={settings.taxRate}
                                        onChange={(e) => updateSetting("taxRate", Number.parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Mail className="h-5 w-5" />
                                <span>Email Configuration</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpHost">SMTP Host</Label>
                                    <Input
                                        id="smtpHost"
                                        value={settings.smtpHost}
                                        onChange={(e) => updateSetting("smtpHost", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input
                                        id="smtpPort"
                                        value={settings.smtpPort}
                                        onChange={(e) => updateSetting("smtpPort", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                                    <Input
                                        id="smtpUsername"
                                        value={settings.smtpUsername}
                                        onChange={(e) => updateSetting("smtpUsername", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                                    <Input
                                        id="smtpPassword"
                                        type="password"
                                        value={settings.smtpPassword}
                                        onChange={(e) => updateSetting("smtpPassword", e.target.value)}
                                    />
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emailFromName">From Name</Label>
                                    <Input
                                        id="emailFromName"
                                        value={settings.emailFromName}
                                        onChange={(e) => updateSetting("emailFromName", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emailFromAddress">From Address</Label>
                                    <Input
                                        id="emailFromAddress"
                                        type="email"
                                        value={settings.emailFromAddress}
                                        onChange={(e) => updateSetting("emailFromAddress", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" />
                                <span>Security Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                                </div>
                                <Switch
                                    checked={settings.enableTwoFactor}
                                    onCheckedChange={(checked) => updateSetting("enableTwoFactor", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                    <Input
                                        id="sessionTimeout"
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => updateSetting("sessionTimeout", Number.parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                                    <Input
                                        id="maxLoginAttempts"
                                        type="number"
                                        value={settings.maxLoginAttempts}
                                        onChange={(e) => updateSetting("maxLoginAttempts", Number.parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="passwordMinLength">Min Password Length</Label>
                                    <Input
                                        id="passwordMinLength"
                                        type="number"
                                        value={settings.passwordMinLength}
                                        onChange={(e) => updateSetting("passwordMinLength", Number.parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="h-5 w-5" />
                                <span>Notification Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Send email notifications for system events</p>
                                </div>
                                <Switch
                                    checked={settings.emailNotifications}
                                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Order Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Notify when new orders are placed</p>
                                </div>
                                <Switch
                                    checked={settings.orderNotifications}
                                    onCheckedChange={(checked) => updateSetting("orderNotifications", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Low Stock Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Alert when inventory is running low</p>
                                </div>
                                <Switch
                                    checked={settings.lowStockAlerts}
                                    onCheckedChange={(checked) => updateSetting("lowStockAlerts", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New User Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Notify when new users register</p>
                                </div>
                                <Switch
                                    checked={settings.newUserNotifications}
                                    onCheckedChange={(checked) => updateSetting("newUserNotifications", checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Database className="h-5 w-5" />
                                <span>System Settings</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
                                </div>
                                <Switch
                                    checked={settings.maintenanceMode}
                                    onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Debug Mode</Label>
                                    <p className="text-sm text-muted-foreground">Enable debug logging and error display</p>
                                </div>
                                <Switch
                                    checked={settings.debugMode}
                                    onCheckedChange={(checked) => updateSetting("debugMode", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Cache Enabled</Label>
                                    <p className="text-sm text-muted-foreground">Enable application caching for better performance</p>
                                </div>
                                <Switch
                                    checked={settings.cacheEnabled}
                                    onCheckedChange={(checked) => updateSetting("cacheEnabled", checked)}
                                />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                                <Select
                                    value={settings.backupFrequency}
                                    onValueChange={(value) => updateSetting("backupFrequency", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
