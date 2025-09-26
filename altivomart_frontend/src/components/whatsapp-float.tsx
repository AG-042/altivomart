"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppFloat() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1 
      }}
    >
      <motion.a
        href="https://wa.me/2349132780502?text=Hello%2C%20I%20need%20help%20finding%20the%20right%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 group-hover:animate-pulse" />
      </motion.a>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-green-500 rounded-full opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
