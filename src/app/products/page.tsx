// Server-side component: page.tsx
import { prisma } from "@/lib/db/prisma";
import ClientProductPagev2 from "./ClientProductPagev2";
import { Container } from "@mui/material";
import { BundleSparkle, SparklesTextDemo } from "@/components/Nyxb/Sparkle";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BabyCarousel } from "@/components/BabySlider";

type ProductVariant = {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string[];
};

type Product = {
  id: string;
  description: string;
  imageUrl: string[];
  name: string;
  price: number;
  quantity: number;
  color: string;
  type: string;
  bundle: boolean;
  rating: number;
  comingSoon: boolean;
  createdAt: Date;
  updatedAt: Date;
  variants: ProductVariant[];
};

export default async function ProductPage() {
  // Fetch products from Prisma
  const products = await prisma.product.findMany({
    // take: 9,
    where: { comingSoon: false },
    include: {
      variants: true, // Include ProductVariant relation
    },
  });

  const newProducts = await prisma.product.findMany({
    take: 6,
    where: { comingSoon: false },
    orderBy: { createdAt: "desc" },
    include: {
      variants: true, // Include ProductVariant relation
    },
  });

  const trendingProducts = await prisma.product.findMany({
    take: 6,
    where: { comingSoon: false },
    orderBy: {
      OrderItem: {
        _count: "desc",
      },
    },
    include: {
      variants: true, // Include ProductVariant relation
    },
  });

  const soonProducts = await prisma.product.findMany({
    take: 6,
    where: { comingSoon: true },
    orderBy: { createdAt: "desc" },
    include: {
      variants: true, // Include ProductVariant relation
    },
  });

  const renderProductGrid = (products: Product[], keyPrefix: string) => (
    <div className="my-4 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard product={product} key={keyPrefix + product.id} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );

  return (
    // <Container maxWidth="md">
    //   <SparklesTextDemo />
    //   {renderProductGrid(products, "product-")}
    // </Container>
    <>
      <div className="flex justify-center rounded-md p-4">
        {" "}
        <div className="flex justify-around w-full rounded-md max-w-xl items-center pr-4">
          {/* <img src="/images/logoTree.png" alt="" /> */}
          <Image
            src="/images/MOSTag.jpeg"
            alt=""
            height={512}
            width={512}
            className="rounded"
          />
          {/* <img src="/images/MOSTag.jpeg" /> */}

          <Link href="/products"></Link>
        </div>
        <BabyCarousel />
      </div>
      <ClientProductPagev2 products={products} />
    </>
  );
}
