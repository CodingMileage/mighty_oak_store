import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";
import AddToCart from "./AddToCart";
import { incrementProductQuantity } from "./actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: product?.name + " - The Mighty Oak Store",
    description: product?.description,
    openGraph: {
      images: [{ url: product?.imageUrl }],
    },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id);
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
      {product ? (
        <>
          <Image
            src={product.imageUrl}
            width={200}
            height={200}
            alt={product.name || "Product Image"}
            priority // Optional: for optimization
          />
          <div>
            <h2 className="text-5xl font-bold">{product.name}</h2>
            <PriceTag price={product.price} className="mt-4" />
            <p className="py-6">{product.description}</p>
            <AddToCart
              productId={product?.id}
              incrementProductQuantity={incrementProductQuantity}
            />
          </div>
        </>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
}
