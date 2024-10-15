"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import AddToCart from "./AddToCart";

interface Variant {
  id: string;
  size: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  type: string;
  imageUrl: string[];
  variants: Variant[];
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0]
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product.imageUrl[0]
  ); // State for selected image

  // Handle variant selection
  const handleVariantSelection = (variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  // Handle image selection
  const handleImageSelection = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Update the selected image
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between gap-8 items-center py-8 px-4">
      {/* Product Image */}
      <div className="lg:w-1/2 w-full flex flex-col items-center">
        <Image
          src={selectedImage || "/placeholder.jpg"}
          width={400}
          height={400}
          alt={product.name || "Product Image"}
          priority={true}
          className="object-contain mb-4 rounded-3xl"
        />

        {/* Image Thumbnails */}
        <div className="flex gap-2">
          {product.imageUrl.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => handleImageSelection(imageUrl)}
              className={`border rounded-md overflow-hidden ${
                selectedImage === imageUrl
                  ? "border-emerald-500"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={imageUrl}
                width={80}
                height={80}
                alt={`Thumbnail ${index + 1}`}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="lg:w-1/2 w-full space-y-4">
        {/* Product Name */}
        <h2 className="text-4xl font-bold text-gray-900">{product.name}</h2>

        <div>
          {/* Size Selector */}
          <p className="text-base text-gray-700">Available Sizes:</p>
          <div className="flex gap-2">
            {product.variants.map((variant) => (
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
              productId={product.id}
              variantId={selectedVariant.id} // Pass selected variant ID
              className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
