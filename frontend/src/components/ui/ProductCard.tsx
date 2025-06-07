import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  slug: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  rating,
  category,
  slug,
  isBestSeller = false,
  isNewArrival = false,
}) => {
  const { isAuthenticated, setShowAuthModal } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    console.log(`Product ${name} added to cart (User is authenticated)`);
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Badge (Best Seller or New Arrival) */}
      {(isBestSeller || isNewArrival) && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            isBestSeller 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-growmor-green-light text-white'
          }`}>
            {isBestSeller ? 'Best Seller' : 'New'}
          </span>
        </div>
      )}
      
      {/* Image */}
      <Link to={`/product/${slug}`} className="relative overflow-hidden">
        <div className="aspect-[4/5] w-full">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </Link>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-sm text-muted-foreground mb-1">{category}</div>
        <Link to={`/product/${slug}`} className="hover:text-growmor-green-dark">
          <h3 className="font-medium text-base mb-2 line-clamp-2">{name}</h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="text-lg font-medium">${price.toFixed(2)}</div>
          <Button 
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-foreground hover:text-white hover:bg-growmor-green-dark transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
