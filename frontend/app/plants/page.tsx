"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard, type Product } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

export default function PlantsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([{ value: "all", label: "All Categories" }]);

  // ✅ Fetch products from backend API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants/`);
        const data: Product[] = await res.json();
        setProducts(data);

        // Apply category filter from URL after products fetched
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
          setSelectedCategory(categoryParam.toLowerCase());
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, [searchParams]);

  // Define a Category type for fetched categories
  type Category = {
    name: string;
    // add other fields if needed
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
        const data: Category[] = await res.json();
        const mapped = data.map((cat: Category) => ({
          value: cat.name, // use category name
          label: cat.name,
        }));
        setCategories([{ value: "all", label: "All Categories" }, ...mapped]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // ✅ Filtering + sorting
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) =>
          p.categoryId.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-20":
          filtered = filtered.filter((p) => p.price < 20);
          break;
        case "20-50":
          filtered = filtered.filter((p) => p.price >= 20 && p.price <= 50);
          break;
        case "over-50":
          filtered = filtered.filter((p) => p.price > 50);
          break;
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("name");
    setPriceRange("all");
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Plants</h1>
        <p className="text-muted-foreground">
          Discover our collection of premium plants for your home and garden
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-20">Under $20</SelectItem>
              <SelectItem value="20-50">$20 - $50</SelectItem>
              <SelectItem value="over-50">Over $50</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="featured">Featured First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary">Search: {searchTerm}</Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary">
              Category:{" "}
              {categories.find((c) => c.value === selectedCategory)?.label}
            </Badge>
          )}
          {priceRange !== "all" && (
            <Badge variant="secondary">Price: {priceRange}</Badge>
          )}
          {(searchTerm ||
            selectedCategory !== "all" ||
            priceRange !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} plants
        </p>
      </div>

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No plants found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={clearFilters}>Clear filters</Button>
        </div>
      )}
    </div>
  );
}
