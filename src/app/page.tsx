// import ProductCard from "@/components/ProductCard";
// import { prisma } from "@/lib/db/prisma";

import Hero from "@/components/Hero";

// Define the ProductVariant type
// type ProductVariant = {
//   id: string;
//   productId: string;
//   price: number;
//   quantity: number;
//   size: string;
//   color: string;
//   imageUrl: string[];
// };

// Define the Product type
// type Product = {
//   id: string;
//   description: string;
//   imageUrl: string[];
//   name: string;
//   price: number;
//   quantity: number;
//   color: string;
//   type: string;
//   bundle: boolean;
//   rating: number;
//   comingSoon: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   variants: ProductVariant[];
// };

export default async function Home() {
  // Fetch products from the database
  // const products: Product[] = await prisma.product.findMany({
  //   take: 6,
  //   where: { comingSoon: false, bundle: false },
  //   include: {
  //     variants: true,
  //   },
  // });

  // const bundle: Product[] = await prisma.product.findMany({
  //   take: 6,
  //   where: { bundle: true },
  //   include: {
  //     variants: true,
  //   },
  // });

  // const newProducts: Product[] = await prisma.product.findMany({
  //   take: 6,
  //   where: { comingSoon: false },
  //   orderBy: { createdAt: "desc" },
  //   include: {
  //     variants: true, 
  //   },
  // });

  // const trendingProducts: Product[] = await prisma.product.findMany({
  //   take: 6,
  //   where: { comingSoon: false },
  //   orderBy: {
  //     OrderItem: {
  //       _count: "desc",
  //     },
  //   },
  //   include: {
  //     variants: true,
  //   },
  // });

  // const soonProducts: Product[] = await prisma.product.findMany({
  //   take: 6,
  //   where: { comingSoon: true },
  //   orderBy: { createdAt: "desc" },
  //   include: {
  //     variants: true,
  //   },
  // });

  
  // const renderProductGrid = (products: Product[], keyPrefix: string) => (
  //   <div className="my-4 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
  //     {products.length > 0 ? (
  //       products.map((product) => (
  //         <ProductCard product={product} key={keyPrefix + product.id} />
  //       ))
  //     ) : (
  //       <p>No products available.</p>
  //     )}
  //   </div>
  // );

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Main Product Grid */}
      {/* <div className="bg-emerald-300 rounded">
        <Container maxWidth="md" className="p-4">
          <SparklesTextDemo />
          {renderProductGrid(products, "product-")}
        </Container>
      </div> */}

      {/* Bundle Products Section */}
      {/* <Container maxWidth="md">
        <BundleSparkle />
        {renderProductGrid(bundle, "bundleProduct-")}
      </Container> */}

      {/* Trending Products Section */}
      {/* <div className="bg-emerald-300 rounded">
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
      {/* <div className="bg-emerald-300 rounded">
        <Container maxWidth="md" className="p-4">
          <SoonSparkle />
          {renderProductGrid(soonProducts, "soonProduct-")}
        </Container>
      </div> */}
    </>
  );
}
