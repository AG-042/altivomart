"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/cart-icon";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/track", label: "Track Order" },
    { href: "/how-to-use", label: "How to Use" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" 
          : "bg-secondary text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-20">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/" 
              className={`text-xl sm:text-3xl font-bold transition-colors duration-300 ${
                isScrolled 
                  ? "text-secondary hover:text-primary" 
                  : "text-white hover:text-accent"
              }`}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Altivomart
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={item.href} className="relative px-6 py-3 group">
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isScrolled 
                      ? (isActive(item.href) ? "text-primary" : "text-gray-700 hover:text-primary")
                      : (isActive(item.href) ? "text-accent" : "text-white hover:text-accent")
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isScrolled ? "bg-primary" : "bg-accent"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Hover indicator */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isScrolled ? "bg-primary/30" : "bg-accent/30"
                    }`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: isActive(item.href) ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Bar */}
            <motion.div 
              className="relative"
              animate={{ width: searchFocused ? 280 : 240 }}
              transition={{ duration: 0.3 }}
            >
              <motion.input
                type="text"
                placeholder="Search products..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm transition-all duration-300 border-2 ${
                  isScrolled
                    ? "bg-gray-50 text-gray-900 border-gray-200 focus:border-primary focus:bg-white"
                    : "bg-white/10 text-white placeholder-white/70 border-white/20 focus:border-accent focus:bg-white/20"
                } focus:outline-none focus:ring-0`}
                whileFocus={{ scale: 1.02 }}
              />
              <Search className={`absolute left-3 top-3 h-4 w-4 transition-colors ${
                isScrolled ? "text-gray-400" : "text-white/70"
              }`} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CartIcon 
                className={isScrolled 
                  ? "text-gray-600 hover:text-primary" 
                  : "text-white hover:text-accent"
                }
              />
            </motion.div>
          </div>

          {/* Mobile actions: cart + menu button */}
          <div className="md:hidden flex items-center gap-1">
            <CartIcon 
              className={isScrolled 
                ? "text-gray-600 hover:text-primary" 
                : "text-white hover:text-accent"
              }
            />
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                isScrolled 
                  ? "text-gray-600 hover:text-primary hover:bg-gray-100" 
                  : "text-white hover:text-accent hover:bg-white/10"
              }`}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.div 
              className={`px-4 pt-2 pb-6 space-y-1 ${
                isScrolled ? "bg-white border-t border-gray-200" : "bg-secondary/95"
              }`}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Mobile Navigation Links */}
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (index * 0.05) }}
                >
                
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isScrolled
                        ? (isActive(item.href) ? "text-primary bg-primary/10" : "text-gray-700 hover:text-primary hover:bg-gray-50")
                        : (isActive(item.href) ? "text-accent bg-white/10" : "text-white hover:text-accent hover:bg-white/10")
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Search */}
              <motion.div 
                className="px-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-colors ${
                      isScrolled
                        ? "bg-gray-50 text-gray-900 border border-gray-200 focus:border-primary"
                        : "bg-white/10 text-white placeholder-white/70 border border-white/20 focus:border-accent"
                    } focus:outline-none focus:ring-0`}
                  />
                  <Search className={`absolute left-3 top-3.5 h-4 w-4 ${
                    isScrolled ? "text-gray-400" : "text-white/70"
                  }`} />
                </div>
              </motion.div>

              {/* Mobile Action Buttons */}
              <motion.div 
                className="flex items-center justify-center space-x-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-center">
                  <CartIcon 
                    className={isScrolled 
                      ? "text-gray-600 hover:text-primary" 
                      : "text-white hover:text-accent"
                    }
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
