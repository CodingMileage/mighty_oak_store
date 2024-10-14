import { Product } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product & {
    variants: {
      price: number;
      id: string;
      size: string;
      color: string;
      imageUrl: string[];
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;

  // Check if product has at least one variant and an image
  const firstVariant = product.variants[0];
  const productImageUrl = firstVariant?.imageUrl[0] || "/placeholder.jpg"; // fallback to a placeholder image

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <Card className="flex flex-col w-80 h-full overflow-hidden rounded-2xl bg-slate-100">
          <Link href={"/products/" + product.id}>
            <div className="p-4 relative h-40 flex justify-center items-center">
              <div className="relative w-full h-full">
                <Image
                  src={productImageUrl}
                  layout="fill"
                  objectFit="contain"
                  alt={product.name}
                  className="hover:scale-110 duration-500 ease-in-out"
                />
              </div>
            </div>
          </Link>

          <Link href={"/products/" + product.id}>
            <CardHeader className="p-4">
              <CardTitle className="font-bold text-xl text-center align-middle text-gray-600">
                {product.name}
              </CardTitle>
              <h1 className="text-2xl font-bold text-emerald-500 text-center">
                {formatPrice(firstVariant.price)}
              </h1>
              <CardDescription className="font-semibold text-lg text-center align-middle text-gray-400">
                {product.type}
              </CardDescription>
            </CardHeader>
          </Link>

          {/* <Link href={"/products/" + product.id}>
            <CardHeader className="p-4">
              <CardTitle className="flex flex-col items-center  sm:flex-row justify-between text-lg font-semibold mb-2">
                <StarRating value={product.rating} />
                <h1 className="text-2xl font-bold text-emerald-500">
                  {formatPrice(product.variants[0].price)}
                </h1>
              </CardTitle>
              <CardDescription className="font-bold text-xl text-center align-middle text-gray-600">
                {product.name}
              </CardDescription>
              <CardDescription className="font-semibold text-lg text-center align-middle text-gray-400">
                {product.type}
              </CardDescription>
            </CardHeader>
          </Link> */}

          <CardFooter className="p-4 mt-auto">
            {/* {product.variants[0].quantity > 0 &&
              product.comingSoon !== true && (
                <AddToCart
                  productId={product?.id}
                  incrementProductQuantity={incrementProductQuantity}
                />
              )} */}
            {/* <Link href={"/products/" + product.id}>
              <Button
                className="w-full text-white rounded-full bg-emerald-600
              hover:bg-emerald-500 text-lg font-bold tracking-tight"
              >
                Details
              </Button>
            </Link> */}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
