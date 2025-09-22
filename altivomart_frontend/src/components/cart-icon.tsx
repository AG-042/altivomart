"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className = "text-white hover:text-accent" }: CartIconProps) {
  const { itemCount } = useCart();

  return (
    <Link href="/cart">
      <motion.div
        className={`relative p-2 transition-colors ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={itemCount > 0 ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          <ShoppingCart className="h-6 w-6" />
        </motion.div>
        
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15 
              }}
              className="absolute -top-1 -right-1 bg-danger text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] shadow-lg"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
