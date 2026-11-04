import { useState } from "react";
import api from "../../api";
import LocationMap from "../../components/LocationMap";

export default function CitizenReport() {
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [selectedCoordinates, setSelectedCoordinates] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "GENERAL",
    severity: "LOW",
    description: "",
    address: ""
  });

  const change = (e) => {
    if (e.target.name === "address") {
      setSelectedCoordinates("");
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (coords) => {
    setSelectedCoordinates(coords);
    setForm((prev) => ({ ...prev, address: coords }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    try {
      const coordinateMatch = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/.exec(
        (selectedCoordinates || form.address).trim()
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
      const payload = {
        title: form.title,
        type: form.type,
        severity: form.severity,
        description: form.description,
        location: {
          address: form.address,
          ...(hasCoordinates ? { lat: coordinates[0], lng: coordinates[1] } : {}),
        },
      };

      await api.post("/citizen/incidents", payload);
      setMsg({ type: "success", text: "Incident Reported Successfully. Stand by for updates." });
      setForm({ title: "", type: "GENERAL", severity: "LOW", description: "", address: "" });
      setSelectedCoordinates("");
    } catch (err) {
      console.error("Submission Error:", err);
      setMsg({ type: "error", text: "Submission Failed. Please check connection." });
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">

      {/* HEADER */}
      <div className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Report Incident</h1>
        <p className="text-slate-400 font-medium">File a distress signal or report a hazard in your area.</p>
      </div>

      {/* STATUS MESSAGE */}
      {msg.text && (
        <div className={`p-4 mb-8 rounded-xl border flex items-center gap-3 shadow-lg ${msg.type === "error"
          ? "bg-red-500/10 border-red-500/50 text-red-400"
          : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
          }`}>
          <span className="text-xl font-bold">{msg.type === "error" ? "Error:" : "Success:"}</span>
          <span className="font-bold text-sm uppercase tracking-wide">{msg.text}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={submit}>
          <div className="grid min-w-0 grid-cols-1 xl:grid-cols-2 gap-10">

            {/* LEFT COLUMN: INPUTS */}
            <div className="min-w-0 space-y-6">

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Incident Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={change}
                  required
                  placeholder="E.g., Severe Flooding in Sector 4"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-slate-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={change}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="GENERAL">General Issue</option>
                    <option value="FIRE">Fire Outbreak</option>
                    <option value="FLOOD">Flooding</option>
                    <option value="MEDICAL">Medical Emergency</option>
                    <option value="ACCIDENT">Road Accident</option>
                    <option value="STRUCTURAL">Building Collapse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Severity</label>
                  <select
                    name="severity"
                    value={form.severity}
                    onChange={change}
                    className={`w-full bg-slate-950 border rounded-lg px-4 py-3 text-sm font-bold outline-none transition-all cursor-pointer ${form.severity === 'CRITICAL' ? 'border-red-500 text-red-500' :
                      form.severity === 'HIGH' ? 'border-orange-500 text-orange-500' : 'border-slate-700 text-white'
                      }`}
                  >
                    <option value="LOW">Low (Minor)</option>
                    <option value="MEDIUM">Medium (Urgent)</option>
                    <option value="HIGH">High (Serious)</option>
                    <option value="CRITICAL">CRITICAL (Life Threat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Location / Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={change}
                  required
                  placeholder="Type a place or click the map to set the location..."
                  className={`w-full bg-slate-950 border rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all font-mono ${form.address ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700'
                    }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={change}
                  required
                  rows="5"
                  placeholder="Provide details about the situation, number of people affected, etc."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all resize-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: MAP */}
            <div className="flex min-w-0 flex-col">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pinpoint Location
              </label>

              <div className="relative h-[min(60vh,550px)] min-h-[350px] w-full overflow-hidden rounded-xl border border-slate-700 shadow-xl">
                <LocationMap
                  onSelect={handleLocationSelect}
                  onLocationFound={setSelectedCoordinates}
                  searchQuery={form.address}
                  severity={form.severity}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/30 transition-all transform hover:scale-[1.02] tracking-widest text-sm uppercase"
              >
                SUBMIT EMERGENCY REPORT
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}