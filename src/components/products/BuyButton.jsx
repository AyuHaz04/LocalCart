"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Load Razorpay script as soon as component mounts
function useRazorpay() {
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);
}

export default function BuyButton({ product, inStock }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Load script on mount so it's ready when user clicks
  useRazorpay();

  const handleBuy = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }

    if (!address.street || !address.city || !address.state || !address.pincode) {
      alert("Please fill in all address fields");
      return;
    }

    setLoading(true);

    // Create Razorpay order on server
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity: 1 }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      setLoading(false);
      return;
    }

    // Open Razorpay popup immediately after getting order
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "LocalCraft",
      description: data.productName,
      image: data.productImage,
      order_id: data.orderId,
      handler: async function (response) {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            productId: product._id,
            quantity: 1,
            totalAmount: data.amount / 100,
            deliveryAddress: address,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          router.push("/checkout/success");
        } else {
          alert("Payment verification failed. Contact support.");
        }
      },
      prefill: {
        name: data.buyerName,
        email: data.buyerEmail,
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
    setLoading(false);
  };

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-medium cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {showAddressForm && (
        <div className="bg-gray-50 p-4 rounded-xl space-y-3">
          <h3 className="font-medium text-gray-700">Delivery Address</h3>
          <input
            type="text"
            placeholder="Street address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition text-lg"
      >
        {loading
          ? "Processing..."
          : showAddressForm
          ? "Proceed to Pay 💳"
          : "Buy Now 💳"}
      </button>
    </div>
  );
}