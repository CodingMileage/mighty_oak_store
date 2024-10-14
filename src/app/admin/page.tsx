import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import OrderTable from "./OrderTable"; // Import the OrderTable component

// Function to fetch orders from Prisma
const getOrdersFromPrisma = async () => {
  return await prisma.order
    .findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    .then((orders) =>
      orders.map((order) => ({
        ...order,
        user: {
          ...order.user,
          email: order.user.email || "No email", // Provide a fallback for null emails
        },
      }))
    );
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session || !session.user || !session.user.email) {
    return <p>Please log in to access the admin page.</p>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Check if the user is an admin
  if (!user || !user.isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  // Fetch orders from Prisma
  const orders = await getOrdersFromPrisma();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
