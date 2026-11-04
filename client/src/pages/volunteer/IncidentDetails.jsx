import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/volunteer/incidents/${id}`)
      .then((res) => setIncident(res.data))
      .catch((err) => setError("Failed to load incident details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async () => {
    // UPDATED: Allow Self-Deploy ONLY if PENDING
    if (incident?.status !== "PENDING") return;

    setProcessing(true);
    try {
      await api.put(`/volunteer/incidents/${id}/accept`);
      setIncident((prev) => ({ ...prev, status: "IN_PROGRESS" }));
    } catch (err) {
      alert("Failed to accept incident. It may have been taken or resolved.");
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (incident?.status !== "IN_PROGRESS") return;

    setProcessing(true);
    try {
      await api.put(`/volunteer/incidents/${id}/complete`);
      setIncident((prev) => ({ ...prev, status: "COMPLETED" }));
    } catch (err) {
      alert("Failed to complete incident.");
    } finally {
      setProcessing(false);
    }
  };

  const getDirections = () => {
    if (!incident) return;
    let url = "";

    if (incident.location?.lat && incident.location?.lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${incident.location.lat},${incident.location.lng}`;
    } else if (incident.location?.address) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        incident.location.address
      )}`;
    } else if (typeof incident.location === 'string') {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(incident.location)}`;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) return <div className="p-10 text-slate-500 font-mono animate-pulse">Loading tactical data...</div>;
  if (error || !incident) return <div className="p-10 text-red-500 font-bold">{error || "Incident not found."}</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-t-2xl p-8 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex flex-col gap-2">
            <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">
              Incident ID: #{incident._id ? incident._id.slice(-6).toUpperCase() : "UNKNOWN"}
            </span>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider ${incident.severity === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/30" :
                incident.severity === "HIGH" ? "bg-orange-500/10 text-orange-500 border-orange-500/30" :
                  "bg-blue-500/10 text-blue-400 border-blue-500/30"
                }`}>
                {incident.severity || "NORMAL"}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase">
                {incident.sourceType === "CITIZEN" ? "CITIZEN REPORT" : incident.sourceType || "SYSTEM"}
              </span>
            </div>
          </div>
          <span className="text-slate-500 text-xs font-mono">
            {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : ""}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6 leading-tight relative z-10">
          {incident.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-6">
          <div className="flex-1 flex items-center gap-2 text-sm text-slate-300 font-mono bg-slate-950/50 p-4 rounded-lg border border-slate-800">
            <span>Location: </span>
            {incident.location?.address
              ? incident.location.address
              : (typeof incident.location === 'string' ? incident.location : 'Location unavailable')}
          </div>

          <button
            onClick={getDirections}
            className="
              w-full md:w-auto px-6 py-3 rounded-lg font-semibold
              flex items-center justify-center gap-2
              border border-emerald-500/30
              text-emerald-300
              bg-emerald-500/10
              hover:bg-emerald-500/20
              hover:text-emerald-200
              transition-all whitespace-nowrap
            "
          >
            Get Directions →
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-x border-b border-slate-800 rounded-b-2xl p-8">

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">
            Situation Criteria
          </h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
            {incident.description}
          </p>
        </div>

        {/* Status & Source Grid */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/30 rounded border border-slate-800">
            <span className="block text-[10px] text-slate-500 uppercase mb-1 tracking-wider">Current Status</span>
            <span className={`font-bold text-sm ${incident.status === "PENDING" ? "text-orange-400" :
              incident.status === "ACTIVE" ? "text-red-400" :
                incident.status === "IN_PROGRESS" ? "text-blue-400" :
                  incident.status === "RESOLVED" || incident.status === "COMPLETED" ? "text-emerald-400" :
                    "text-slate-400"
              }`}>
              {incident.status}
            </span>
          </div>
          <div className="p-4 bg-slate-950/30 rounded border border-slate-800">
            <span className="block text-[10px] text-slate-500 uppercase mb-1 tracking-wider">Reporter</span>
            <span className="text-slate-300 font-mono text-sm uppercase">
              {incident.citizen ? "Verified Citizen" : "Anonymous Reporter"}
            </span>
          </div>
        </div>

        {/* Admin Replies Section (Read-Only) */}
        {incident.adminReplies && incident.adminReplies.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">
              Command Center Updates
            </h3>
            <div className="space-y-3">
              {incident.adminReplies.map((reply, idx) => (
                <div key={idx} className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-lg">
                  <p className="text-blue-200 text-sm mb-2">{reply.message}</p>
                  <span className="text-[10px] text-blue-400/60 font-mono">
                    {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : "Unknown Time"} • Admin Command
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-800 pt-6 mt-6">
          <button
            onClick={() => navigate(-1)} // Go back
            className="px-6 py-3 rounded-lg text-slate-400 hover:text-white font-medium text-xs uppercase tracking-wider transition-colors hover:bg-slate-800"
          >
            Cancel / Back
          </button>

          {/* ACTION BUTTON LOGIC */}
          {/* ACTION BUTTON LOGIC */}
          {/* 1. Self-Deploy (REMOVED - STRICT ADMIN ASSIGNMENT ONLY) */}

          {/* 2. RESOLVE INCIDENT (Strictly IN_PROGRESS) */}

          {/* 2. RESOLVE INCIDENT (Strictly IN_PROGRESS) */}
          {incident.status === "IN_PROGRESS" && (
            <button
              onClick={async () => {
                if (window.confirm("Mark this incident as RESOLVED?")) {
                  setProcessing(true);
                  try {
                    await api.put(`/volunteer/incidents/${id}/resolve`); // Updated Endpoint
                    setIncident((prev) => ({ ...prev, status: "COMPLETED" }));
                  } catch (err) {
                    alert("Failed to resolve incident.");
                  } finally {
                    setProcessing(false);
                  }
                }
              }}
              disabled={processing}
              className="px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 hover:shadow-emerald-900/40 transform hover:-translate-y-0.5"
            >
              {processing ? "Processing..." : "MARK INCIDENT RESOLVED"}
            </button>
          )}

          {/* 3. COMPLETED STATE */}
          {["COMPLETED", "RESOLVED"].includes(incident.status) && (
            <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span>Success: </span> Incident successfully resolved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
