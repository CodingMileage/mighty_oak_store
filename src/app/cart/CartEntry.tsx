"use client";

import React, { useRef } from "react";
import { CartItemWithProduct } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Container } from "@mui/material";

interface CartEntryProps {
  cartItem: CartItemWithProduct; // Ensure this includes variants if needed
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem, // Correctly destructure cartItem
  setProductQuantity,
}: CartEntryProps) {
  const { product, quantity } = cartItem; // Destructure product and quantity from cartItem
  const [isPending, startTransition] = useTransition();
  const quantityOptions: JSX.Element[] = [];
  const toast = useRef<Toast>(null);
  const variant = product.variants.find((v) => v.id === cartItem.variantId); // Ensure variantId is defined in your cart item

  // Generate quantity options
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    startTransition(async () => {
      await setProductQuantity(product.id, newQuantity);

      // Show toast notification based on quantity change
      if (newQuantity === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Removed",
          detail: `${product.name} was removed from your cart`,
        });
      } else {
        toast.current?.show({
          severity: "success",
          summary: "Updated",
          detail: `${product.name} quantity updated to ${newQuantity}`,
        });
      }
    });
  };

  return (
    <Container maxWidth="md">
      <Toast ref={toast} />
      <div className="flex flex-wrap items-center gap-3">
        <Link href={"/products/" + variant?.id} className="font-bold">
          {" "}
          {/* Use variant?.id to avoid potential errors */}
          <Image
            src={product.imageUrl[0]}
            width={200}
            height={200}
            alt={product.name}
            className="rounded-lg"
          />
        </Link>
        <div>
          <Link href={"/products/" + product.id} className="font-bold text-4xl">
            {product.name}
          </Link>
          <div className="font-semibold">
            Price: {formatPrice(variant?.price || product.price)}
          </div>{" "}
          <div className="font-semibold">Size: {variant?.size}</div>
          {/* Fallback to product price if variant is not found */}
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <select
              className="select max-w-xs select-bordered bg-white"
              defaultValue={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                handleQuantityChange(newQuantity);
              }}
            >
              <option value={0}>0 (Remove)</option>
              {quantityOptions}
            </select>
          </div>
          <div className="flex items-center gap-3">
            SubTotal:{" "}
            {formatPrice((variant?.price || product.price) * quantity)}{" "}
            {/* Use variant price for subtotal */}
            {isPending && (
              <ProgressSpinner
                style={{ width: "25px", height: "25px" }}
                strokeWidth="4"
              />
            )}
          </div>
        </div>
      </div>
      <div className="divider" />
    </Container>
  );
}
