"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/shared/StatusBadge";

const STATUS_OPTIONS = ["confirmed", "shipped", "delivered", "cancelled"];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders?role=seller");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: data.order.status } : o
        )
      );
    }

    setUpdating(null);
  };

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-lg">No orders yet.</p>
        <p className="text-sm mt-1">Orders will appear here once buyers purchase your products.</p>
      </div>
    );
  }

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const delivered = orders.filter((o) => o.status === "delivered").length;
  const pending = orders.filter((o) => o.status === "confirmed").length;

  return (
    <div>
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{delivered}</p>
          <p className="text-sm text-gray-500 mt-1">Delivered</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-sm text-gray-500 mt-1">Pending</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm p-5"
          >
            <div className="flex gap-4 items-start">
              {/* Product Image */}
              <img
                src={order.product?.images?.[0]}
                alt={order.product?.name}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />

              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {order.product?.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Buyer: {order.buyer?.name} ({order.buyer?.email})
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-6 mt-3">
                  <div>
                    <p className="text-xs text-gray-400">Quantity</p>
                    <p className="text-sm font-medium">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="text-sm font-medium text-green-600">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress?.street && (
                  <p className="text-xs text-gray-400 mt-2">
                    📍 {order.deliveryAddress.street},{" "}
                    {order.deliveryAddress.city},{" "}
                    {order.deliveryAddress.state} -{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                )}

                {/* Status Updater */}
                {order.status !== "delivered" &&
                  order.status !== "cancelled" && (
                    <div className="flex items-center gap-2 mt-4">
                      <p className="text-xs text-gray-500">Update status:</p>
                      <div className="flex gap-2">
                        {STATUS_OPTIONS.filter(
                          (s) => s !== order.status
                        ).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order._id, s)}
                            disabled={updating === order._id}
                            className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 capitalize transition"
                          >
                            {updating === order._id ? "..." : s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}