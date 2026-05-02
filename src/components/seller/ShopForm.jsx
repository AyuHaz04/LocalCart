"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import dynamic from "next/dynamic";
const LocationPicker = dynamic(
  () => import("@/components/maps/LocationPicker"),
  { ssr: false, loading: () => <p className="text-sm text-gray-400">Loading map...</p> }
);

export default function ShopForm({ shop, onShopCreated }) {
  const [formData, setFormData] = useState({
    name: shop?.name || "",
    description: shop?.description || "",
    address: shop?.location?.address || "",
    deliveryRadius: shop?.deliveryRadius || 10,
  });
  const [logo, setLogo] = useState(shop?.logo || "");
  const [coordinates, setCoordinates] = useState(
    shop?.location?.coordinates || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!coordinates) {
      setError("Please select your shop location on the map");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, coordinates, logo }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setSuccess("Shop created successfully!");
    onShopCreated(data.shop);
    setLoading(false);
  };

  if (shop) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          {shop.logo && (
            <img
              src={shop.logo}
              alt="Shop logo"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{shop.name}</h2>
            <p className="text-gray-500 text-sm">{shop.location?.address}</p>
          </div>
        </div>
        <p className="text-gray-600">{shop.description}</p>
        <p className="text-sm text-gray-400 mt-2">
          Delivery radius: {shop.deliveryRadius} km
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Create Your Shop
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Priya's Pottery"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell buyers what you make..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Radius (km)
          </label>
          <input
            type="number"
            name="deliveryRadius"
            value={formData.deliveryRadius}
            onChange={handleChange}
            min={1}
            max={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Location (click map to pin)
          </label>
          <LocationPicker onLocationSelect={setCoordinates} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Logo
          </label>
          {logo && (
            <img
              src={logo}
              alt="Logo preview"
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
          )}
          <UploadButton
            endpoint="shopLogo"
            onClientUploadComplete={(res) => setLogo(res[0].url)}
            onUploadError={(error) =>
              setError("Logo upload failed: " + error.message)
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Creating shop..." : "Create Shop"}
        </button>
      </form>
    </div>
  );
}