import ProductCard, { ProductBundleCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@mui/material";
import {
  BundleSparkle,
  NewestSparkle,
  SoonSparkle,
  SparklesTextDemo,
  TrendingSparkle,
} from "@/components/Nyxb/Sparkle";
import Hero from "@/components/Hero";
import BasicDemo from "@/components/DataView";
import Pay from "@/components/Stripe";
import BasicDemoo from "@/components/Knob";

export default async function Home() {
  // Fetch products from the database
  const products = await prisma.product.findMany({
    take: 6,
    where: { comingSoon: false },
    include: {
      variants: true, // Include the ProductVariant relation
    },
  });

  // const bundle = await prisma.product.findMany({
  //   take: 6,
  //   where: { bundle: true },
  // });

  // const newProducts = await prisma.product.findMany({
  //   take: 6,
  //   where: { comingSoon: false },
  //   orderBy: { createdAt: "desc" },
  // });

  // const trendingProducts = await prisma.product.findMany({
  //   take: 6,
  //   where: { comingSoon: false },
  //   orderBy: {
  //     OrderItem: {
  //       _count: "desc",
  //     },
  //   },
  // });

  // const soonProducts = await prisma.product.findMany({
  //   take: 6,
  //   where: { comingSoon: true },
  //   orderBy: { createdAt: "desc" },
  // });

  // Helper to render product grids
  const renderProductGrid = (products: any[], keyPrefix: string) => (
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

  const renderBundleGrid = (products: any[], keyPrefix: string) => (
    <div className="my-4 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductBundleCard product={product} key={keyPrefix + product.id} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <Hero />
      {/* <BasicDemo initialProducts={products} /> */}
      {/* <BasicDemoo /> */}

      {/* Main Product Grid */}
      <Container maxWidth="md">
        <SparklesTextDemo />
        {renderProductGrid(products, "product-")}
      </Container>
      {/* 
      <Container maxWidth="md">
        <BundleSparkle />
        {renderBundleGrid(bundle, "product-")}
      </Container>

      <div className="bg-emerald-400 rounded">
        <Container maxWidth="md" className="p-4">
          <TrendingSparkle />
          {renderProductGrid(trendingProducts, "trendingProduct-")}
        </Container>
      </div> */}

      {/* Newest Products Section */}

      {/* <Container maxWidth="md" className="p-4">
        <NewestSparkle />
        {renderProductGrid(newProducts, "newProduct-")}
      </Container> */}

      {/* Coming Soon Products Section */}
      {/* <div className="bg-emerald-400 rounded">
        <Container maxWidth="md" className="p-4">
          <SoonSparkle />
          {renderProductGrid(soonProducts, "soonProduct-")}
        </Container>
      </div> */}
    </>
  );
}
