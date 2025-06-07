import React from 'react';
import { Leaf, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewArrivals = () => {
  const newArrivals = [
    {
      id: 1,
      name: 'Variegated Monstera',
      image: '/images/new-arrivals/variegated-monstera.jpg',
      price: 149.99,
      rating: 4.8,
      difficulty: 'Moderate',
      category: 'Indoor Plants',
      description: 'Rare and stunning variegated form of the popular Monstera Deliciosa.',
      stock: 5
    },
    {
      id: 2,
      name: 'Pink Princess Philodendron',
      image: '/images/new-arrivals/pink-princess.jpg',
      price: 89.99,
      rating: 4.9,
      difficulty: 'Moderate',
      category: 'Indoor Plants',
      description: 'Stunning pink variegation on dark green leaves.',
      stock: 3
    },
    {
      id: 3,
      name: 'Thai Constellation Monstera',
      image: '/images/new-arrivals/thai-constellation.jpg',
      price: 199.99,
      rating: 5.0,
      difficulty: 'Advanced',
      category: 'Indoor Plants',
      description: 'Speckled cream variegation across each leaf.',
      stock: 2
    },
    {
      id: 4,
      name: 'String of Turtles',
      image: '/images/new-arrivals/string-of-turtles.jpg',
      price: 34.99,
      rating: 4.7,
      difficulty: 'Easy',
      category: 'Succulents',
      description: 'Unique trailing plant with turtle shell-patterned leaves.',
      stock: 8
    },
    {
      id: 5,
      name: 'Black Cardinal Philodendron',
      image: '/images/new-arrivals/black-cardinal.jpg',
      price: 59.99,
      rating: 4.6,
      difficulty: 'Easy',
      category: 'Indoor Plants',
      description: 'Deep, dark foliage with burgundy undertones.',
      stock: 4
    },
    {
      id: 6,
      name: 'Dragon Scale Alocasia',
      image: '/images/new-arrivals/dragon-scale.jpg',
      price: 79.99,
      rating: 4.8,
      difficulty: 'Advanced',
      category: 'Indoor Plants',
      description: 'Silvery-green leaves with scale-like texture.',
      stock: 3
    }
  ];

  return (
    <div className="container-custom py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-growmor-green-dark mb-4">New Arrivals</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our latest collection of rare and exotic plants, carefully selected to bring unique beauty to your space.
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Button variant="outline" className="hover:bg-growmor-green-pale">
          All Plants
        </Button>
        <Button variant="outline" className="hover:bg-growmor-green-pale">
          Indoor Plants
        </Button>
        <Button variant="outline" className="hover:bg-growmor-green-pale">
          Outdoor Plants
        </Button>
        <Button variant="outline" className="hover:bg-growmor-green-pale">
          Succulents
        </Button>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newArrivals.map((plant) => (
          <div key={plant.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-growmor-green-dark" />
              </button>
              {plant.stock <= 5 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                  Only {plant.stock} left
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{plant.name}</h3>
                  <p className="text-sm text-muted-foreground">{plant.category}</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{plant.rating}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{plant.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-growmor-green-dark">
                  ${plant.price}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  plant.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  plant.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {plant.difficulty}
                </span>
              </div>

              <Button className="w-full bg-growmor-green-dark hover:bg-growmor-green-dark/90">
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
