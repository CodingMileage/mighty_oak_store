"use client";

import { useState, useTransition } from "react";
import { incrementProductQuantity } from "./actions";
import { Button } from "@/components/ui/button";

interface AddToCartProps {
  productId: string;
  incrementProductQuantity: (productId: String) => Promise<void>;
}

export default function AddToCart({ productId }: AddToCartProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  console.log(productId);

  return (
    <div className="flex w-full items-center gap-2">
      <Button
        className="w-full text-white rounded-full bg-emerald-600 hover:bg-emerald-500 text-lg font-bold tracking-tight"
        onClick={() => {
          setSuccess(false);
          startTransition(async () => {
            await incrementProductQuantity(productId);
            setSuccess(true);
          });
        }}
      >
        Add to cart
      </Button>
      {isPending && <span className="loading loading-spinner loading-md" />}
      {!isPending && success && (
        <span className="text-success">Added to cart</span>
      )}
    </div>
  );
}
