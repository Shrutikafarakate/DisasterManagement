import { useEffect } from "react";

export default function ConfirmBroadcastModal({ isOpen, onClose, onConfirm, broadcastData }) {
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && e.ctrlKey) {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  const severityConfig = {
    LOW: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    MEDIUM: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    HIGH: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
    CRITICAL: { color: "text-red-500", bg: "bg-red-600/20", border: "border-red-500/50" }
  };

  const config = severityConfig[broadcastData.severity] || severityConfig.LOW;
  const isCritical = broadcastData.severity === "CRITICAL";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isCritical ? 'border-red-500/30 bg-red-950/30' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-500' : 'bg-slate-700/50 text-slate-400'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Confirm Broadcast
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Review details before transmitting alert
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Critical Warning Banner */}
          {isCritical && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3 animate-pulse">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-red-500 font-black text-sm uppercase tracking-wider">
                  CRITICAL SEVERITY ALERT
                </p>
                <p className="text-red-400 text-xs mt-1">
                  This broadcast will trigger emergency protocols
                </p>
              </div>
            </div>
          )}

          {/* Broadcast Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Alert Title
              </label>
              <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3">
                <p className="text-white font-bold text-lg">{broadcastData.title}</p>
              </div>
            </div>

            {/* Incident Type & Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Incident Type
                </label>
                <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3">
                  <p className="text-white font-semibold">{broadcastData.incidentType}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Severity Level
                </label>
                <div className={`${config.bg} border ${config.border} rounded-lg px-4 py-3`}>
                  <p className={`${config.color} font-black uppercase text-sm tracking-wide`}>
                    {broadcastData.severity}
                  </p>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Target Audience
              </label>
              <div className="bg-slate-950 border border-blue-500/30 rounded-lg px-4 py-3">
                <p className="text-blue-400 font-semibold">Global Broadcast (All Users)</p>
              </div>
            </div>

            {/* Location */}
            {broadcastData.region && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Target Location
                </label>
                <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3">
                  <p className="text-white font-mono text-sm">{broadcastData.region}</p>
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Alert Message
              </label>
              <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {broadcastData.message}
                </p>
              </div>
            </div>

            {/* Public Instructions */}
            {broadcastData.instructions && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Public Instructions
                </label>
                <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {broadcastData.instructions}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 bg-slate-950/50 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 font-black rounded-xl transition-all transform hover:scale-[1.02] shadow-lg ${isCritical
                ? "bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:via-red-400 hover:to-orange-400 text-white shadow-red-900/50 animate-pulse"
                : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-red-900/30"
              }`}
          >
            {isCritical ? "BROADCAST CRITICAL ALERT" : "Confirm & Broadcast"}
          </button>
        </div>

        {/* Keyboard Hint */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-600">
            Press <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">Esc</kbd> to cancel or{" "}
            <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">Ctrl+Enter</kbd> to confirm
          </p>
        </div>
      </div>
    </div>
  );
}
