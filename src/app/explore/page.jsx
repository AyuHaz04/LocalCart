"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ShopsMap = dynamic(() => import("@/components/maps/ShopsMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%",
      height: "500px",
      background: "#F5ECD9",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <p style={{ color: "#9B7B54", fontSize: "14px" }}>Loading map...</p>
    </div>
  ),
});

export default function ExplorePage() {
  const [shops, setShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          fetchNearbyShops(loc.lng, loc.lat);
        },
        () => {
          setLocationError("Location access denied. Showing all shops instead.");
          fetchNearbyShops(88.3639, 22.5726);
        }
      );
    } else {
      fetchNearbyShops(88.3639, 22.5726);
    }
  }, []);

  const fetchNearbyShops = async (lng, lat) => {
    const res = await fetch(`/api/shops/nearby?lng=${lng}&lat=${lat}&radius=50`);
    const data = await res.json();
    setShops(data.shops || []);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-dark)", marginBottom: "6px" }}>
          Explore Local Shops
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
          Discover artisans and makers near you
        </p>
      </div>

      {/* Location Warning */}
      {locationError && (
        <div style={{
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          color: "#92400E",
          padding: "10px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          marginBottom: "1.25rem",
        }}>
          {locationError}
        </div>
      )}

      {/* Map */}
      <div style={{ marginBottom: "2rem" }}>
        <ShopsMap
          shops={shops}
          userLocation={userLocation}
          onShopClick={setSelectedShop}
        />
      </div>

      {/* Selected Shop Banner */}
      {selectedShop && (
        <div style={{
          background: "white",
          border: "1.5px solid #C4975A",
          borderRadius: "14px",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {selectedShop.logo ? (
              <img
                src={selectedShop.logo}
                alt={selectedShop.name}
                style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "#F5ECD9", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "22px",
              }}>🧵</div>
            )}
            <div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#2C1A0E" }}>
                {selectedShop.name}
              </p>
              <p style={{ fontSize: "13px", color: "#9B7B54", marginTop: "2px" }}>
                📍 {selectedShop.location.address}
              </p>
            </div>
          </div>
          <Link
            href={`/shop/${selectedShop._id}`}
            style={{
              background: "#8B6435",
              color: "white",
              padding: "9px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Visit Shop →
          </Link>
        </div>
      )}

      {/* Shops Count */}
      <h2 style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#2C1A0E",
        marginBottom: "1rem",
      }}>
        {loading ? "Finding shops near you..." : `${shops.length} shop${shops.length !== 1 ? "s" : ""} found nearby`}
      </h2>

      {/* Empty State */}
      {!loading && shops.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "4rem 1rem",
          color: "#9B7B54",
        }}>
          <p style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</p>
          <p style={{ fontSize: "15px", marginBottom: "8px", color: "#6B4C2A" }}>
            No shops found in your area yet.
          </p>
          <Link
            href="/register"
            style={{ fontSize: "13px", color: "#8B6435", textDecoration: "none" }}
          >
            Be the first seller in your area →
          </Link>
        </div>
      )}

      {/* Shops Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1.25rem",
      }}>
        {shops.map((shop) => (
              <Link
            key={shop._id}
            href={`/shop/${shop._id}`}
            style={{
              background: "white",
                  border: "1px solid #E0C9A6",
              borderRadius: "14px",
              overflow: "hidden",
              textDecoration: "none",
              display: "block",
            }}
          >
            {shop.logo ? (
              <img
                src={shop.logo}
                alt={shop.name}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "160px",
                background: "#F5ECD9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
              }}>
                🧵
              </div>
            )}
            <div style={{ padding: "1rem" }}>
              <h3 style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#2C1A0E",
                marginBottom: "4px",
              }}>
                {shop.name}
              </h3>
              <p style={{
                fontSize: "13px",
                color: "#9B7B54",
                lineHeight: "1.5",
                marginBottom: "10px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {shop.description}
              </p>
              <p style={{ fontSize: "12px", color: "#9B7B54" }}>
                📍 {shop.location.address}
              </p>
              <div style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #E0C9A6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{
                  fontSize: "11px",
                  background: "#F5ECD9",
                  color: "#8B6435",
                  padding: "3px 10px",
                  borderRadius: "999px",
                }}>
                  🚚 {shop.deliveryRadius}km radius
                </span>
                <span style={{ fontSize: "12px", color: "#8B6435", fontWeight: "500" }}>
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}