"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
};

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ static fallback categories
  const staticCategories: Category[] = [
    {
      _id: "static-1",
      name: "Indoor Plants",
      description: "Perfect for homes and offices",
      imageUrl: "/Monstera_Deliciosa.webp",
    },
    {
      _id: "static-2",
      name: "Outdoor Plants",
      description: "Ideal for gardens and balconies",
      imageUrl: "/Hero_slider2.jpg",
    },
    {
      _id: "static-3",
      name: "Succulents",
      description: "Low-maintenance and trendy",
      imageUrl: "/succulents.webp",
    },
  ];

  // ✅ multiple fallback images
  const fallbackImages = [
    "/Monstera_Deliciosa.webp",
    "/Hero_slider2.jpg",
    "/succulents.webp",
  ];


  return (
    <section className="py-12 bg-muted/50 w-full">
      <div className="mx-7">
        <div className="text-center mb-10">
          <h2 className="text-3xl text-center font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">
            Find the perfect plants for every space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staticCategories.map((cat, index) => (
            <div
              key={cat._id}
              className="relative rounded-lg overflow-hidden h-64 group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                  backgroundImage: `url('${
                    cat.imageUrl ||
                    fallbackImages[index % fallbackImages.length]
                  }')`,
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
                <h3 className="text-2xl font-bold mb-4">{cat.name}</h3>
                <Link
                  href={`/plants?category=${encodeURIComponent(
                    cat.name.toLowerCase()
                  )}`}
                >
                  <Button
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black"
                  >
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
