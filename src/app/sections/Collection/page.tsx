"use client";

import { NewestSparkle } from "@/components/Nyxb/Sparkle";
import ProductCard from "@/components/ProductCard";
import { Container } from "@mui/material";
import { motion } from "framer-motion";
import { getProducts } from "@/lib/db/products";

export default async function Collection() {
  const products = await getProducts();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <Container maxWidth="md" className="p-4">
        <NewestSparkle />
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </Container>
    </motion.div>
  );
}
