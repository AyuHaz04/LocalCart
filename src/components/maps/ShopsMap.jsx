"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Fix default marker icons broken in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// User location blue dot icon
const userIcon = new L.DivIcon({
  html: `<div style="
    width:16px; height:16px;
    background:#3b82f6;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 0 3px rgba(59,130,246,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  className: "",
});

// Shop emoji icon
const shopIcon = new L.DivIcon({
  html: `<div style="
    width:40px; height:40px;
    background:white;
    border:2px solid #3b82f6;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:18px;
    box-shadow:0 2px 8px rgba(0,0,0,0.15);
  ">🧵</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  className: "",
});

// Helper to fly to user location when it changes
function FlyToLocation({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13);
    }
  }, [location]);
  return null;
}

export default function ShopsMap({ shops = [], userLocation, onShopClick }) {
  const defaultCenter = [22.5726, 88.3639]; // Kolkata

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ width: "100%", height: "500px", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Fly to user when location is available */}
      {userLocation && <FlyToLocation location={userLocation} />}

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>📍 You are here</Popup>
        </Marker>
      )}

      {/* Shop markers */}
      {shops.map((shop) => {
        const [lng, lat] = shop.location.coordinates;
        return (
          <Marker
            key={shop._id}
            position={[lat, lng]}
            icon={shopIcon}
            eventHandlers={{
              click: () => onShopClick && onShopClick(shop),
            }}
          >
            <Popup>
              <div style={{ minWidth: "150px" }}>
                {shop.logo && (
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    style={{
                      width: "100%",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "6px",
                    }}
                  />
                )}
                <strong>{shop.name}</strong>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 8px" }}>
                  {shop.location.address}
                </p>
                
                 <a href={`/shop/${shop._id}`}
                  style={{
                    display: "block",
                    background: "#3b82f6",
                    color: "white",
                    textAlign: "center",
                    padding: "6px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    textDecoration: "none",
                  }}
                >
                  View Shop →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}