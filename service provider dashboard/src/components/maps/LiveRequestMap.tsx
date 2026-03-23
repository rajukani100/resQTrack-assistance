
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LiveRequestMapProps {
  requests: any[];
}

export const LiveRequestMap = ({ requests }: LiveRequestMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !requests.length) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // Use London as default center (can be changed)
      mapInstanceRef.current = L.map(mapRef.current).setView([51.505, -0.09], 12);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Create a group for all markers to auto-zoom
    const markers = L.featureGroup();

    // Add markers for all requests
    requests.forEach((request) => {
      if (!request.coordinates) return;

      // Create a marker with custom icon based on status
      const markerColor = 
        request.status === "Completed" ? "green" :
        request.status === "Cancelled" ? "red" :
        request.status === "Processing" ? "blue" :
        request.status === "Scheduled" ? "purple" : "orange";

      const marker = L.marker(request.coordinates);
      
      // Add popup with request info
      marker.bindPopup(`
        <div>
          <h3 style="font-weight: bold; margin-bottom: 4px;">${request.client}</h3>
          <p style="margin-bottom: 4px;">${request.type}: ${request.vehicle}</p>
          <p style="margin-bottom: 4px;"><strong>Status:</strong> ${request.status}</p>
          <p style="margin-bottom: 4px;"><strong>Time:</strong> ${request.time}</p>
          <p style="margin-bottom: 4px;"><strong>Location:</strong> ${request.location}</p>
        </div>
      `);
      
      marker.addTo(mapInstanceRef.current!);
      markers.addLayer(marker);
    });

    // Auto-zoom to fit all markers if we have any
    if (markers.getLayers().length > 0) {
      mapInstanceRef.current.fitBounds(markers.getBounds(), {
        padding: [50, 50],
      });
    }

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [requests]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};
