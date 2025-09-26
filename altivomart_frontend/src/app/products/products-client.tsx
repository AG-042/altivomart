"use client";

import { useState, useEffect } from "react";
import { Product, fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Grid, List } from "lucide-react";

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tag_list.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category_name === selectedCategory
      );
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const categories = Array.from(
    new Set(products.map(product => product.category_name))
  ).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center py-8 sm:py-12">
            <p className="text-base sm:text-lg text-muted">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-danger text-base sm:text-lg mb-2">{error}</p>
            <p className="text-xs sm:text-sm text-muted">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary mb-1 sm:mb-2">
            All Products
          </h1>
          <p className="text-sm sm:text-base text-muted">
            Discover our complete collection of quality products
          </p>
        </div>

        {/* Filters and Search - Mobile Optimized */}
        <Card className="mb-4 sm:mb-8">
          <CardContent className="p-3 sm:p-6">
            {/* Mobile Layout: Stack vertically */}
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {/* Search - Full width on mobile */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm sm:text-base border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Mobile: Two columns for selects */}
              <div className="grid grid-cols-2 gap-2 sm:contents">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 sm:px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary truncate"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 sm:px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary truncate"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* View Mode - Full width on mobile, centered */}
              <div className="flex gap-2 justify-center sm:justify-start">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-4 sm:px-3"
                >
                  <Grid className="h-4 w-4 mr-1 sm:mr-0" />
                  <span className="sm:hidden">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-4 sm:px-3"
                >
                  <List className="h-4 w-4 mr-1 sm:mr-0" />
                  <span className="sm:hidden">List</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 px-1">
          <p className="text-xs sm:text-sm text-muted">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List - Mobile Optimized */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-muted text-base sm:text-lg">No products found matching your criteria.</p>
            <p className="text-xs sm:text-sm text-muted mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              : "space-y-3 sm:space-y-4"
          }>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
