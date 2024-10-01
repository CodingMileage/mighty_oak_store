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
  try {
    // Fetch products from the database in a single call
    const allProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Split the products into coming soon and available products
    const products = allProducts.filter((product) => !product.comingSoon);
    const soonProducts = allProducts.filter((product) => product.comingSoon);
    const newProducts = products.slice(0, 6); // Assuming newest products are the top 6 non-coming soon products

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

        {/* Data View Component */}
        <BasicDemo initialProducts={products} />

        {/* Payment Section */}
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
  } catch (error) {
    console.error("Error fetching products:", error);
    return <p>Something went wrong while fetching the products.</p>;
  }
}
