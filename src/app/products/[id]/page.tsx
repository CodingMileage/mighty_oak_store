import { prisma } from "@/lib/db/prisma";
import ProductDetails from "./ProductDetails";
import CarouselItem from "@/components/CarouselItem";
import { SimilarSparkle, TrendingSparkle } from "@/components/Nyxb/Sparkle";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true, // Include variants when fetching the product
    },
  });

  return product;
};

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
    include: {
      variants: true,
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
    include: {
      variants: true,
    },
  });

  return (
    <>
      <ProductDetails product={product} />{" "}
      {/* Render the client-side component */}
      <div className="mt-12">
        <h1 className="mb-6">
          <SimilarSparkle />
        </h1>
        <CarouselItem initialProducts={similarProducts} />
      </div>
      <div className="mt-12">
        <h1 className="mb-6">
          <TrendingSparkle />
        </h1>
        <CarouselItem initialProducts={trendingProducts} />
      </div>
    </>
  );
}
