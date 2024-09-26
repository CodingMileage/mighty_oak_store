import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@mui/material";
import { NewestSparkle, SparklesTextDemo } from "@/components/Nyxb/Sparkle";
import Slider from "@/components/Slider";
import { BabyCarousel } from "@/components/BabySlider";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });
  const newProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      {/* <Slider /> */}
      <Container maxWidth="lg" className="flex justify-between rounded-md p-4">
        <div
          className="flex flex-col justify-around w-full rounded-md max-w-xl items-center pr-4"
          // style={{
          //   backgroundImage: "url('/images/MOB LOGO TEXT.png')",
          //   backgroundSize: "contain",
          //   backgroundRepeat: "no-repeat",
          // }}
        >
          <img src="/images/logo.png" alt="" />

          <Button className="p-4 rounded-full font-bold bg-emerald-600 hover:bg-emerald-800">
            Browse Our Clothes
          </Button>
        </div>
        <BabyCarousel />
      </Container>
      {/* <Container maxWidth="lg" className="hero rounded-xl bg-slate-400">
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
      </Container> */}
      <SparklesTextDemo />
      <Container maxWidth="md" className="">
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </Container>
      <div className="bg-emerald-400 rounded">
        <Container maxWidth="md" className="p-4">
          <NewestSparkle />
          <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
