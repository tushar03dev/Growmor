"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

export type Category = {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
};

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/category")
      .then((res) => setCategories(res.data.slice(0, 6)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-8">Loading categories...</p>;

  const defaultImage = "/placeholder.svg?height=400&width=600";

  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">
            Find the perfect plants for every space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="relative rounded-lg overflow-hidden h-64 group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                  backgroundImage: `url('${cat.imageUrl || defaultImage}')`,
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
