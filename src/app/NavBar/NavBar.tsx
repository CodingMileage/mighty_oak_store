import { getCart } from "@/lib/db/cart";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ShoppingCartButton from "@/components/ShoppingCartButton";
import UserMenuButton from "@/app/NavBar/UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function searchProducts(formData: FormData) {
  "use server";

  const searchQuery = formData.get("searchQuery");

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const cart = await getCart();

  return (
    <div className="bg-white">
      <div className="navbar max-w-7xl mx-auto flex justify-between items-center py-2">
        {/* Left: Links (for example, Home, Shop, etc.) */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg">
            Home
          </Link>
          <Link href="/shop" className="text-lg">
            Shop
          </Link>
          <Link href="/about" className="text-lg">
            About
          </Link>
        </div>

        {/* Center: Logo */}
        <div className="flex-grow flex justify-center">
          <Link href="/" className="text-xl normal-case">
            <Image
              src={"/images/logo.png"}
              width={125}
              height={125}
              alt="Logo"
              className="hover:scale-105 duration-500"
            />
          </Link>
        </div>

        {/* Right: Search bar, ShoppingCart, UserMenu */}
        <div className="flex items-center gap-2">
          <ShoppingCartButton cart={cart} />
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}
