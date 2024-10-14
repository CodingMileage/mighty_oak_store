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

  // Fetch orders based on user ID and sort them by createdAt in descending order
  const orders = await prisma.order.findMany({
    where: { userId: user.id }, // Filter orders by userId
    orderBy: { createdAt: "desc" }, // Sort by creation date, newest first
    include: {
      items: { include: { product: { include: { variants: true } } } },
    }, // Include items and product details
  });

  return (
    <Container maxWidth="lg">
      <h1 className="font-bold text-2xl">Orders for: {session.user.name}</h1>
      {orders.length === 0 ? (
        <p>No orders found for this user.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 mb-4">
            <div className="flex justify-around p-2 rounded bg-emerald-400">
              {/* Display the order information */}
              <h2 className="">
                <span className="font-bold">Order Total:</span>{" "}
                <span className="">{formatPrice(order.totalAmount)}</span>
              </h2>
              {/* Display order date and time */}
              <div className="text-sm">
                <span className="font-bold">Order Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}{" "}
                {/* Format the date and time */}
              </div>
              <h2>
                <span className="font-bold">Order ID:</span> {order.id}
              </h2>
            </div>

            <ul className=" bg-slate-100 p-6">
              {order.items.map((item) => (
                <li key={item.id} className="flex mb-2 p-4">
                  {/* Dynamically link to each product */}
                  {item.product.imageUrl && (
                    <Link href={`/products/${item.product.id}`}>
                      <img
                        src={item.product.imageUrl[0]}
                        alt={item.product.name}
                        style={{ width: "100px", borderRadius: "8px" }}
                        className="hover:opacity-85 hover:scale-105 duration-500 ease-in-out"
                      />
                    </Link>
                  )}
                  {/* Product name, variant details, and quantity */}
                  <div className="ml-4">
                    <Link href={`/products/${item.product.id}`}>
                      <h1 className="font-bold hover:opacity-45">
                        {item.product.name}
                      </h1>
                      {/* Display the variant size, price, and quantity */}
                      {item.variantId && (
                        <>
                          <h2 className="text-sm">
                            Size:{" "}
                            {item.product.variants.find(
                              (variant) => variant.id === item.variantId
                            )?.size || "N/A"}
                          </h2>
                          <h2 className="text-sm">
                            Price:{" "}
                            {formatPrice(
                              item.product.variants.find(
                                (variant) => variant.id === item.variantId
                              )?.price || 0 // Default to 0 if no price found
                            )}
                          </h2>
                          <h2 className="text-sm">
                            Quantity: {item.quantity}{" "}
                            {/* Render the quantity */}
                          </h2>
                        </>
                      )}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-around p-2 rounded bg-emerald-400">
              {order.shippingLabel ? (
                <h1>
                  <span className="font-bold">Shipping Label:</span>{" "}
                  {order.shippingLabel}
                </h1>
              ) : (
                <h1>
                  <span className="font-bold">Shipping Label:</span> Check Back
                  Soon!
                </h1>
              )}
            </div>
          </div>
        ))
      )}
    </Container>
  );
}
