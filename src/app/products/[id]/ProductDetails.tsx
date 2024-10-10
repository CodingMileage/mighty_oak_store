"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import AddToCart from "./AddToCart";

interface ProductDetailsProps {
  product: any;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  // Handle variant selection
  const handleVariantSelection = (variantId: string) => {
    const variant = product.variants.find((v: any) => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  console.log(selectedVariant);

  return (
    <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between gap-8 items-center py-8 px-4">
      {/* Product Image */}
      <div className="lg:w-1/2 w-full flex justify-center">
        <Image
          src={product.imageUrl[0] || "/placeholder.jpg"}
          width={500}
          height={500}
          alt={product.name || "Product Image"}
          priority={true}
        />
      </div>

      {/* Product Details */}
      <div className="lg:w-1/2 w-full space-y-4">
        {/* Product Name */}
        <h2 className="text-4xl font-bold text-gray-900">{product.name}</h2>

        {/* Size Selector */}
        <p className="text-base text-gray-700">Available Sizes:</p>
        <div className="flex gap-2">
          {product.variants.map((variant: any) => (
            <button
              key={variant.id}
              onClick={() => handleVariantSelection(variant.id)}
              className={`px-4 py-2 rounded-md border ${
                selectedVariant.id === variant.id
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-700"
              } hover:bg-emerald-600 transition`}
            >
              {variant.size}
            </button>
          ))}
        </div>

        {/* Product Type */}
        <p className="text-xl font-medium text-gray-500">
          Type:{" "}
          <span className="font-semibold text-gray-900">{product.type}</span>
        </p>

        {/* Price & Add to Cart */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-emerald-500">
            {formatPrice(selectedVariant.price)}
          </h1>

          <div className="mt-4">
            <AddToCart
              productId={selectedVariant.id}
              variantId={selectedVariant.id} // Pass selected variant ID
              className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
