"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session.user.role !== "buyer") {
      router.push("/");
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated") fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders?role=buyer");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">Track all your purchases</p>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-lg">You haven't ordered anything yet.</p>
          <Link
            href="/explore"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Start exploring shops →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm p-5 flex gap-5 items-start"
            >
              {/* Product Image */}
              <img
                src={order.product?.images?.[0]}
                alt={order.product?.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />

              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {order.product?.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Sold by {order.seller?.name}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-6 mt-3">
                  <div>
                    <p className="text-xs text-gray-400">Quantity</p>
                    <p className="text-sm font-medium text-gray-700">
                      {order.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Paid</p>
                    <p className="text-sm font-medium text-blue-600">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ordered On</p>
                    <p className="text-sm font-medium text-gray-700">
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
                  <p className="text-xs text-gray-400 mt-3">
                    📍 {order.deliveryAddress.street},{" "}
                    {order.deliveryAddress.city},{" "}
                    {order.deliveryAddress.state} -{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}