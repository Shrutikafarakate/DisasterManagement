import { useState } from "react";
import api from "../api";

export default function SOSButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const sendSOS = () => {
    setLoading(true);
    setStatus("");

    if (!navigator.geolocation) {
      setStatus("⚠ Unable to access location.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          await api.post("/sos/public", {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          });

          setStatus("🚨 SOS Sent!");
        } catch (err) {
          setStatus("❌ Failed to send SOS");
        }

        setLoading(false);

        // Auto-clear message after 4 sec
        setTimeout(() => setStatus(""), 4000);
      },
      () => {
        setStatus("⚠ Location permission denied.");
        setLoading(false);
      }
    );
  };

  return (
    <>
      {/* STATUS MESSAGE POPUP */}
      {status && (
        <div className="fixed bottom-24 right-6 bg-black/80 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-[9999]">
          {status}
        </div>
      )}

      {/* FLOATING SOS BUTTON */}
      <button
        onClick={sendSOS}
        disabled={loading}
        className={`fixed bottom-6 right-6 z-[9999] 
          w-16 h-16 rounded-full flex items-center justify-center 
          text-white font-bold text-lg shadow-2xl shadow-red-900/40
          transition-all active:scale-95 
          ${loading ? "bg-red-800/70" : "bg-red-600 hover:bg-red-500"}
        `}
      >
        {loading ? (
          <span className="animate-pulse text-sm">...</span>
        ) : (
          "SOS"
        )}
      </button>
    </>
  );
}
