import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Leaf, Sun, Cloud, Apple } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

const MegaMenu = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { categories, isLoadingCategories } = useCategories();

  if (isLoadingCategories) {
    return null;
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-1 text-gray-700 hover:text-growmor-green-dark transition-colors"
        onMouseEnter={() => setActiveCategory('categories')}
      >
        <span>Categories</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Mega Menu Dropdown */}
      <div
        className={cn(
          "absolute top-full left-0 w-screen max-w-6xl bg-white shadow-lg rounded-lg p-6 opacity-0 invisible transition-all duration-200 transform -translate-y-2",
          activeCategory === 'categories' && "opacity-100 visible translate-y-0"
        )}
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="grid grid-cols-4 gap-8">
          {categories?.map((category) => (
            <div key={category.id} className="space-y-4">
              <Link
                to={`/category/${category.id}`}
                className="flex items-center space-x-2 text-growmor-green-dark hover:text-growmor-green-dark/80"
              >
                {getCategoryIcon(category.name)}
                <span className="font-medium">{category.name}</span>
              </Link>
              <p className="text-sm text-gray-600">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get category icon
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'indoor':
      return <Leaf className="w-5 h-5" />;
    case 'outdoor':
      return <Sun className="w-5 h-5" />;
    case 'succulents':
      return <Cloud className="w-5 h-5" />;
    default:
      return <Apple className="w-5 h-5" />;
  }
};

export default MegaMenu;
