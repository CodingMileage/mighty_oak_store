import { prisma } from "@/lib/db/prisma";
import { Container } from "@mui/material";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

interface OrdersProps {
  userId: string; // Expecting userId as a prop
}

export default async function Orders({ userId }: OrdersProps) {
  const orders = await prisma.order.findMany({
    where: { userId }, // Filter orders by userId
    include: { items: { include: { product: true } } },
  });

  return (
    <Container maxWidth="lg">
      <h1>Orders for User ID: {userId}</h1>
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
                      />
                    </Link>
                  )}
                  {/* Product name */}
                  <div className="ml-4">
                    <Link href={`/products/${item.product.id}`}>
                      <h3>{item.product.name}</h3>
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
