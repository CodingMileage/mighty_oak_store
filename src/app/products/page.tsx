// Server-side component: page.tsx
import { prisma } from "@/lib/db/prisma";
import ClientProductPage from "./ClientProductPage";

export default async function ProductPage() {
  // Fetch products from Prisma
  const products = await prisma.product.findMany({
    take: 9,
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

  return (
    <ClientProductPage
      products={products}
      newProducts={newProducts}
      trendingProducts={trendingProducts}
      soonProducts={soonProducts}
    />
  );
}
