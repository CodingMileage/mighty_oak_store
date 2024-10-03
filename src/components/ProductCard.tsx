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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;

  return (
    // <Link
    //   href={"/products/" + product.id}
    //   className="card w-full bg-slate-300 hover:shadow-xl transition-shadow"
    // >
    //   <figure>
    //     <Image
    //       src={product.imageUrl}
    //       width={150}
    //       height={200}
    //       alt={product.name}
    //       className="h-48 object-cover"
    //     />
    //   </figure>

    //   <div className="card-body">
    //     {isNew && <div className="badge badge-secondary">NEW</div>}
    //     <h2 className="card-title">{product.name}</h2>
    //     <p>{product.description}</p>
    //     <PriceTag price={product.price} />
    //   </div>
    // </Link>

    // <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
    //   <Link
    //     href={"/" + product.slug}
    //     className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
    //     key={product._id}
    //   >
    //     <div className="relative w-full h-80">
    //       <Image
    //         src={product.imageUrl || "/product.png"}
    //         alt=""
    //         fill
    //         sizes="25vw"
    //         className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
    //       />

    //       {product.media?.items && (
    //         <Image
    //           src={product.media?.items[1]?.image?.url || "/product.png"}
    //           alt=""
    //           fill
    //           sizes="25vw"
    //           className="absolute object-cover rounded-md"
    //         />
    //       )}
    //     </div>
    //     <div className="card-body">
    //       {isNew && <div className="badge badge-secondary">NEW</div>}
    //       <h2 className="card-title">{product.name}</h2>
    //       <p>{product.description}</p>
    //       <PriceTag price={product.price} />{" "}
    //     </div>
    //     <div className="flex justify-between">
    //       <span className="font-medium">{product.name}</span>
    //       <span className="font-semibold">${product.price?.price}</span>
    //     </div>
    //     {product.additionalInfoSections && (
    //       <div
    //         className="text-sm text-gray-500"
    //         dangerouslySetInnerHTML={{
    //           __html: DOMPurify.sanitize(
    //             product.additionalInfoSections.find(
    //               (section: any) => section.title === "shortDesc"
    //             )?.description || ""
    //           ),
    //         }}
    //       ></div>
    //     )}
    //     <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
    //       Add to Cart
    //     </button>
    //   </Link>
    // </div>
    <>
      {/* <Container>
        <div className="bg-slate-200 p-4 flex flex-col items-center rounded w-[220px] h-[255px]">
          <Image
            src={product.imageUrl}
            width={200}
            height={200}
            className="hover:scale-110 duration-500 ease-in-out object-cover w-full h-full"
          />
        </div>
        <div className="flex justify-between mt-4 w-[220px]">
          <div className="font-bold">{product.name}</div>
          <div className="font-bold ">${product.price}</div>
        </div>
        <div className="mt-4 mb-4">{product.description}</div>
        <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
          Add to Cart
        </button>
      </Container> */}
      <div className="flex justify-center items-center h-full">
        <Card className="flex flex-col w-80 h-full overflow-hidden rounded-2xl bg-slate-100">
          <div className="p-4 relative h-40 flex justify-center items-center">
            <div className="relative w-32 h-32">
              <Link href={"/products/" + product.id}>
                <Image
                  src={product.imageUrl}
                  layout="fill"
                  objectFit="contain"
                  alt={product.name}
                  className="hover:scale-110 duration-500 ease-in-out"
                />
              </Link>
            </div>
          </div>

          <CardHeader className="p-4">
            <CardTitle className="text-center text-lg font-semibold mb-2">
              {product.name}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {formatPrice(product.price)}
            </CardDescription>
          </CardHeader>

          <CardFooter className="p-4 mt-auto">
            {/* <Button
              asChild
              size="large"
              className="w-full text-white rounded-full bg-emerald-600 hover:bg-emerald-500"
            >
              <Link href={"/products/" + product.id} className="font-bold">
                Details
              </Link>
            </Button> */}
            <AddToCart
              productId={product?.id}
              incrementProductQuantity={incrementProductQuantity}
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
