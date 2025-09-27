"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { ShoppingCart, ShoppingBag, Plus, Minus, Star, Eye } from "lucide-react";
import { mediaURL } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Helper function to construct full image URL with multiple fallbacks
  const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null;
    const url = mediaURL(imagePath);
    console.log('ProductCard - Image URL constructed:', { imagePath, url });
    return url;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10)); // Max 10 items
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)); // Min 1 item
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border bg-white">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.main_image && !imageError ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <img
                src={getImageUrl(product.main_image) || ''}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={() => {
                  console.log('Product image loaded:', getImageUrl(product.main_image || ''));
                }}
                onError={() => {
                  console.log('Product image failed to load:', getImageUrl(product.main_image || ''));
                  setImageError(true);
                }}
              />
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            </div>
          )}
          
          {/* Simple Stock Status Badge */}
          <div className="absolute top-2 right-2">
            {product.in_stock ? (
              <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="bg-danger text-white text-xs px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Featured Badge - Same design as product details */}
          {product.featured && (
            <div className="absolute top-2 left-2">
              <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-2">
          <h3 className="font-semibold text-secondary  line-clamp-2 h-12">
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-600">
              {product.brand}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {product.formatted_price}
            </span>
            {product.estimated_delivery_days && (
              <span className="text-xs text-gray-500">
                {product.estimated_delivery_days} days
              </span>
            )}
          </div>

          {/* Simple Quantity Selector */}
          {product.in_stock && (
            <div className="flex items-center justify-start space-x-2 mt-3">
              <span className="text-sm text-gray-600">Qty:</span>
              <button
                onClick={decrementQuantity}
                className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
         
        </CardContent>

        
        <CardFooter className="p-4 pt-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
          <div className="flex gap-3 w-full">
            <Link href={`/products/${product.id}`} className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary font-medium transition-all duration-300 shadow-sm hover:shadow-md" 
                  disabled={!product.in_stock}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </motion.div>
            </Link>
            
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
                {quantity > 1 && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {quantity}
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
