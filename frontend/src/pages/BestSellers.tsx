import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { usePlants } from '@/hooks/usePlants';

const BestSellers = () => {
  const { bestSellerPlants, isLoadingBestSellers } = usePlants();

  if (isLoadingBestSellers) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading best sellers...</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Best Selling Plants</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bestSellerPlants?.map((plant) => (
          <Link 
            key={plant.id} 
            to={`/plant/${plant.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <div className="relative">
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-64 object-cover"
                />
                {plant.discountPercentage > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                    {plant.discountPercentage}% OFF
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{plant.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {plant.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    {plant.discountPercentage > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-growmor-green-dark">
                          ₹{(plant.price * (1 - plant.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{plant.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-growmor-green-dark">
                        ₹{plant.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
