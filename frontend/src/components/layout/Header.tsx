import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import PlantCategories from '@/components/ui/PlantCategories';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (showCategories) setShowCategories(false);
  };

  const handleCategoriesClick = () => {
    setShowCategories(!showCategories);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-growmor-green-dark" />
          <span className="text-xl md:text-2xl font-bold text-growmor-green-dark">GROWMOR</span>
        </Link>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden p-2 text-growmor-green-dark" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground hover:text-growmor-green-dark transition-colors">
            Home
          </Link>
          <Link to="/shopPlant" className="text-foreground hover:text-growmor-green-dark transition-colors">
            Shop Plants
          </Link>
          <Link to="/about" className="text-foreground hover:text-growmor-green-dark transition-colors">
            About Us
          </Link>
          <Link to="/blog" className="text-foreground hover:text-growmor-green-dark transition-colors">
            Blog
          </Link>
          <Link to="/contact" className="text-foreground hover:text-growmor-green-dark transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 text-foreground hover:text-growmor-green-dark transition-colors" aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/account" className="text-foreground hover:text-growmor-green-dark" aria-label="Account">
            <User size={20} />
          </Link>
          <Link to="/cart" className="relative text-foreground hover:text-growmor-green-dark" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-growmor-green-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Link>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden z-50 animate-fade-in">
            <nav className="flex flex-col p-4">
              <div className="space-y-3">
                <Link 
                  to="/" 
                  className="block py-2 text-foreground hover:text-growmor-green-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  >
                  Home
                </Link>
                <Link 
                  to="/shopPlant" 
                  className="block py-2 text-foreground hover:text-growmor-green-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop Plants
                </Link>
                <Link 
                  to="/about" 
                  className="block py-2 text-foreground hover:text-growmor-green-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/blog" 
                  className="block py-2 text-foreground hover:text-growmor-green-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/contact" 
                  className="block py-2 text-foreground hover:text-growmor-green-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>

                <div className="pt-3 flex space-x-4 border-t border-growmor-green-pale">
                  <button className="p-2 text-foreground hover:text-growmor-green-dark transition-colors" aria-label="Search">
                    <Search size={20} />
                  </button>
                  <Link to="/account" className="text-foreground hover:text-growmor-green-dark" aria-label="Account">
                    <User size={20} />
                  </Link>
                  <Link to="/cart" className="relative text-foreground hover:text-growmor-green-dark" aria-label="Cart">
                    <ShoppingCart size={20} />
                    <span className="absolute -top-1 -right-1 bg-growmor-green-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Full Page Categories Menu */}
      {/* Removed showCategories/modal logic */}
    </header>
  );
};

export default Header;
