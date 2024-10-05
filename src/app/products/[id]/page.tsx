import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";
import AddToCart from "./AddToCart";
import { incrementProductQuantity } from "./actions";
import { ConfettiButtonDemo } from "@/components/ConfettiB";

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
    title: product?.name
      ? `${product.name} - The Mighty Oak Store`
      : "Product Not Found",
    description:
      product?.description || "Find the best products at The Mighty Oak Store.",
    openGraph: {
      images: product?.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <>
      <div className="container mx-auto flex flex-col justify-around lg:flex-row gap-4 lg:items-center">
        <Image
          src={product.imageUrl || "/placeholder.jpg"}
          width={500}
          height={500}
          alt={product.name || "Product Image"}
          priority={true}
        />
        <div>
          <h2 className="text-5xl font-bold">{product.name}</h2>
          <PriceTag price={product.price} className="mt-4" />
          <p className="py-6">{product.description}</p>
          <AddToCart
            productId={product.id}
            incrementProductQuantity={incrementProductQuantity}
          />
          {/* <ConfettiButtonDemo /> */}
        </div>
      </div>
      <div className="m-12">
        <h1 className="text-center font-bold text-4xl">
          Check out these similar styles
        </h1>
      </div>
    </>
  );
}
