"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ShopForm from "@/components/seller/ShopForm";
import ProductForm from "@/components/seller/ProductForm";
import ProductList from "@/components/seller/ProductList";
import SellerOrders from "@/components/seller/SellerOrders";

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("shop");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session.user.role !== "seller") {
      router.push("/");
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated") fetchShop();
  }, [status]);

  const fetchShop = async () => {
    const res = await fetch("/api/shop");
    const data = await res.json();
    setShop(data.shop);
    setLoading(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: "shop", label: "My Shop", always: true },
    { id: "products", label: "Products", requiresShop: true },
    { id: "orders", label: "Orders", requiresShop: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Seller Dashboard
      </h1>
      <p className="text-gray-500 mb-8">Manage your shop, products and orders</p>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.requiresShop && !shop}
            className={`pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            } disabled:opacity-40`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "shop" && (
        <ShopForm shop={shop} onShopCreated={(s) => setShop(s)} />
      )}

      {activeTab === "products" && shop && (
        <div className="space-y-10">
          <ProductForm shopId={shop._id} />
          <ProductList shopId={shop._id} />
        </div>
      )}

      {activeTab === "orders" && shop && (
        <SellerOrders />
      )}
    </div>
  );
}