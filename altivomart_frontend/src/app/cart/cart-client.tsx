"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { mediaURL } from "@/lib/utils";

// Product Image Component with proper error handling
function ProductImage({ product, className }: { product: any; className: string }) {
  const [imageError, setImageError] = useState(false);
  
  const getImageUrl = () => {
    // Try multiple image sources
    const sources = [
      product.main_image,
      product.images?.[0]?.image,
      product.all_images?.[0]
    ].filter(Boolean);
    
    return sources[0] ? mediaURL(sources[0]) : null;
  };

  const imageUrl = getImageUrl();

  if (!imageUrl || imageError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 rounded"></div>
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={product.name}
      fill
      className={`object-cover ${className}`}
      unoptimized={true}
      onError={() => setImageError(true)}
    />
  );
}

export function CartClient() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleQuantityInput = (productId: number, value: string) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return;
    handleQuantityChange(productId, Math.max(1, parsed));
  };

  const handleClearCart = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to clear your cart?');
      if (!confirmed) return;
    }
    clearCart();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getEstimatedDeliveryRange = () => {
    if (!items || items.length === 0) return null;
    const maxDays = Math.max(
      ...items.map((i) => i.product.estimated_delivery_days || 3)
    );
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + maxDays);
    const startStr = start.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-secondary mb-4">
              Your cart is empty
            </h1>
            <p className="text-muted text-lg mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/products" className="flex items-center text-muted hover:text-primary mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-secondary">
            Shopping Cart ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 relative overflow-hidden rounded-lg border border-border bg-gray-50">
                        <ProductImage 
                          product={item.product} 
                          className="w-full h-full" 
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-semibold text-secondary hover:text-primary transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted mt-1">{item.product.brand}</p>
                      <p className="text-lg font-bold text-primary mt-2">
                        {item.product.formatted_price}
                      </p>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleQuantityInput(item.product.id, e.target.value)}
                          className="w-14 text-center outline-none border-l border-r border-border h-8"
                          aria-label="Quantity"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-sm text-muted">
                      Subtotal: {item.quantity} × {item.product.formatted_price}
                    </span>
                    <span className="font-semibold text-lg">
                      {formatPrice(parseFloat(item.product.price) * item.quantity)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-danger hover:text-danger hover:bg-danger/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Items</span>
                    <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span className="text-success">Free</span>
                  </div>
                  {getEstimatedDeliveryRange() && (
                    <div className="flex justify-between text-sm">
                      <span>Estimated Delivery</span>
                      <span>{getEstimatedDeliveryRange()}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/checkout" className="w-full">
                    <Button size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <div className="text-center">
                    <p className="text-xs text-muted">
                      Pay on delivery available
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Free delivery nationwide</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Pay when you receive</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>2-5 days delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
