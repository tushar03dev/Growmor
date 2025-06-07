import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../ui/CategoryCard';

const categories = [
  {
    title: "Tools & Accessories",
    slug: "tools-accessories",
    image: "https://images.unsplash.com/photo-1636804573743-d4d6dede1df6?auto=format&fit=crop&w=800&h=600&q=80",
    itemCount: 42
  },
  {
    title: "Decorative Pots",
    slug: "decorative-pots",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&h=600&q=80",
    itemCount: 36
  },
  {
    title: "Fertilizers & Soil",
    slug: "fertilizers-soil",
    image: "https://images.unsplash.com/photo-1675156946299-71ab59333119?auto=format&fit=crop&w=800&h=600&q=80",
    itemCount: 28
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-growmor-white to-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Everything Your Plants Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect tools, containers, and supplements to help your plants thrive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              title={category.title}
              image={category.image}
              slug={category.slug}
              itemCount={category.itemCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
