import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
    title: "Spring Collection",
    subtitle: "Discover our new arrivals to brighten your space",
    cta: "Shop Now",
    link: "/category/new-arrivals"
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    title: "Indoor Oasis",
    subtitle: "Transform your home with our air-purifying plants",
    cta: "Explore Indoor Plants",
    link: "/category/indoor-plants"
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1920&q=80',
    title: "Summer Sale",
    subtitle: "Up to 30% off on selected outdoor varieties",
    cta: "View Offers",
    link: "/offers"
  }
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Hero Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="container-custom h-full flex items-center">
              <div className="max-w-lg text-white z-10 animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
                <Link to={slide.link} className="btn-primary">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promotional Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-growmor-green-dark bg-opacity-90 text-white py-2">
        <div className="container-custom">
          <p className="text-center text-sm md:text-base">🌱 Free shipping on orders over $50 | 30-day plant guarantee 🌱</p>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-0 right-0">
        <div className="container-custom flex justify-start">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-8 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
