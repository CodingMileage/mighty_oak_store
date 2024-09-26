import { getCart } from "@/lib/db/cart";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";

async function searchProducts(formData: FormData) {
  "use server";

  const searchQuery = formData.get("searchQuery");

  if (searchQuery) {
    redirect("/search?query" + searchQuery);
  }
}

export default async function Navbar() {
  const cart = await getCart();

  return (
    // <div className="  text-center p-2 font-semibold text-xl flex justify-between">
    //   <div></div>
    //   <div className="flex gap-4">
    //     <a href="/">
    //       <Image src={"/images/logo.png"} width={150} height={100} alt={""} />
    //     </a>
    //   </div>
    //   <div>
    //     <a href="/cart">Cart</a>
    //   </div>
    // </div>
    <div className="bg-white">
      <div className="navbar max-w-7xl flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Link href="/" className=" text-xl normal-case">
            <Image
              src={"/images/logo.png"}
              width={100}
              height={100}
              alt="Logo"
              className="hover:scale-105 duration-500"
            />
          </Link>
        </div>
        <div className="flex-none gap-2">
          <form action={searchProducts}>
            <div className="form-control">
              <input
                type="text"
                name="searchQuery"
                placeholder="Search"
                className="input input-borderedw-full min-w-[100px] bg-slate-200"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
        </div>
      </div>
    </div>
  );
}
