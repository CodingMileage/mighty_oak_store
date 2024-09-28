// src/components/CheckoutButton.tsx
"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  items: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ items }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const { id } = await response.json();
      const stripe = (await import("@stripe/stripe-js")).default; // Dynamic import
      const stripeInstance = await stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      await stripeInstance.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-primary sm:w-[200px] ${loading ? "loading" : ""}`}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
};

export default CheckoutButton;
