import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@mui/material";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });
  return (
    <>
      <Container maxWidth="lg" className="hero rounded-xl bg-slate-400">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src={products[0].imageUrl}
            width={150}
            height={200}
            alt={products[0].name}
            className="w-full max-w-sm"
            priority
          />
          <div>
            <h1 className="text-5xl font-bold">{products[0].name}</h1>
            <p className="py-6">{products[0].description}</p>
            <Link
              href={"/products/" + products[0].id}
              className="btn btn-primary"
            >
              Add
            </Link>
          </div>
        </div>
      </Container>
      <Container maxWidth="md" className="">
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.slice(1).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </Container>
    </>
  );
}
