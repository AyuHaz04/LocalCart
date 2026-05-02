"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component that listens to map clicks
function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect([lng, lat]); // store as [lng, lat] for MongoDB
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect }) {
  const [markerPos, setMarkerPos] = useState(null); // [lat, lng] for display

  const handleSelect = ([lng, lat]) => {
    setMarkerPos([lat, lng]);
    onLocationSelect([lng, lat]); // pass [lng, lat] to parent
  };

  return (
    <div>
      <MapContainer
        center={[22.5726, 88.3639]} // default: Kolkata
        zoom={12}
        style={{ width: "100%", height: "300px", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={handleSelect} />
        {markerPos && <Marker position={markerPos} />}
      </MapContainer>

      {markerPos ? (
        <p className="text-sm text-green-600 mt-2">
          ✅ Location selected: {markerPos[0].toFixed(5)}, {markerPos[1].toFixed(5)}
        </p>
      ) : (
        <p className="text-sm text-gray-400 mt-2">
          👆 Click on the map to set your shop location
        </p>
      )}
    </div>
  );
}