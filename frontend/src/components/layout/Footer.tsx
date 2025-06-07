import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Leaf, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup submitted');
  };

  return (
    <footer className="bg-growmor-green-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">GROWMOR</span>
            </div>
            <p className="text-growmor-white/80 mb-4">
              Bringing nature indoors since 2023. We're passionate about plants and dedicated to helping your green friends thrive.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-growmor-green-pale transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-growmor-green-pale transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-growmor-green-pale transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-growmor-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/plant-care" className="text-growmor-white/80 hover:text-white transition-colors">
                  Plant Care Tips
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-growmor-white/80 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-growmor-white/80 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-growmor-white/80 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping-policy" className="text-growmor-white/80 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-growmor-white/80 hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-growmor-white/80 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-growmor-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-growmor-white/80 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-growmor-white/80 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-growmor-green-light/20 border-growmor-green-light/40 text-white placeholder:text-growmor-white/60"
                required 
              />
              <Button type="submit" className="w-full bg-white text-growmor-green-dark hover:bg-growmor-white/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-growmor-green-light/20 mt-10 pt-6 text-center md:flex md:justify-between">
          <p className="text-growmor-white/80 text-sm">
            &copy; {new Date().getFullYear()} GROWMOR. All rights reserved.
          </p>
          <p className="text-growmor-white/80 text-sm mt-2 md:mt-0">
            Made with 🌱 for plant lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
