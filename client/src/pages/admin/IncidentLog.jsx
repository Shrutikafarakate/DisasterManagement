import { useEffect, useState } from "react";
import api from "../../api";
import { normalizeAlert, formatDateOnly } from "../../utils/normalizeAdminData";

export default function IncidentLog() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState("ALL"); // Optional filter

  useEffect(() => {
    api.get("/admin/alerts")
      .then((res) => {
        // Filter out broadcasts, keep incidents/reports
        const reports = (res.data || []).filter((i) => i.typeTag === "INCIDENT" || i.typeTag === "REPORT");
        // Normalize all incident data using shared helper
        const normalized = reports.map(normalizeAlert);
        setIncidents(normalized);
      })
      .catch((err) => {
        console.error("Failed to load incidents:", err);
        // Set empty array on error to prevent crashes
        setIncidents([]);
      });
  }, []);

  const displayed = incidents.filter((i) => filter === "ALL" || i.typeTag === filter);

  return (
    <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
      <h3 className="text-xl font-bold text-white mb-6">Incident Log</h3>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "ALL" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("INCIDENT")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "INCIDENT" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Citizen
        </button>
        <button
          onClick={() => setFilter("REPORT")}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            filter === "REPORT" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Volunteer
        </button>
      </div>

      {/* Table */}
      {displayed.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-slate-500 uppercase text-xs">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Source</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((i) => (
                <tr key={i._id} className="border-b border-slate-800">
                  <td className="p-3">{i.title}</td>
                  <td className="p-3">{i.source || i.typeTag}</td>
                  <td className="p-3">{i.severity}</td>
                  <td className="p-3">{i.status}</td>
                  <td className="p-3">
                    {formatDateOnly(i.createdAt, "Date unavailable")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500 text-center">No incidents logged.</p>
      )}
    </div>
  );
}