
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CompetitorsMapProps {
  competitors: any[];
  selectedId?: number | null;
  onSelect?: (competitor: any) => void;
}

export const CompetitorsMap = ({ 
  competitors, 
  selectedId,
  onSelect
}: CompetitorsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{[key: number]: L.Marker}>({});

  useEffect(() => {
    if (!mapRef.current || !competitors.length) return;

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
    
    markersRef.current = {};

    // Create a group for all markers to auto-zoom
    const markers = L.featureGroup();
    
    // Add a marker for your location (center of the map)
    const yourLocationMarker = L.marker([51.505, -0.09], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #2563eb; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [15, 15],
        iconAnchor: [8, 8]
      })
    }).addTo(mapInstanceRef.current);
    
    yourLocationMarker.bindPopup('<b>Your Location</b>');
    
    // Add circle around your location
    const circle = L.circle([51.505, -0.09], {
      color: '#2563eb',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      radius: 2000 // 2 km
    }).addTo(mapInstanceRef.current);

    // Add markers for all competitors
    competitors.forEach((competitor) => {
      if (!competitor.coordinates) return;

      // Create a marker
      const marker = L.marker(competitor.coordinates);
      
      // Store marker reference
      markersRef.current[competitor.id] = marker;
      
      // Add popup with competitor info
      marker.bindPopup(`
        <div>
          <h3 style="font-weight: bold; margin-bottom: 4px;">${competitor.name}</h3>
          <p style="margin-bottom: 4px;"><strong>Type:</strong> ${competitor.type}</p>
          <p style="margin-bottom: 4px;"><strong>Rating:</strong> ${competitor.rating}/5</p>
          <p style="margin-bottom: 4px;"><strong>Distance:</strong> ${competitor.distance}</p>
        </div>
      `);
      
      // Add click handler if onSelect is provided
      if (onSelect) {
        marker.on('click', () => {
          onSelect(competitor);
        });
      }
      
      marker.addTo(mapInstanceRef.current!);
      markers.addLayer(marker);
    });

    // Auto-zoom to fit all markers if we have any
    if (markers.getLayers().length > 0) {
      mapInstanceRef.current.fitBounds(markers.getBounds(), {
        padding: [50, 50],
      });
    }
    
    // Highlight selected competitor
    if (selectedId && markersRef.current[selectedId]) {
      const marker = markersRef.current[selectedId];
      mapInstanceRef.current.setView(marker.getLatLng(), 14);
      marker.openPopup();
    }

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [competitors, selectedId, onSelect]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};
