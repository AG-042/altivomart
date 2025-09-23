"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Truck, Shield, Clock, Info, Heart, Share2, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/cart-context";
import { mediaURL } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

// Helper function to construct full image URLs
const getImageUrl = (imagePath: string) => mediaURL(imagePath);

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  // Use images array from backend or fallback to main_image
  const imageUrls = product.images?.map(img => img.image).map(mediaURL).filter(Boolean) as string[] ||
                   (product.main_image ? [getImageUrl(product.main_image)!].filter(Boolean) : []);

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
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-50">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <Link href="/" className="flex items-center text-muted hover:text-primary transition-colors group">
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {imageUrls.length > 0 ? (
              <>
                <div className="aspect-square relative overflow-hidden rounded-2xl border border-border/20 shadow-lg bg-white">
                  <motion.img
                    key={selectedImage}
                    src={imageUrls[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                  
                  {/* Image overlay with wishlist and share */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                        isWishlisted 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-all">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {imageUrls.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {imageUrls.map((image: string, index: number) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all ${
                          selectedImage === index 
                            ? "border-primary shadow-md ring-2 ring-primary/20" 
                            : "border-border/30 hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.jpg';
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-border/20">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                  </div>
                  <span className="text-gray-500 font-medium">No Image Available</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-secondary mb-2 leading-tight">{product.name}</h1>
                  {product.brand && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-muted">Brand:</span>
                      <span className="text-lg font-medium text-primary">{product.brand}</span>
                    </div>
                  )}
                </div>
                {product.featured && (
                  <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Stock Status & Rating */}
              <div className="flex items-center gap-4">
                {product.in_stock ? (
                  <span className="flex items-center gap-2 bg-success text-white text-sm font-medium px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    In Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-2 bg-danger text-white text-sm font-medium px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Out of Stock
                  </span>
                )}
                
                {/* Mock rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-sm text-muted ml-1">(4.0)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
              <div className="text-5xl font-bold text-primary mb-2">
                {product.formatted_price}
              </div>
              <p className="text-muted">Inclusive of all taxes • Pay on Delivery available</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-border/20 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Fast Delivery</p>
                  <p className="text-xs text-muted">{product.estimated_delivery_days || 3} days</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-border/20 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-muted">Pay on Delivery</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-border/20 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Trusted Service</p>
                  <p className="text-xs text-muted">Reliable quality</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-6">
              {/* Quantity Selector */}
              {product.in_stock && (
                <div className="p-6 bg-white rounded-xl border border-border/20 shadow-sm">
                  <h3 className="font-semibold mb-4 text-secondary">Quantity</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={decrementQuantity}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted">Total Price</p>
                      <p className="text-2xl font-bold text-primary">
                        ₦{(parseFloat(product.price) * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3">
                {/* Add to Cart Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleAddToCart}
                    size="lg" 
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    {product.in_stock ? `Add ${quantity} to Cart` : "Out of Stock"}
                    {quantity > 1 && (
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm font-bold">
                        {quantity}
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Order Now Button */}
                <Link href={`/checkout?product=${product.id}&quantity=${quantity}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="w-full text-lg py-6 border-2 border-primary hover:bg-primary/5"
                      disabled={!product.in_stock}
                    >
                      {product.in_stock ? "Order Now - Pay on Delivery" : "Out of Stock"}
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {!product.in_stock && (
                <p className="text-sm text-muted text-center p-4 bg-gray-50 rounded-lg">
                  This product is currently out of stock. Please check back later or contact us for updates.
                </p>
              )}
            </div>

            {/* Tags */}
            {product.tag_list && product.tag_list.length > 0 && (
              <div className="p-6 bg-white rounded-xl border border-border/20 shadow-sm">
                <h3 className="font-semibold mb-3 text-secondary">Product Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tag_list.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-primary/10 hover:to-accent/10 border border-gray-200 px-3 py-1 rounded-full text-sm transition-all cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Description and Details */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-secondary">Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted leading-relaxed text-lg">
                {product.description || "This is a high-quality product designed to meet your needs with premium materials and exceptional craftsmanship."}
              </p>
            </CardContent>
          </Card>

          {/* How to Use */}
          {product.how_to_use ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-secondary">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <Info className="h-4 w-4 text-accent" />
                  </div>
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted leading-relaxed text-lg">
                  {product.how_to_use}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-secondary">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  Product Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted">Quality assured products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted">Pay on delivery available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted">Fast and reliable delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted">Customer satisfaction guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
