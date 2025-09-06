"use client";

import type React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit, Trash2, Search, Upload, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import type { Product } from "@/components/product-card";

export default function AdminProductsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: { imageUrl: "" }, // for preview
    file: null as File | null, // actual file for backend
    featured: false,
    sale: false,
    salePrice: "",
    discountPercentage: "",
  });

  const [categories, setCategories] = useState<
    { _id: string; name: string; description: string }[]
  >([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/plants`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: { imageUrl: "" },
      file: null,
      featured: false,
      sale: false,
      salePrice: "",
      discountPercentage: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.categoryId._id,
      stock: product.stock.toString(),
      image: { imageUrl: product.image?.imageUrl || "" }, // preview existing
      file: null, // reset file
      featured: product.featured ?? false,
      sale: product.sale ?? false,
      salePrice: product.salePrice?.toString() || "",
      discountPercentage: product.discountPercentage?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  // ✅ Real file upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // keep actual file + preview URL
    setFormData((prev) => ({
      ...prev,
      file,
      image: { imageUrl: URL.createObjectURL(file) },
    }));
  };

  // ✅ Save product (with real file upload + progress tracking)
  const handleSaveProduct = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "category") {
            fd.append("categoryId", String(value));
          } else if (key === "sale" || key === "featured") {
            fd.append(key, value ? "true" : "false");
          } else if (key === "file" && value) {
            fd.append("plant_image", value as File); // ✅ multer expects this
          } else if (key !== "image") {
            fd.append(key, String(value));
          }
        }
      });

      if (editingProduct) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/plants/${editingProduct._id}`,
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
              );
              setUploadProgress(percent);
            },
          }
        );
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/plants`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            setUploadProgress(percent);
          },
        });
      }

      // refresh products
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plants`);
      setProducts(res.data);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/plants/${productId}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Plant Management</h1>
          <p className="text-muted-foreground">
            Complete CRUD control over your plant inventory
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Plant
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search plants by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product._id}>
            <CardHeader className="pb-3">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src={product.image.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.featured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      Featured
                    </Badge>
                  )}
                  {product.sale && (
                    <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    {product.sale ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          ${product.salePrice?.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline">{product.categoryId.name}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Plant" : "Add New Plant"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the plant information below."
                : "Fill in the product details."}
            </DialogDescription>
          </DialogHeader>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter plant name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter detailed description"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, featured: !!checked }))
                }
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sale"
                checked={formData.sale}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, sale: !!checked }))
                }
              />
              <Label htmlFor="sale">On Sale</Label>
            </div>

            {formData.sale && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salePrice: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount %</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountPercentage: e.target.value,
                      }))
                    }
                    placeholder="e.g. 10"
                  />
                </div>
              </>
            )}

            {/* Upload + Preview */}
            <div className="space-y-2 md:col-span-2">
              <Label>Upload Image from Computer</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Choose File"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              {formData.image.imageUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                    <Image
                      src={formData.image.imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          file: null,
                          image: { imageUrl: "" },
                        }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={!formData.name || !formData.price || !formData.category}
            >
              {editingProduct ? "Update Plant" : "Add Plant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
