import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";
import AddToCart from "./AddToCart";
import { incrementProductQuantity } from "./actions";
import { formatPrice } from "@/lib/format";
import CarouselItem from "@/components/CarouselItem";
import { SimilarSparkle, TrendingSparkle } from "@/components/Nyxb/Sparkle";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true, // Include variants when fetching the product
    },
  });
  // console.log(product);

  return product;
});

// export async function generateMetadata({
//   params: { id },
// }: ProductPageProps): Promise<Metadata> {
//   const product = await getProduct(id);

//   return {
//     title: product?.name
//       ? `${product.name} - The Mighty Oak Store`
//       : "Product Not Found",
//     description:
//       product?.description || "Find the best products at The Mighty Oak Store.",
//     openGraph: {
//       images: product?.imageUrl ? [{ url: product.imageUrl }] : [],
//     },
//   };
// }

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id);

  if (!product) {
    return <p>Product not found</p>;
  }

  // Fetch trending products
  const trendingProducts = await prisma.product.findMany({
    where: { comingSoon: false },
    orderBy: {
      OrderItem: {
        _count: "desc",
      },
    },
  });

  // Fetch similar products based on the current product's type
  const similarProducts = await prisma.product.findMany({
    where: {
      comingSoon: false,
      type: product.type, // Filter by type to get similar products
      id: { not: product.id }, // Exclude the current product
    },
    orderBy: { id: "desc" },
  });

  return (
    <>
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

          {/* Availability */}
          {product.comingSoon ? (
            <p className="text-lg text-red-500 font-semibold">Coming Soon!</p>
          ) : (
            <>
              {/* Stock Status */}
              {/* <p className="text-lg text-red-600">
                {product.variants[0].quantity === 0
                  ? "Out of Stock"
                  : product.variants[0].quantity <= 2
                  ? `Hurry! Only ${product.variants[0].quantity} left in stock.`
                  : ""}
              </p> */}

              {/* Product Size */}
              <p className="text-base text-gray-700">
                {product.size && `Size: ${product.size}`}
              </p>

              {/* Product Type */}
              <p className="text-xl font-medium text-gray-500">
                Type:{" "}
                <span className="font-semibold text-gray-900">
                  {product.type}
                </span>
              </p>

              {/* Price & Add to Cart */}
              <div className="mt-6">
                {/* <h1 className="text-3xl font-bold text-emerald-500">
                  {formatPrice(product.variants[0].price)}
                </h1> */}

                <div className="mt-4">
                  <AddToCart
                    productId={product.id}
                    incrementProductQuantity={incrementProductQuantity}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition ease-in-out"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="m-12">
        <h1 className="m-6">
          <SimilarSparkle />
        </h1>
        <CarouselItem initialProducts={similarProducts} />{" "}
        {/* Updated to show similar products */}
      </div>

      <div className="m-12">
        <h1 className="m-6">
          <TrendingSparkle />
        </h1>
        <CarouselItem initialProducts={trendingProducts} />
      </div>
    </>
  );
}
