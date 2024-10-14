"use client";

import { useState } from "react";

const UpdateShippingLabel = ({ order }) => {
  const [shippingLabel, setShippingLabel] = useState(order.shippingLabel || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateShippingLabel = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingLabel }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update shipping label");
      }

      const updatedOrder = await response.json();
      alert("Shipping label updated successfully!");
      setShippingLabel(updatedOrder.shippingLabel); // Update the local state with the new shipping label
    } catch (error) {
      console.error("Error updating shipping label:", error);
      setError("Failed to update shipping label.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={shippingLabel}
        onChange={(e) => setShippingLabel(e.target.value)}
        placeholder="Enter new shipping label"
        className="border border-gray-300 p-2"
      />
      <button
        onClick={handleUpdateShippingLabel}
        disabled={loading}
        className="ml-2 bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Updating..." : "Update"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default UpdateShippingLabel;
