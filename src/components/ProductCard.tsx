import { Product } from "@prisma/client";
import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { formatCurrency, formatPrice } from "@/lib/format";
import AddToCart from "@/app/products/[id]/AddToCart";
import { incrementProductQuantity } from "@/app/products/[id]/actions";

import { Rating } from "primereact/rating";
import StarRating from "./Rating";

interface ProductCardProps {
  product: Product & {
    variants: {
      price: number;
      id: string;
      size: string;
      color: string;
      imageUrl: string[];
    };
  }; // Updated to include variant details
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;

  // console.log(product.variants[0].price);

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <Card className="flex flex-col w-80 h-full overflow-hidden rounded-2xl bg-slate-100">
          <Link href={"/products/" + product.id}>
            <div className="p-4 relative h-40 flex justify-center items-center">
              <div className="relative w-full h-full">
                <Image
                  src={product.imageUrl[0]}
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
              <CardTitle className="flex flex-col items-center  sm:flex-row justify-between text-lg font-semibold mb-2">
                <StarRating value={product.rating} />
                {/* {formatPrice(product.variants[0].price)} */}
              </CardTitle>
              <CardDescription className="font-bold text-xl text-center align-middle text-gray-600">
                {product.name}
              </CardDescription>
              <CardDescription className="font-semibold text-lg text-center align-middle text-gray-400">
                {product.type}
              </CardDescription>
            </CardHeader>
          </Link>

          <CardFooter className="p-4 mt-auto">
            {product.quantity > 0 && product.comingSoon !== true && (
              <AddToCart
                productId={product?.id}
                incrementProductQuantity={incrementProductQuantity}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export function ProductBundleCard({ product }: ProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <Card className="flex flex-col w-80 h-full overflow-hidden rounded-2xl bg-slate-100">
          <Link href={"/products/" + product.id}>
            <div className="p-4 relative h-40 flex justify-center items-center">
              <div className="relative w-full h-full flex">
                {product.imageUrl.length > 0 && (
                  <div className="relative w-1/2 h-full">
                    <Image
                      src={product.imageUrl[0]}
                      layout="fill"
                      objectFit="contain"
                      alt={product.name}
                      className="hover:scale-110 duration-500 ease-in-out"
                    />
                  </div>
                )}

                {product.imageUrl.length > 1 && (
                  <div className="relative w-1/2 h-full">
                    <Image
                      src={product.imageUrl[1]}
                      layout="fill"
                      objectFit="contain"
                      alt={product.name}
                      className="hover:scale-110 duration-500 ease-in-out"
                    />
                  </div>
                )}
              </div>
            </div>
          </Link>

          <Link href={"/products/" + product.id}>
            <CardHeader className="p-4">
              <CardTitle className="flex flex-col items-center  sm:flex-row justify-between text-lg font-semibold mb-2">
                <StarRating value={product.rating} />
                {formatPrice(product.price)}
              </CardTitle>
              <CardDescription className="font-bold text-xl text-center align-middle text-gray-600">
                {product.name}
              </CardDescription>
              <CardDescription className="font-semibold text-lg text-center align-middle text-gray-400">
                {product.type}
              </CardDescription>
            </CardHeader>
          </Link>

          <CardFooter className="p-4 mt-auto">
            {product.quantity > 0 && product.comingSoon !== true && (
              <AddToCart
                productId={product?.id}
                incrementProductQuantity={incrementProductQuantity}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
