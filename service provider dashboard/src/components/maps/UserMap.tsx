
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface UserMapProps {
  location: [number, number];
}

export const UserMap = ({ location }: UserMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(location, 13);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    } else {
      // Update view if map already exists
      mapInstanceRef.current.setView(location, 13);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Add marker for the user's location
    const marker = L.marker(location).addTo(mapInstanceRef.current);
    
    // Create a circle to highlight the area
    const circle = L.circle(location, {
      color: "#2563eb",
      fillColor: "#3b82f6",
      fillOpacity: 0.1,
      radius: 500, // 500 meters
    }).addTo(mapInstanceRef.current);

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};
