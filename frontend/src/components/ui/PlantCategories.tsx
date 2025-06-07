import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Leaf, Sun, Cloud, Sprout, Apple, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useCategories } from '@/hooks/useCategories';
import { usePlants } from '@/hooks/usePlants';

interface CategoryProps {
  onClose?: () => void;
}

const PlantCategories: React.FC<CategoryProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const { categories, isLoadingCategories } = useCategories();
  const { plants, isLoadingPlants } = usePlants();

  // Filter plants based on price range and category
  const filteredPlants = plants?.filter(plant => {
    const price = plant.price;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesCategory = !activeCategory || plant.categoryId.toString() === activeCategory;
    return matchesPrice && matchesCategory;
  });

  if (isLoadingCategories || isLoadingPlants) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-growmor-green-dark">Shop Plants</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter size={16} />
              <span>Filters</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-growmor-green-dark"
          >
            <X size={24} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="sticky top-[72px] bg-white border-b border-gray-100 z-10 p-4">
          <div className="container-custom">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range (₹)</label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={0}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <div className="md:col-span-1 space-y-2">
            <button
              className={cn(
                "w-full flex items-center space-x-3 p-4 rounded-lg text-left transition-colors",
                !activeCategory
                  ? "bg-growmor-green-pale text-growmor-green-dark"
                  : "hover:bg-gray-50"
              )}
              onClick={() => setActiveCategory(null)}
            >
              <span className="text-growmor-green-dark">View All Plants</span>
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "w-full flex items-center space-x-3 p-4 rounded-lg text-left transition-colors",
                  activeCategory === category.id.toString()
                    ? "bg-growmor-green-pale text-growmor-green-dark"
                    : "hover:bg-gray-50"
                )}
                onClick={() => setActiveCategory(category.id.toString())}
              >
                <span className="text-growmor-green-dark">
                  {getCategoryIcon(category.name)}
                </span>
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="md:col-span-3">
            {activeCategory ? (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-6">
                  {categories?.find(cat => cat.id.toString() === activeCategory)?.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlants?.map((plant) => (
                    <Link
                      key={plant.id}
                      to={`/plant/${plant.id}`}
                      className="group p-4 rounded-lg border border-gray-100 hover:border-growmor-green-dark transition-colors"
                      onClick={onClose}
                    >
                      <div className="space-y-4">
                        <div className="aspect-square relative overflow-hidden rounded-lg">
                          <img
                            src={plant.images[0]?.url}
                            alt={plant.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium group-hover:text-growmor-green-dark transition-colors">
                            {plant.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {plant.description}
                          </p>
                          <p className="text-sm font-medium text-growmor-green-dark">
                            ₹{plant.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-6">All Plants</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlants?.map((plant) => (
                    <Link
                      key={plant.id}
                      to={`/plant/${plant.id}`}
                      className="group p-4 rounded-lg border border-gray-100 hover:border-growmor-green-dark transition-colors"
                      onClick={onClose}
                    >
                      <div className="space-y-4">
                        <div className="aspect-square relative overflow-hidden rounded-lg">
                          <img
                            src={plant.images[0]?.url}
                            alt={plant.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium group-hover:text-growmor-green-dark transition-colors">
                            {plant.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {plant.description}
                          </p>
                          <p className="text-sm font-medium text-growmor-green-dark">
                            ₹{plant.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
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
      return <Sprout className="w-5 h-5" />;
  }
};

export default PlantCategories;
