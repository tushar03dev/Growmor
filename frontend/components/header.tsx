"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, User, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminError, setAdminError] = useState("")
  const [isAdminLoading, setIsAdminLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, adminLogin } = useAuth()
  const { totalItems } = useCart()

  const isAdminPage = pathname?.startsWith("/admin")
  if (isAdminPage) return null

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdminLoading(true)
    setAdminError("")

    try {
      const success = await adminLogin(adminEmail, adminPassword)
      if (success) {
        localStorage.setItem("adminAuth", "true")
        setIsAdminDialogOpen(false)
        router.push("/admin")
      } else {
        setAdminError("Invalid admin credentials")
      }
    } catch (err) {
      setAdminError("An error occurred. Please try again.")
    } finally {
      setIsAdminLoading(false)
    }
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Plants", href: "/plants" },
    { name: "Blog", href: "/blog" },
  ]

  return (
      <header className="sticky top-0 z-40 w-full border-b flex justify-around bg-background">
          <div className="containerjustify-between h-16 flex items-center gap-6 w-[80%]">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">TARUVIN</span>
            </Link>

            <nav className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                          isActive(link.href) ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    {link.name}
                  </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                  )}
                </Button>
              </Link>

              <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" title="Admin Access">
                    <Shield className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Admin Access</DialogTitle>
                    <DialogDescription>Enter admin credentials to access the admin panel</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    {adminError && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{adminError}</div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@growmor.com"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <Input
                          id="admin-password"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isAdminLoading}>
                      {isAdminLoading ? "Logging in..." : "Access Admin Panel"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/orders" className="w-full">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

        {/* Mobile menu */}
        {isMenuOpen && (
            <div className="md:hidden border-t p-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                            isActive(link.href) ? "text-primary" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                ))}
              </nav>
            </div>
        )}
      </header>
  )
}
