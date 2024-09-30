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
  };

  return (
    <button
      className={`btn btn-primary sm:w-[200px] ${loading ? "loading" : ""}`}
      // onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
};

export default CheckoutButton;
