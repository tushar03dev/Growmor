"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, Menu, X, Search } from "lucide-react"
import { Button } from "../ui/button"
import { useCart } from "../../hooks/useCart"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { cartCount } = useCart()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GROWMOR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/plants" className="text-gray-700 hover:text-green-600 transition-colors">
              Plants
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-green-600 transition-colors">
              Categories
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-green-600 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative group">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  {session.user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/plants" className="text-gray-700 hover:text-green-600 transition-colors">
                Plants
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-green-600 transition-colors">
                Categories
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-green-600 transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
