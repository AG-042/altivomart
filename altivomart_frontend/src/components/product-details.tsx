"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Truck, Shield, Clock, Info, Heart, Share2, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/cart-context";
import { mediaURL } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

// Helper function to construct full image URLs
const getImageUrl = (imagePath: string) => mediaURL(imagePath);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3
    }
  })
};

const floatingAnimation = {
  y: [-2, 2, -2],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const { addItem } = useCart();
  
  // Combine images and videos into a single media array
  const mediaItems = [
    // Add images first
    ...(product.images?.map(img => ({
      type: 'image' as const,
      url: mediaURL(img.image),
      alt: img.alt_text || product.name,
      id: `img-${img.id}`
    })) || []),
    // Add videos
    ...(product.videos?.map(video => ({
      type: 'video' as const,
      url: mediaURL(video.video),
      title: video.title || 'Product Video',
      description: video.description,
      autoplay: video.autoplay,
      loop: video.loop,
      muted: video.muted,
      controls: video.show_controls,
      id: `vid-${video.id}`
    })) || [])
  ].filter(item => item.url);

  // Fallback to main_image if no media items
  if (mediaItems.length === 0 && product.main_image) {
    mediaItems.push({
      type: 'image' as const,
      url: getImageUrl(product.main_image)!,
      alt: product.name,
      id: 'main-img'
    });
  }

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

  // Carousel navigation functions
  const goToPrevious = () => {
    setDirection(-1);
    setSelectedMediaIndex(prev => 
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
    setSelectedMediaIndex(prev => 
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > selectedMediaIndex ? 1 : -1);
    setSelectedMediaIndex(index);
  };

  // Touch/Swipe handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && mediaItems.length > 1) {
      goToNext();
    }
    if (isRightSwipe && mediaItems.length > 1) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (mediaItems.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Home':
          event.preventDefault();
          setSelectedMediaIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setSelectedMediaIndex(mediaItems.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaItems.length]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || mediaItems.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      goToNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, mediaItems.length, selectedMediaIndex, isHovered]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background to-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Background with floating animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" 
        animate={{
          y: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center mb-8"
        >
          <Link href="/" className="flex items-center text-muted hover:text-primary transition-colors group">
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          variants={containerVariants}
        >
          {/* Product Images */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {mediaItems.length > 0 ? (
              <>
                <div 
                  className="aspect-square relative overflow-hidden rounded-2xl border border-border/20 shadow-lg bg-white group cursor-pointer"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <AnimatePresence mode="wait">
                    {mediaItems[selectedMediaIndex].type === 'image' ? (
                      <motion.img
                        key={`img-${selectedMediaIndex}`}
                        initial={{ opacity: 0, x: direction > 0 ? 300 : -300, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: direction < 0 ? 300 : -300, scale: 0.8 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                        src={mediaItems[selectedMediaIndex].url || ''}
                        alt={mediaItems[selectedMediaIndex].alt || product.name}
                        className="w-full h-full object-cover absolute inset-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.jpg';
                        }}
                      />
                    ) : (
                      <motion.video
                        key={`video-${selectedMediaIndex}`}
                        initial={{ opacity: 0, x: direction > 0 ? 300 : -300, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: direction < 0 ? 300 : -300, scale: 0.8 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full h-full object-cover absolute inset-0"
                        autoPlay={mediaItems[selectedMediaIndex].autoplay}
                        loop={mediaItems[selectedMediaIndex].loop}
                        muted={mediaItems[selectedMediaIndex].muted}
                        controls={mediaItems[selectedMediaIndex].controls}
                        playsInline
                        onError={(e) => {
                          console.error('Video failed to load:', e);
                        }}
                      >
                        <source src={mediaItems[selectedMediaIndex].url || ''} type="video/mp4" />
                        Your browser does not support the video tag.
                      </motion.video>
                    )}
                  </AnimatePresence>
                  
                  {/* Carousel Navigation Arrows */}
                  {mediaItems.length > 1 && (
                    <>
                      <motion.button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Previous media"
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-700" />
                      </motion.button>
                      <motion.button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Next media"
                      >
                        <ChevronRight className="h-6 w-6 text-gray-700" />
                      </motion.button>
                    </>
                  )}

                  {/* Media overlay with wishlist and share */}
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

                  {/* Media counter and type indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                      {mediaItems[selectedMediaIndex].type === 'video' ? '🎬 Video' : '📷 Photo'}
                    </span>
                    {mediaItems.length > 1 && (
                      <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                        {selectedMediaIndex + 1} / {mediaItems.length}
                      </span>
                    )}
                  </div>

                  {/* Auto-play toggle (only show if multiple media items) */}
                  {mediaItems.length > 1 && (
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                          isAutoPlaying 
                            ? 'bg-primary text-white' 
                            : 'bg-black/50 text-white hover:bg-black/70'
                        }`}
                        title={isAutoPlaying ? 'Stop auto-play' : 'Start auto-play'}
                      >
                        {isAutoPlaying ? (
                          <div className="w-3 h-3 bg-current rounded-sm"></div>
                        ) : (
                          <div className="w-0 h-0 border-l-[6px] border-l-current border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                {mediaItems.length > 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-3">
                      {mediaItems.map((media, index: number) => (
                        <motion.button
                          key={media.id}
                          onClick={() => setSelectedMediaIndex(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                            selectedMediaIndex === index 
                              ? "border-primary shadow-lg ring-2 ring-primary/20 transform scale-105" 
                              : "border-border/30 hover:border-primary/50"
                          }`}
                        >
                          {media.type === 'image' ? (
                            <img
                              src={media.url || ''}
                              alt={media.alt || `${product.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-product.jpg';
                              }}
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <video
                                src={media.url || ''}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                              {/* Video play indicator */}
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                                  <div className="w-0 h-0 border-l-[6px] border-l-black border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Type indicator for thumbnails */}
                          <div className="absolute top-1 right-1">
                            <span className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                              {media.type === 'video' ? '🎬' : '📷'}
                            </span>
                          </div>

                          {/* Selected indicator */}
                          {selectedMediaIndex === index && (
                            <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg">
                              <div className="absolute top-1 left-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Carousel dots indicator */}
                    <div className="flex justify-center gap-2">
                      {mediaItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedMediaIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            selectedMediaIndex === index 
                              ? "bg-primary w-8" 
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          aria-label={`Go to media ${index + 1}`}
                        />
                      ))}
                    </div>
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
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
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
            </motion.div>

            {/* Price */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="text-5xl font-bold text-primary mb-2">
                {product.formatted_price}
              </div>
              <p className="text-muted">Inclusive of all taxes • Pay on Delivery available</p>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, staggerChildren: 0.1 }}
            >
              <motion.div 
                className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-border/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              >
                <motion.div 
                  className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Truck className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <p className="font-medium text-sm">Fast Delivery</p>
                  <p className="text-xs text-muted">{product.estimated_delivery_days || 3} days</p>
                </div>
              </motion.div>
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
            </motion.div>

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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
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
              <motion.div 
                className="pt-4 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <h4 className="text-sm font-medium text-gray-500 mb-3">Related Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.tag_list.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

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

        {/* Product Details and Benefits */}
        {((product.product_details && product.product_details.length > 0) || (product.product_benefits && product.product_benefits.length > 0)) && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Product Details */}
            {product.product_details && product.product_details.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold text-secondary">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.product_details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Product Benefits */}
            {product.product_benefits && product.product_benefits.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold text-secondary">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    Product Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.product_benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
