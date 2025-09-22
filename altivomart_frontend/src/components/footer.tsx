"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Company Info */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-2xl font-bold mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Altivomart
            </motion.h3>
            <motion.p 
              className="text-gray-300 mb-4"
              variants={itemVariants}
            >
              Your trusted e-commerce platform in Nigeria. We deliver quality products 
              right to your doorstep with our reliable pay-on-delivery service.
            </motion.p>
            <motion.div 
              className="space-y-2"
              variants={containerVariants}
            >
              <motion.div 
                className="flex items-center space-x-2"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">+234 (0) 123 456 7890</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@altivomart.com</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Lagos, Nigeria</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link href="/" className="text-gray-300 hover:text-accent transition-colors">
                    Home
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link href="/products" className="text-gray-300 hover:text-accent transition-colors">
                    All Products
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link href="/track" className="text-gray-300 hover:text-accent transition-colors">
                    Track Order
                  </Link>
                </motion.div>
              </li>
             
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
             
              
              <li>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors">
                    Contact Us
                  </Link>
                </motion.div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="border-t border-gray-600 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Altivomart. All rights reserved. Made with ❤️ for Nigeria.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
