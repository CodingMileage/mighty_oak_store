import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@mui/material";
import {
  NewestSparkle,
  SoonSparkle,
  SparklesTextDemo,
} from "@/components/Nyxb/Sparkle";
import Hero from "@/components/Hero";
import BasicDemo from "@/components/DataView";
import Pay from "@/components/Stripe";

export default async function Home() {
  // Fetch products from the database
  const products = await prisma.product.findMany({
    where: { comingSoon: false },
    orderBy: { id: "desc" },
  });

  const newProducts = await prisma.product.findMany({
    where: { comingSoon: false },
    orderBy: { createdAt: "desc" },
  });

  const soonProducts = await prisma.product.findMany({
    where: { comingSoon: true },
    orderBy: { createdAt: "desc" },
  });

  // Helper to render product grids
  const renderProductGrid = (products: any[], keyPrefix: string) => (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    <>
      {/* Hero Section */}
      <Hero />
      <BasicDemo initialProducts={[]} />

      <Pay />

      {/* Main Product Grid */}
      <Container maxWidth="md">
        <SparklesTextDemo />
        {renderProductGrid(products, "product-")}
      </Container>

      {/* Newest Products Section */}
      <div className="bg-emerald-400 rounded">
        <Container maxWidth="md" className="p-4">
          <NewestSparkle />
          {renderProductGrid(newProducts, "newProduct-")}
        </Container>
      </div>

      {/* Coming Soon Products Section */}
      <Container maxWidth="md" className="p-4">
        <SoonSparkle />
        {renderProductGrid(soonProducts, "soonProduct-")}
      </Container>
    </>
  );
}
