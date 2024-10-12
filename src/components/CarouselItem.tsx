"use client";

import React, { useState } from "react";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

interface ProductVariant {
  price: number;
  size: string;
  color: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
  variants: ProductVariant[]; // Include variants in the product interface
}

interface BasicDemoProps {
  initialProducts: Product[];
}

export default function CarouselItem({ initialProducts }: BasicDemoProps) {
  const [products] = useState<Product[]>(initialProducts);

  const responsiveOptions: CarouselResponsiveOption[] = [
    { breakpoint: "1800px", numVisible: 3, numScroll: 1 },
    { breakpoint: "1400px", numVisible: 3, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 2, numScroll: 1 },
    { breakpoint: "767px", numVisible: 2, numScroll: 1 },
    { breakpoint: "575px", numVisible: 1, numScroll: 1 },
  ];

  // Template for each product in the carousel
  const productTemplate = (product: Product) => {
    // Get the price of the first variant, or fallback to the product price
    const variantPrice =
      product.variants.length > 0 ? product.variants[0].price : product.price;

    return (
      <div className="p-4">
        <Link href={"/products/" + product.id}>
          <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 m-4">
            <div className="mb-3 p-4 bg-gray-100 rounded-t-lg w-full h-48 flex justify-center items-center">
              <Image
                src={product.imageUrl[0]}
                alt={product.name}
                width={125}
                height={125}
                className="object-contain"
              />
            </div>
            <div className="p-4 w-full text-center">
              <h4 className="mb-2 font-bold text-lg text-gray-700">
                {product.name}
              </h4>
              <h6 className="text-xl font-semibold text-emerald-500">
                {formatPrice(variantPrice)}
              </h6>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg">
      <Carousel
        value={products}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        circular
        showIndicators={false}
        showNavigators={true}
        className="shadow-lg"
      />
    </div>
  );
}

// Server-side function to fetch products
export async function getServerSideProps() {
  const initialProducts = await prisma.product.findMany({
    where: { comingSoon: false },
    include: {
      variants: true, // Include the ProductVariant relation
    },
    orderBy: { id: "desc" },
  });

  return {
    props: { initialProducts },
  };
}
