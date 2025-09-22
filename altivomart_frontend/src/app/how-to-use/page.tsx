import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ShoppingCart, CreditCard, Package, Truck, CheckCircle, Clock, BadgeCheck, Fingerprint } from "lucide-react";

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-secondary mb-2">How to Use Altivomart</h1>
          <p className="text-muted">From discovering products to tracking delivery — everything you need, step-by-step.</p>
        </div>

        {/* Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-primary" /> Browse Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted">
              <p>Go to the Products page to explore all items. Use search, filters, and sorting to find the right product.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Search by name, brand, or tags</li>
                <li>Filter by category</li>
                <li>Sort by price or newest</li>
              </ul>
              <Link href="/products"><Button variant="outline" className="mt-2">Explore Products</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-primary" /> Add to Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted">
              <p>Open a product to view details and click “Add to Cart”. Manage quantities on the Cart page.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Increase/decrease quantity with +/−</li>
                <li>Directly edit quantity using the number field</li>
                <li>Remove items or clear cart (with confirmation)</li>
              </ul>
              <Link href="/cart"><Button variant="outline" className="mt-2">Go to Cart</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Checkout (Pay on Delivery)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted">
              <p>On the Checkout page, provide delivery details. No online payment required — you pay when your order arrives.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Enter name, phone, and address (city, state, landmark optional)</li>
                <li>Single-product checkout supported via the “Buy Now” flow</li>
                <li>See a live total and summary of items</li>
              </ul>
              <Link href="/checkout"><Button variant="outline" className="mt-2">Proceed to Checkout</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Fingerprint className="h-5 w-5 text-primary" /> Get Your Tracking Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted">
              <p>After placing your order, you’ll see a confirmation with a unique tracking code. Keep it safe.</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Tracking code looks like ABC123XYZ0</li>
                <li>It’s also visible in the admin under the order details</li>
                <li>You can copy it and share with support if needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Details */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-primary" /> How Tracking Works</CardTitle>
          </CardHeader>
          <CardContent className="text-muted space-y-4">
            <p>Use your tracking code to check live delivery progress. We create basic delivery info as soon as the order is placed, so tracking is available immediately.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-secondary">Track With Code</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Visit the Track page</li>
                  <li>Enter your tracking code (e.g., ABC123XYZ0)</li>
                  <li>View order status, estimated delivery, attempts, and notes</li>
                </ul>
                <Link href="/track"><Button className="mt-2">Open Track Page</Button></Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-secondary">Delivery Stages</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Order Confirmed (pending)</li>
                  <li className="flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Assigned / Picked Up</li>
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> In Transit / Out for Delivery</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Delivered</li>
                </ul>
              </div>
            </div>
            <p className="text-xs">Note: If tracking shows “not available yet”, it usually means delivery details haven’t been updated. For new orders, this initializes automatically; for older orders, it appears once delivery info is created.</p>
          </CardContent>
        </Card>

        {/* What to Expect on Delivery */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> From Order to Delivery</CardTitle>
          </CardHeader>
          <CardContent className="text-muted">
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Place your order and receive the tracking code on the confirmation screen</li>
              <li>We assign delivery and estimate your delivery date</li>
              <li>Order moves to In Transit or Out for Delivery near your location</li>
              <li>Courier arrives; pay on delivery and receive your items</li>
              <li>Status updates to Delivered in your tracking view</li>
            </ol>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tips for Faster Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-muted text-sm space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide a complete address with a clear landmark</li>
                <li>Keep your phone reachable for courier calls</li>
                <li>Use the tracking code to check ETA before contacting support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted text-sm space-y-3">
              <p>Can’t find your tracking code or have a delivery question?</p>
              <div className="flex gap-2">
                <Link href="/contact"><Button>Contact Us</Button></Link>
                <Link href="/track"><Button variant="outline">Track Order</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 