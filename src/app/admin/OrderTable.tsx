// Define interfaces for the Order, User, and any other related objects
interface User {
  email: string;
}

interface OrderItem {
  id: string;
  product: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user: User;
  totalAmount: number;
  status: string;
  shippingLabel: string | null;
  items: OrderItem[];
}

// Component Props
interface OrderTableProps {
  orders: Order[];
}

import { formatPrice } from "@/lib/format";
import UpdateShippingLabel from "./UpdateShippingLabel"; // Ensure correct path

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-300 p-4">Order ID</th>
          <th className="border border-gray-300 p-4">User</th>
          <th className="border border-gray-300 p-4">Total Amount</th>
          <th className="border border-gray-300 p-4">Status</th>
          <th className="border border-gray-300 p-4">Shipping Label</th>
          <th className="border border-gray-300 p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="border border-gray-300 p-4">{order.id}</td>
            <td className="border border-gray-300 p-4">{order.user.email}</td>
            <td className="border border-gray-300 p-4">
              {formatPrice(order.totalAmount)} USD
            </td>
            <td className="border border-gray-300 p-4">{order.status}</td>
            <td className="border border-gray-300 p-4">
              {order.shippingLabel || "No label"}
            </td>
            <td className="border border-gray-300 p-4">
              <UpdateShippingLabel order={order} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
