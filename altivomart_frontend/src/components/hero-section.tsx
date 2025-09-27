"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, Shield, Star, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { fetchProducts, Product } from "@/lib/api";
import { mediaURL } from "@/lib/utils";

export function HeroSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  // Helper function to construct full image URL
  const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null;
    const url = mediaURL(imagePath);
    console.log('HeroSection - Image URL constructed:', { imagePath, url });
    return url;
  };

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await fetchProducts();
        console.log("Fetched products:", products);
        setFeaturedProducts(products.slice(0, 5));
        if (products.length > 0) {
          console.log("First product image URL:", products[0].main_image);
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: ""
    },
    {
      icon: Shield,
      title: "Pay on Delivery",
      description: ""
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: ""
    }
  ];

  return (
    <section className="relative min-h-[35vh] sm:min-h-[70vh] bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
      {/* Simplified background effects - hidden on mobile for performance */}
      <div className="absolute inset-0 hidden sm:block">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-20 pb-2 sm:pb-12 relative z-10">
        {/* Mobile-first layout */}
        <div className="text-center lg:text-left">
          {/* Mobile Hero Content - Clean Stacked Layout */}
          <div className="lg:hidden space-y-3">
            {/* Mobile Header */}
            <motion.div 
              className="text-white space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-center">
                  <span className="text-accent">AltivoMart</span>
                  <br />
                  <span className="text-xl md:text-2xl font-light text-white/90">
                    Home of Tools 
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-sm text-white/90 text-center leading-relaxed px-2"
                variants={itemVariants}
              >
                Professional equipment to everyday essentials — pay on delivery!
              </motion.p>
            </motion.div>

            {/* Mobile Action Buttons */}
            <motion.div 
              className="flex gap-2 px-3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link href="/products" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button className="w-full bg-white text-secondary hover:bg-white/90 text-sm px-4 py-2 shadow-lg">
                    <ShoppingBag className="mr-1 h-3 w-3" />
                    Shop
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/track" className="flex-1">
                <Button 
                  className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white hover:text-secondary text-sm px-4 py-2"
                >
                  <Search className="mr-1 h-3 w-3" />
                  Track
                </Button>
              </Link>
            </motion.div>

            {/* Mobile Features */}
            <motion.div 
              className="grid grid-cols-3 gap-2 px-3 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="bg-white/20 p-2 rounded-lg mx-auto w-fit mb-1"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-3 w-3 text-white" />
                  </motion.div>
                  <div className="text-white">
                    <h3 className="font-medium text-xs">{feature.title}</h3>
                    <p className="text-white/70 text-xs">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Product Showcase */}
            {!loading && featuredProducts.length > 0 && (
              <motion.div 
                className="relative px-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative h-[250px] bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 200 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -200 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 p-3 flex flex-col"
                    >
                      <div className="flex-1 relative mb-2">
                        {featuredProducts[currentSlide]?.main_image && !imageErrors[featuredProducts[currentSlide].id] ? (
                          <motion.div
                            className="relative w-full h-full rounded-xl overflow-hidden"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img
                              src={getImageUrl(featuredProducts[currentSlide].main_image) || ''}
                              alt={featuredProducts[currentSlide].name}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={() => {
                                setImageErrors(prev => ({
                                  ...prev,
                                  [featuredProducts[currentSlide].id]: true
                                }));
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </motion.div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                              <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600 text-sm font-medium">Product Image</p>
                              <p className="text-gray-400 text-xs">Coming Soon</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-white text-center">
                        <h3 className="text-sm font-bold line-clamp-2 mb-1">
                          {featuredProducts[currentSlide].name}
                        </h3>
                        <p className="text-accent text-lg font-bold">
                          ₦{parseFloat(featuredProducts[currentSlide].price).toLocaleString()}
                        </p>
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-300">
                            {featuredProducts[currentSlide].in_stock ? "In Stock" : "Out of Stock"}
                          </span>
                          {featuredProducts[currentSlide].brand && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 text-white/90">
                              {featuredProducts[currentSlide].brand}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <motion.button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </motion.button>
                  <motion.button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </motion.button>
                </div>

                <div className="flex justify-center space-x-1 mt-2">
                  {featuredProducts.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? "bg-accent" 
                          : "bg-white/30"
                      }`}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                <motion.div 
                  className="flex justify-center mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href={`/products/${featuredProducts[currentSlide]?.id}`}>
                    <Button 
                      variant="outline" 
                      className="border-white/50 text-white hover:bg-white hover:text-secondary backdrop-blur-md bg-white/10 text-xs px-3 py-1"
                    >
                      View Details
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Desktop Hero Content */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-white space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl font-bold leading-tight">
                  <span className="text-accent">AltivoMart</span>
                  <br />
                  <span className="text-4xl font-light text-white/90">
                    Home of Tools 
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-white/90 max-w-lg leading-relaxed"
                variants={itemVariants}
              >
                Discover the perfect products for every need! From professional-grade equipment to everyday essentials — 
                pay when your products arrive at your doorstep.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <Link href="/products">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group"
                  >
                    <Button size="lg" className="bg-white text-secondary hover:bg-white/90 text-lg px-8 py-4 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      <motion.div
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Shop Products
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
                
                <Link href="/track">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Search className="h-5 w-5" />
                    </motion.div>
                    <span className="text-lg">Track Order</span>
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
                variants={containerVariants}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-center space-x-3 group"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-white/70 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative w-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {loading ? (
                <div className="aspect-square bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : featuredProducts.length > 0 ? (
                <div className="relative w-full max-w-lg mx-auto lg:mx-0">
                  <div className="relative h-[420px] sm:h-[400px] w-full bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 p-8 flex flex-col"
                      >
                        <div className="flex-1 relative mb-6">
                          {featuredProducts[currentSlide]?.main_image && !imageErrors[featuredProducts[currentSlide].id] ? (
                            <motion.div
                              className="relative w-full h-full rounded-2xl overflow-hidden"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.3 }}
                            >
                              <img
                                src={getImageUrl(featuredProducts[currentSlide].main_image) || ''}
                                alt={featuredProducts[currentSlide].name}
                                className="absolute inset-0 w-full h-full object-cover"
                                onLoad={() => {
                                  console.log('Image loaded successfully:', getImageUrl(featuredProducts[currentSlide].main_image || null));
                                }}
                                onError={() => {
                                  console.log('Image failed to load:', getImageUrl(featuredProducts[currentSlide].main_image || null));
                                  setImageErrors(prev => ({
                                    ...prev,
                                    [featuredProducts[currentSlide].id]: true
                                  }));
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </motion.div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                              <div className="text-center">
                                <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 text-lg font-medium">Product Image</p>
                                <p className="text-gray-400 text-sm mt-1">Coming Soon</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-white space-y-3">
                          <motion.h3 
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            {featuredProducts[currentSlide].name}
                          </motion.h3>
                          <motion.p 
                            className="text-accent text-3xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            ₦{parseFloat(featuredProducts[currentSlide].price).toLocaleString()}
                          </motion.p>
                          <motion.div
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                              {featuredProducts[currentSlide].in_stock ? "In Stock" : "Out of Stock"}
                            </span>
                            {featuredProducts[currentSlide].brand && (
                              <span className="px-3 py-1 rounded-full text-sm bg-white/20 text-white/90 border border-white/30">
                                {featuredProducts[currentSlide].brand}
                              </span>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <motion.button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </motion.button>
                  </div>

                  <div className="flex justify-center space-x-2 mt-6">
                    {featuredProducts.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? "bg-accent shadow-lg shadow-accent/50" 
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>

                  <motion.div 
                    className="flex justify-center mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link href={`/products/${featuredProducts[currentSlide]?.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          className="border-white text-white hover:bg-white hover:text-secondary backdrop-blur-md bg-white/10"
                        >
                          View Product Details
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="aspect-square bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center w-full max-w-lg mx-auto lg:mx-0">
                  <p className="text-white/70">No featured products available</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
