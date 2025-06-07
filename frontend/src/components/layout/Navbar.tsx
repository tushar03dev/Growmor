import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-growmor-green-dark">
            GROWMOR
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-growmor-green-dark">
              Home
            </Link>
            <Link to="/new-arrivals" className="text-gray-700 hover:text-growmor-green-dark">
              New Arrivals
            </Link>
            <Link to="/shopPlant" className="text-gray-700 hover:text-growmor-green-dark">
              Shop
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-growmor-green-dark">
              Contact
            </Link>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center space-x-4">
            <Link to="/account" className="text-gray-700 hover:text-growmor-green-dark">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-growmor-green-dark">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
