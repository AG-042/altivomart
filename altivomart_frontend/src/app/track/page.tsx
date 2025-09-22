import { OrderTracking } from "@/components/order-tracking";

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Track Your Order</h1>
          <p className="text-muted">Enter your order details to track delivery status</p>
        </div>
        <OrderTracking />
      </div>
    </div>
  );
}
