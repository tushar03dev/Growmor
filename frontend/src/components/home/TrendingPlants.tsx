import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';

const trendingPlants = [
  {
    id: 7,
    name: "Pink Anthurium",
    slug: "pink-anthurium",
    image: "https://images.unsplash.com/photo-1637967886160-fd0d6f8614a9?auto=format&fit=crop&w=600&h=750&q=80",
    price: 42.99,
    rating: 4.6,
    category: "Flowering Plants",
    isNewArrival: true
  },
  {
    id: 8,
    name: "String of Pearls",
    slug: "string-of-pearls",
    image: "https://images.unsplash.com/photo-1638559776047-ed2acb9848f8?auto=format&fit=crop&w=600&h=750&q=80",
    price: 26.99,
    rating: 4.7,
    category: "Succulents",
    isNewArrival: true
  },
  {
    id: 9,
    name: "Calathea Orbifolia",
    slug: "calathea-orbifolia",
    image: "https://images.unsplash.com/photo-1602923668104-8f9e03e77e62?auto=format&fit=crop&w=600&h=750&q=80",
    price: 38.99,
    rating: 4.5,
    category: "Indoor Plants",
    isNewArrival: true
  },
  {
    id: 10,
    name: "Rubber Plant",
    slug: "rubber-plant",
    image: "https://images.unsplash.com/photo-1614594286369-fbfd0a2992f8?auto=format&fit=crop&w=600&h=750&q=80",
    price: 36.99,
    rating: 4.7,
    category: "Air Purifying",
    isNewArrival: false
  }
];

const TrendingPlants = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Trending Plants</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our newest collection of trending plants that everyone's talking about this season
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingPlants.map(plant => (
            <ProductCard key={plant.id} {...plant} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/category/new-arrivals" 
            className="btn-secondary"
          >
            Explore All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingPlants;
