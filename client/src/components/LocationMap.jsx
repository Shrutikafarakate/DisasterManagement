import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// India Center Coordinates
const INDIA_CENTER = [20.5937, 78.9629];

// Define colors based on severity
const SEVERITY_COLORS = {
  LOW: "#facc15",      // Yellow
  MEDIUM: "#f97316",   // Orange
  HIGH: "#ef4444",     // Red
  CRITICAL: "#ff0000"  // Bright Red
};

function ClickHandler({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

function ResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(container);
    const frame = requestAnimationFrame(() => map.invalidateSize({ pan: false }));

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

function FlyToPosition({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 12), { duration: 1 });
    }
  }, [map, position]);

  return null;
}

export default function LocationMap({
  onSelect,
  onLocationFound,
  searchQuery = "",
  severity = "LOW",
}) {
  const [position, setPosition] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");
  const onSelectRef = useRef(onSelect);
  const onLocationFoundRef = useRef(onLocationFound);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    onLocationFoundRef.current = onLocationFound;
  }, [onLocationFound]);

  const handleSelect = (latlng) => {
    setPosition(latlng);
    // Format coordinates for the form
    const locString = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    onSelectRef.current(locString);
  };

  useEffect(() => {
    const query = searchQuery.trim();
    const coordinateMatch = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/.exec(query);

    if (!query) {
      setPosition(null);
      setSearchStatus("");
      return undefined;
    }

    if (coordinateMatch) {
      const lat = Number(coordinateMatch[1]);
      const lng = Number(coordinateMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setPosition({ lat, lng });
        setSearchStatus("Coordinates selected. Adjust the pin on the map if needed.");
      }
      return undefined;
    }

    setPosition(null);
    if (query.length < 3) {
      setSearchStatus("");
      return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSearchStatus("Searching for location...");

      try {
        const params = new URLSearchParams({
          q: query,
          format: "jsonv2",
          limit: "1",
        });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Location search failed with status ${response.status}`);
        }

        const results = await response.json();
        const result = results[0];
        if (!result) {
          setSearchStatus("Location not found. Try a more specific place.");
          return;
        }

        const lat = Number(result.lat);
        const lng = Number(result.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          throw new Error("Location search returned invalid coordinates");
        }

        setPosition({ lat, lng });
        setSearchStatus("Location found. Adjust the pin on the map if needed.");
        onLocationFoundRef.current?.(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Location search error:", error);
          setSearchStatus("Location search unavailable. Please try again.");
        }
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  // Create custom icon based on severity
  const getIcon = () => {
    const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.LOW;
    const isCritical = severity === "CRITICAL";

    return L.divIcon({
      className: "custom-marker-container",
      html: `<div style="width:24px;height:24px;border:3px solid #fff;border-radius:50%;background:${color};box-shadow:0 0 0 4px ${color}66,0 2px 8px #000;${isCritical ? "outline:3px solid #ff000080;outline-offset:3px;" : ""}"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div style={{ height: "100%", minHeight: "300px", width: "100%", borderRadius: "12px", overflow: "hidden", position: "relative", border: "1px solid var(--glass-border)" }}>
      <MapContainer 
        center={INDIA_CENTER} 
        zoom={5} 
        style={{ height: "100%", width: "100%", background: "#0f172a" }}
        scrollWheelZoom={true}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

        <ResizeHandler />
        <FlyToPosition position={position} />
        <ClickHandler setLocation={handleSelect} />

        {position && <Marker position={position} icon={getIcon()} />}
      </MapContainer>
      
      {/* Tactical Overlay */}
      <div style={{
        position: "absolute", top: 10, right: 10, zIndex: 999,
        background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "4px",
        fontSize: "0.7rem", color: SEVERITY_COLORS[severity], border: `1px solid ${SEVERITY_COLORS[severity]}`
      }}>
        THREAT_LEVEL: {severity}
      </div>
      {searchStatus && (
        <div style={{
          position: "absolute", left: 10, bottom: 10, zIndex: 999,
          maxWidth: "calc(100% - 20px)", background: "rgba(0,0,0,0.75)",
          padding: "6px 10px", borderRadius: 4, fontSize: "0.75rem", color: "#fff"
        }}>
          {searchStatus}
        </div>
      )}
    </div>
  );
}