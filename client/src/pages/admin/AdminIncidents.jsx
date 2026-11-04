import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { normalizeAlert, formatDateOnly } from "../../utils/normalizeAdminData";

export default function AdminIncidents() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("live"); // 'live' | 'history'

  useEffect(() => {
    fetchIncidents();
  }, []); // Only run once on mount

  const fetchIncidents = async () => {
    setLoading(true);
    setAlerts([]);

    try {
      // STRICT: Always fetch CITIZEN incidents only
      const queryType = "CITIZEN_INCIDENT";

      const res = await api.get(`/admin/alerts?type=${queryType}`);

      // Normalize data
      const normalized = (res.data || []).map(normalizeAlert);
      setAlerts(normalized);
    } catch (err) {
      console.error("Failed to load incidents", err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter alerts based on active tab
  const filteredAlerts = alerts.filter((a) => {
    const isCompleted = a.status === "COMPLETED";
    return activeTab === "history" ? isCompleted : !isCompleted;
  });

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 animate-fade-in-up">
      {/* Tab Interface */}
      <div className="flex gap-4 mb-6 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab("live")}
          className={`pb-4 px-2 text-lg font-bold transition-all relative ${activeTab === "live"
            ? "text-white"
            : "text-slate-500 hover:text-slate-400"
            }`}
        >
          <div className="flex items-center gap-3">
            {activeTab === "live" && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
            Live Incidents
          </div>
          {activeTab === "live" && (
            <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-red-500 rounded-t-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-4 px-2 text-lg font-bold transition-all relative ${activeTab === "history"
            ? "text-white"
            : "text-slate-500 hover:text-slate-400"
            }`}
        >
          Incident History
          {activeTab === "history" && (
            <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 animate-pulse font-mono">
          Fetching live data stream...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              {activeTab === "live"
                ? "No active citizen reports found."
                : "No incident history found."}
            </div>
          )}

          {filteredAlerts.map((a) => (
            <div
              key={a._id}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-500 transition-all group flex flex-col h-full shadow-lg"
            >
              <div className="flex justify-between text-xs font-mono text-slate-500 mb-3">
                <span className="uppercase tracking-wider">{a.type || "INCIDENT"}</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${a.severity === "HIGH" || a.severity === "CRITICAL"
                    ? "bg-red-500/10 text-red-500"
                    : a.severity === "MEDIUM"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-emerald-500/10 text-emerald-500"
                    }`}
                >
                  {a.severity || "LOW"}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                {a.title || "Untitled Incident"}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 mb-4 flex-grow">
                {a.description || a.message || "No details provided..."}
              </p>

              <div className="flex justify-between items-end text-[10px] text-slate-600 font-mono mb-4 pt-3 border-t border-slate-700/50 mt-auto">
                <div className="flex flex-col">
                  {/* Source removed or minimized */}
                  <span className="text-slate-500 mb-0.5">Reported By:</span>
                  <span className="text-slate-400 font-bold max-w-[120px] truncate">{a.source || a.author || "Citizen"}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block mb-0.5">Time:</span>
                  <span>{formatDateOnly(a.createdAt, "Just now")}</span>
                </div>
              </div>

              {/* Action Button */}
              {["COMPLETED", "RESOLVED"].includes(a.status) ? (
                <div className="mt-auto w-full py-3 rounded-lg bg-slate-800/30 border border-slate-700/30 text-center cursor-default">
                  <span className={`text-xs font-bold uppercase tracking-widest ${a.status === 'COMPLETED' ? 'text-emerald-500/50' : 'text-slate-600'}`}>
                    {a.status}
                  </span>
                </div>
              ) : (
                <Link to={`/admin/incidents/${a._id}`} className="mt-auto">
                  <button className="w-full bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold py-3 rounded-lg transition-colors border border-slate-700 uppercase tracking-wide">
                    Review Incident
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}