import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';

const bestSellers = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&h=750&q=80",
    price: 39.99,
    rating: 4.8,
    category: "Indoor Plants",
    isBestSeller: true
  },
  {
    id: 2,
    name: "Fiddle Leaf Fig",
    slug: "fiddle-leaf-fig",
    image: "https://images.unsplash.com/photo-1597305877032-0668b9970e2a?auto=format&fit=crop&w=600&h=750&q=80",
    price: 59.99,
    rating: 4.7,
    category: "Indoor Plants",
    isBestSeller: true
  },
  {
    id: 3,
    name: "Snake Plant",
    slug: "snake-plant",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae2b7a?auto=format&fit=crop&w=600&h=750&q=80",
    price: 29.99,
    rating: 4.9,
    category: "Low Light Plants",
    isBestSeller: true
  },
  {
    id: 4,
    name: "Peace Lily",
    slug: "peace-lily",
    image: "https://images.unsplash.com/photo-1593691509743-f20e3e0e2e46?auto=format&fit=crop&w=600&h=750&q=80",
    price: 34.99,
    rating: 4.6,
    category: "Flowering Plants",
    isBestSeller: true
  }
];

const BestSellers = () => {
  return (
    <section className="py-16 bg-growmor-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Best Selling Plants</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular plants, loved by customers for their beauty and easy care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/best-sellers" 
            className="inline-block bg-growmor-green-dark text-white px-8 py-3 rounded-lg hover:bg-growmor-green-dark/90 transition-colors"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
