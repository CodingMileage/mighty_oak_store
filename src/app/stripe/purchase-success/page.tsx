import { ConfettiSideCannons } from "@/components/ConfettiB";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth"; // Ensure you're using next-auth or a similar auth provider
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { formatPrice } from "@/lib/format";
import Image from "next/image";

export default async function SuccessPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session || !session.user || !session.user.email) {
    return <p>Please log in to view your order.</p>;
  }

  // Get the user's ID from the session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }, // Find user by email
  });

  if (!user) {
    return <p>User not found.</p>;
  }

  // Get the latest order for the authenticated user
  const order = await prisma.order.findFirst({
    where: { userId: user.id }, // Filter by user's ID
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true, // Include product details
          variant: true, // Include variant details for each item
        },
      },
    },
  });

  if (!order) {
    return <p>No recent orders found.</p>;
  }

  return (
    <>
      <ConfettiSideCannons />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <div className="border p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Latest Order</h2>

          {/* Display order information */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div>
              {order.items.map((item) => (
                <div key={item.id} className="mb-4 flex items-start">
                  {/* Display product image */}
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl[0]}
                      alt={item.product.name}
                      style={{ width: "100px", borderRadius: "8px" }}
                      className="hover:opacity-85 hover:scale-105 duration-500 ease-in-out"
                    />
                  )}
                  <div>
                    <p className="text-sm">
                      <strong>Product:</strong> {item.product.name}
                    </p>

                    <p className="text-sm">
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p className="text-sm">
                      <strong>Price:</strong>{" "}
                      {formatPrice(item.variant?.price || item.product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm">
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
