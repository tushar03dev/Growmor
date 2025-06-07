import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlantCategories from '@/components/ui/PlantCategories';

const ShopPlant = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container-custom py-8">
          <PlantCategories />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPlant;
