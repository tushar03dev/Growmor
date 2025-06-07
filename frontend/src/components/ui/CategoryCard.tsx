import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  image: string;
  slug: string;
  itemCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  slug,
  itemCount
}) => {
  return (
    <Link 
      to={`/category/${slug}`}
      className="group relative overflow-hidden rounded-lg block"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4 text-white">
          <h3 className="text-xl font-medium mb-1">{title}</h3>
          <p className="text-sm text-white/80">{itemCount} items</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
