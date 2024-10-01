import { prisma } from "@/lib/db/prisma";

interface OrdersProps {
  userId: string; // Expecting userId as a prop
}

export default async function Orders({ userId }: OrdersProps) {
  const orders = await prisma.order.findMany({
    where: { userId }, // Filter orders by userId
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1>Orders for User ID: {userId}</h1>
      {orders.length === 0 ? (
        <p>No orders found for this user.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 mb-4">
            <h2 className="font-bold">Order ID: {order.id}</h2>
            <ul className="list-disc ml-6">
              {order.items.map((item) => (
                <li key={item.id} className="mb-2">
                  <strong>Product Name:</strong> {item.product.name} <br />
                  <strong>Quantity:</strong> {item.quantity} <br />
                  <strong>Price:</strong> ${item.price / 100} <br />
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      style={{ width: "100px", borderRadius: "8px" }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
