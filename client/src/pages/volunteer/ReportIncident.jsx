import { useState, useEffect } from "react";
import api from "../../api";
import LocationMap from "../../components/LocationMap";

export default function ReportIncident() {
  const [reports, setReports] = useState([]);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [selectedCoordinates, setSelectedCoordinates] = useState("");
  
  const [form, setForm] = useState({
    missionId: "",
    type: "GENERAL",
    description: "",
    location: ""
  });

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const res = await api.get("/reports/me");
      setReports(res.data);
    } catch { console.error("History Error"); }
  };

  const change = (e) => {
    if (e.target.name === "location") {
      setSelectedCoordinates("");
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLocationSelect = (coords) => {
    setSelectedCoordinates(coords);
    setForm((prev) => ({ ...prev, location: coords }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      const coordinateMatch = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/.exec(
        (selectedCoordinates || form.location).trim()
      );
      const coordinates = coordinateMatch
        ? [Number(coordinateMatch[1]), Number(coordinateMatch[2])]
        : [];
      const hasCoordinates =
        coordinates.length === 2 &&
        coordinates[0] >= -90 &&
        coordinates[0] <= 90 &&
        coordinates[1] >= -180 &&
        coordinates[1] <= 180;
      await api.post("/reports", {
        ...form,
        location: {
          address: form.location,
          ...(hasCoordinates ? { lat: coordinates[0], lng: coordinates[1] } : {}),
        },
      });
      setMsg({ type: "success", text: "INTEL LOGGED SUCCESSFULLY" });
      setForm({ missionId: "", type: "GENERAL", description: "", location: "" });
      setSelectedCoordinates("");
      loadHistory();
    } catch { setMsg({ type: "error", text: "UPLOAD FAILED" }); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-1">Field Reporting</h1>
          <p className="text-slate-400 font-medium text-sm">Submit tactical updates and mission status.</p>
        </div>
        <div className="text-xs font-mono text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded bg-emerald-500/10">
          UPLINK ACTIVE
        </div>
      </div>

      {msg.text && (
        <div className={`p-4 mb-8 rounded border flex items-center gap-3 ${msg.type === "error" ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"}`}>
          <span className="font-bold text-sm font-mono">{msg.text}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            <div className="space-y-5">
              {/* Mission ID Field - Unique to Volunteers */}
              <div>
                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2" required>Linked Mission ID </label>
                <input name="missionId" value={form.missionId} onChange={change} placeholder="Enter Mission Code" className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white text-sm focus:border-blue-500 outline-none font-mono" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2" required>Report Type</label>
                <select name="type" value={form.type} onChange={change} className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white text-sm focus:border-blue-500 outline-none cursor-pointer">
                  <option value="GENERAL">General Update</option>
                  <option value="DAMAGE">Damage Assessment</option>
                  <option value="HAZARD">Hazard / Risk</option>
                  <option value="MEDICAL">Medical Situation</option>
                  <option value="SUPPLIES">Logistics Request</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2" required>Coordinates</label>
                <input name="location" value={form.location} onChange={change} placeholder="Type a place or select it on the map..." required className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white text-sm focus:border-blue-500 outline-none font-mono" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2" required>Intel Description</label>
                <textarea name="description" value={form.description} onChange={change} required rows="4" placeholder="Situation details..." className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="flex flex-col h-full">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2" required>Geo-Tagging</label>
              <div className="relative h-[min(60vh,550px)] min-h-[350px] w-full overflow-hidden rounded border border-slate-700">
                <LocationMap
                  onSelect={handleLocationSelect}
                  onLocationFound={setSelectedCoordinates}
                  searchQuery={form.location}
                />
              </div>
              <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded text-sm tracking-widest transition-colors shadow-lg shadow-blue-900/20">
                TRANSMIT REPORT
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* History Log */}
      <div className="mt-16">
        <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Transmission Log</h2>
        <div className="space-y-4">
          {reports.length === 0 && <p className="text-slate-600 text-xs italic">No reports filed.</p>}
          
          {reports.map((r) => (
            <div key={r._id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">{r.type}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-300">{r.description}</p>
              </div>
              <div className="text-right min-w-[120px]">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                <span className={`text-xs font-bold ${r.status === 'RESOLVED' ? 'text-emerald-500' : 'text-amber-500'}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}