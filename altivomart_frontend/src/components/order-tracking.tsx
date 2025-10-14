"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchOrderDetails, trackDelivery, Order, DeliveryTracking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

export function OrderTracking() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || searchParams.get("order");

  const [trackingCode, setTrackingCode] = useState(initialCode || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<DeliveryTracking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      handleTrackOrder();
    }
  }, [initialCode]);

  const handleTrackOrder = async () => {
    if (!trackingCode) {
      setError("Please enter a tracking code");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);
    setDelivery(null);

    try {
      // Check if input is a number (Order ID) or string (Tracking Code)
      const isOrderId = /^\d+$/.test(trackingCode);
      
      let orderData;
      if (isOrderId) {
        // Track by Order ID
        orderData = await fetchOrderDetails(parseInt(trackingCode));
      } else {
        // Track by Tracking Code - use delivery tracking endpoint which accepts codes
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/orders/track/${trackingCode}/`);
        
        if (response.ok) {
          const deliveryData = await response.json();
          if (deliveryData && deliveryData.order_id) {
            // Now fetch full order details using the order_id
            orderData = await fetchOrderDetails(deliveryData.order_id);
            setDelivery(deliveryData);
          }
        }
      }
      
      if (orderData) {
        setOrder(orderData);
        
        // Try to get delivery tracking info if not already fetched
        if (!delivery) {
          try {
            const deliveryData = await trackDelivery(orderData.id);
            if (deliveryData) {
              setDelivery(deliveryData);
            }
          } catch (deliveryError) {
            // Delivery tracking might not be available yet
            console.log("Delivery tracking not available yet");
          }
        }
      } else {
        setError("Order not found. Please check your tracking code.");
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setError("Failed to track order. Please check your tracking code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-accent" />;
      case "on_delivery":
        return <Truck className="h-5 w-5 text-primary" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Package className="h-5 w-5 text-muted" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Confirmed";
      case "on_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case "assigned":
        return "Delivery Assigned";
      case "picked_up":
        return "Package Picked Up";
      case "in_transit":
        return "In Transit";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "failed":
        return "Delivery Failed";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Tracking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="trackingCode">Tracking Code or Order ID</Label>
              <Input
                id="trackingCode"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="e.g., U1SSJ8FGHY or 14"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleTrackOrder} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  "Track Order"
                )}
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-danger text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Order Details */}
      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span>#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{order.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="text-primary font-semibold">₦{parseFloat(order.total_price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Delivery Address:</h4>
                <p className="text-sm text-muted">
                  {order.address}
                  {order.city && `, ${order.city}`}
                  {order.state && `, ${order.state}`}
                  {order.landmark && (
                    <>
                      <br />
                      <span className="text-xs">Near: {order.landmark}</span>
                    </>
                  )}
                </p>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Items Ordered:</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-primary">₦{parseFloat(item.total_price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Status */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Status */}
                <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-lg">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-semibold text-primary">{getStatusText(order.status)}</p>
                    <p className="text-sm text-muted">Current order status</p>
                  </div>
                </div>

                {/* Delivery Information */}
                {delivery && (
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Delivery Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Delivery Status:</span>
                          <span className="text-primary">{getDeliveryStatusText(delivery.delivery_status)}</span>
                        </div>
                        
                        {delivery.tracking_number && (
                          <div className="flex justify-between">
                            <span className="font-medium">Tracking Number:</span>
                            <span>{delivery.tracking_number}</span>
                          </div>
                        )}
                        
                        {delivery.estimated_delivery && (
                          <div className="flex justify-between">
                            <span className="font-medium">Estimated Delivery:</span>
                            <span>{new Date(delivery.estimated_delivery).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {delivery.delivery_attempts > 0 && (
                          <div className="flex justify-between">
                            <span className="font-medium">Delivery Attempts:</span>
                            <span>{delivery.delivery_attempts}</span>
                          </div>
                        )}
                        
                        {delivery.delivery_notes && (
                          <div>
                            <span className="font-medium block mb-1">Delivery Notes:</span>
                            <p className="text-sm text-muted">{delivery.delivery_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Timeline */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Order Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-muted">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {order.status !== "pending" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <div>
                          <p className="font-medium">Order Confirmed</p>
                          <p className="text-sm text-muted">Order processing started</p>
                        </div>
                      </div>
                    )}
                    
                    {order.status === "on_delivery" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium">Out for Delivery</p>
                          <p className="text-sm text-muted">Your order is on the way</p>
                        </div>
                      </div>
                    )}
                    
                    {order.status === "delivered" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <div>
                          <p className="font-medium">Delivered</p>
                          <p className="text-sm text-muted">
                            {order.delivered_at ? new Date(order.delivered_at).toLocaleString() : "Package delivered"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
