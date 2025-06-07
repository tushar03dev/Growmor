import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Sun, Cloud, Apple } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

const CategorySection = () => {
  const { categories, isLoadingCategories } = useCategories();

  if (isLoadingCategories) {
    return <div>Loading categories...</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group"
            >
              <div className="bg-growmor-green-pale rounded-lg p-6 text-center transition-transform duration-300 group-hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-growmor-green-dark">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper function to get category icon
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'indoor':
      return <Leaf className="w-8 h-8 text-growmor-green-dark" />;
    case 'outdoor':
      return <Sun className="w-8 h-8 text-growmor-green-dark" />;
    case 'succulents':
      return <Cloud className="w-8 h-8 text-growmor-green-dark" />;
    default:
      return <Apple className="w-8 h-8 text-growmor-green-dark" />;
  }
};

export default CategorySection;
