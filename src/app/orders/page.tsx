import { prisma } from "@/lib/db/prisma";
import { Container } from "@mui/material";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getServerSession } from "next-auth"; // Ensure you're using next-auth or a similar auth provider
import { authOptions } from "../api/auth/[...nextauth]/route";

interface OrdersProps {
  userId: string; // Expecting userId as a prop
}

export default async function Orders({ userId }: OrdersProps) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.user || !session.user.email) {
    return <p>Please log in to view your orders.</p>;
  }

  // Get the user's ID or email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }, // Use session email to find user
  });

  if (!user) {
    return <p>User not found.</p>;
  }

  // Fetch orders based on user ID
  const orders = await prisma.order.findMany({
    where: { userId: user.id }, // Filter orders by userId
    include: { items: { include: { product: true } } }, // Include items and product details
  });

  return (
    <Container maxWidth="lg">
      <h1 className="font-bold text-2xl">Orders for: {session.user.name}</h1>
      {orders.length === 0 ? (
        <p>No orders found for this user.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 mb-4">
            <div className="flex justify-between p-2 rounded bg-slate-400">
              {/* Display the order information */}
              <h2 className="">
                <span className="font-bold">Order Total:</span>{" "}
                <span className="">{formatPrice(order.totalAmount)}</span>
              </h2>
              <h2>
                <span className="font-bold">Order ID:</span> {order.id}
              </h2>
            </div>
            <ul className="ml-6">
              {order.items.map((item) => (
                <li key={item.id} className="flex mt-2 mb-2">
                  {/* Dynamically link to each product */}
                  {item.product.imageUrl && (
                    <Link href={`/products/${item.product.id}`}>
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        style={{ width: "100px", borderRadius: "8px" }}
                        className="hover:opacity-85 hover:scale-105 duration-500 ease-in-out"
                      />
                    </Link>
                  )}
                  {/* Product name */}
                  <div className="ml-4">
                    <Link href={`/products/${item.product.id}`}>
                      <h1 className="font-bold hover:opacity-45">
                        {item.product.name}
                      </h1>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </Container>
  );
}
