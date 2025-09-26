import { CheckoutForm } from "../../components/checkout-form";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Checkout</h1>
          <p className="text-muted">Complete your product order with pay-on-delivery</p>
        </div>
        <Suspense fallback={<div className="text-center text-muted">Loading...</div>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  );
}
