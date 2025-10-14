"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProduct, createOrder, Product, OrderRequest } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { mediaURL } from "@/lib/utils";

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("product");
  const { items, total, clearCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    customer_email: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    delivery_instructions: "",
    quantity: 1,
  });

  useEffect(() => {
    if (success) {
      return;
    }
    const loadProduct = async () => {
      try {
        setLoading(true);
        if (productId) {
          // Single product checkout
          const productData = await fetchProduct(productId);
          setProduct(productData);
        } else if (items.length === 0) {
          // No items in cart, redirect to products
          router.push('/products');
          return;
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, items.length, router, success]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Prepare order items outside try block so it's accessible in catch
    let orderItems;
    if (product) {
      // Single product checkout
      orderItems = [{
        product_id: product.id,
        quantity: formData.quantity,
      }];
    } else {
      // Cart checkout
      orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));
    }

    const orderData: OrderRequest = {
      customer_name: formData.customer_name,
      phone_number: formData.phone_number,
      customer_email: formData.customer_email || undefined,
      address: formData.address,
      city: formData.city || undefined,
      state: formData.state || undefined,
      landmark: formData.landmark || undefined,
      delivery_instructions: formData.delivery_instructions || undefined,
      items: orderItems,
    };

    try {
      console.log('Creating order with data:', orderData);
      const order = await createOrder(orderData);
      console.log('Order created successfully:', order);
      
      if (order) {
        setOrderId(order.id);
        setTrackingCode(order.tracking_code);
        setSuccess(true);
        // Clear cart if it was a cart checkout
        if (!product && items.length > 0) {
          clearCart();
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        orderData
      });
      
      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : "Failed to create order";
      setError(`Order creation failed: ${errorMessage}. Please check all required fields.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success && orderId) {
    return (
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2">Order Placed Successfully!</h2>
            <p className="text-muted mb-2">
              Your order #{orderId} has been placed. You will receive a confirmation call shortly.
            </p>
            {trackingCode && (
              <p className="text-sm text-muted mb-6">
                Tracking Code: <span className="font-mono font-semibold">{trackingCode}</span>
              </p>
            )}
            <div className="space-y-4">
              <Button 
                onClick={() => trackingCode ? router.push(`/track?code=${encodeURIComponent(trackingCode)}`) : router.push(`/track?order=${orderId}`)}
                className="w-full"
              >
                Track Your Order
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="pt-6">
            <AlertCircle className="h-16 w-16 text-danger mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2">Error</h2>
            <p className="text-muted mb-6">{error}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if we have either a product or cart items
  if (!product && (!items || items.length === 0)) {
    return (
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="pt-6">
            <AlertCircle className="h-16 w-16 text-warning mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2">No Items to Checkout</h2>
            <p className="text-muted mb-6">Your cart is empty. Add some products to continue.</p>
            <Button onClick={() => router.push("/products")} className="w-full">
              Shop Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    if (product) {
      // Single product checkout
      return parseFloat(product.price) * formData.quantity;
    } else {
      // Cart checkout
      return items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
    }
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {product ? (
            // Single product checkout
            <>
              <div className="flex items-center space-x-4">
                {product.main_image && (
                  <img 
                    src={mediaURL(product.main_image) || ""} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted">{product.formatted_price} each</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                      className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{formData.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                      className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Cart checkout
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4">
                  {item.product.main_image && (
                    <img 
                      src={mediaURL(item.product.main_image) || ""} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-xs text-muted">
                      {item.product.formatted_price} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    ₦{(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-primary">₦{totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted mt-1">Pay on delivery</p>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Full Name *</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  placeholder="+234 123 456 7890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">Email (optional)</Label>
              <Input
                id="customer_email"
                name="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={handleInputChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="e.g., Plot 155, Hillstone, Life Camp, Abuja"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Abuja"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g., FCT"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="e.g., Near Shoprite, Jabi Lake Mall"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="delivery_instructions"
                name="delivery_instructions"
                value={formData.delivery_instructions}
                onChange={handleInputChange}
                placeholder="Any special instructions for delivery..."
                rows={2}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>

            <p className="text-xs text-muted text-center">
              By placing this order, you agree to pay ₦{totalPrice.toLocaleString()} when your order is delivered.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
