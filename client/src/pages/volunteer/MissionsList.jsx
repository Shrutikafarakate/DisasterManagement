import { useEffect, useState } from "react";
import api from "../../api";

export default function MissionsList() {
  const [missions, setMissions] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  // Load missions
  const loadMissions = () => {
    api.get("/volunteer/missions").then((res) => setMissions(res.data));
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const acceptMission = async (id) => {
    try {
      await api.put(`/volunteer/missions/${id}/accept`);
      loadMissions();
    } catch {
      alert("Error");
    }
  };

  const completeMission = async (id) => {
    if (!window.confirm("Confirm mission objectives complete?")) return;

    try {
      await api.put(`/volunteer/missions/${id}/complete`);
      loadMissions();
    } catch {
      alert("Error");
    }
  };

  const submitForReview = async (id) => {
    if (!window.confirm("Submit mission report for Admin approval?")) return;

    try {
      await api.put(`/volunteer/missions/${id}/complete`);
      loadMissions();
    } catch {
      alert("Error submitting.");
    }
  };

  const openGPS = (loc) =>
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc)}`,
      "_blank"
    );

  // FILTERS
  const activeMissions = missions.filter(
    (m) =>
      m.status === "OPEN" ||
      m.status === "IN_PROGRESS" ||
      m.status === "PENDING_REVIEW"
  );

  const completedMissions = missions.filter(
    (m) => m.status === "COMPLETED"
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Mission Control
        </h1>
        <p className="text-slate-400 font-medium">
          Tactical overview of operations and objectives.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          ACTIVE OPS ({activeMissions.length})
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
            activeTab === "completed"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          COMPLETED LOG ({completedMissions.length})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* ---------------- ACTIVE MISSIONS ---------------- */}
        {activeTab === "active" &&
          activeMissions.map((m) => {
            const isCritical = m.severity === "CRITICAL" || m.severity === "HIGH";
            const isMine = m.status === "IN_PROGRESS";

            return (
              <div
                key={m._id}
                className={`bg-slate-900 border ${
                  isCritical
                    ? "border-red-500/50 shadow-red-900/20"
                    : "border-slate-800"
                } rounded-xl p-6 shadow-xl relative overflow-hidden transition-all hover:border-slate-700`}
              >
                {/* Emergency tag */}
                {isCritical && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl animate-pulse">
                    EMERGENCY PRIORITY
                  </div>
                )}

                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block ${
                        isCritical
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {m.severity}
                    </span>
                    <h3 className="text-2xl font-bold text-white">{m.title}</h3>
                  </div>

                  {/* BADGES */}
                  {isMine && (
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                      ASSIGNED TO YOU
                    </span>
                  )}

                  {m.status === "PENDING_REVIEW" && (
                    <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-lg text-xs font-bold animate-pulse">
                      ⏳ WAITING FOR ADMIN
                    </span>
                  )}
                </div>

                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  {m.description}
                </p>

                {/* LOCATION */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-6">
                  <span className="text-sm font-mono text-slate-400 flex items-center gap-2">
                    📍 {m.location || "Classified"}
                  </span>
                  <button
                    onClick={() => openGPS(m.location || "India")}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded transition-colors shadow-lg shadow-blue-600/20"
                  >
                    OPEN GPS NAVIGATION ↗
                  </button>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-1 gap-3">
                  {m.status === "OPEN" && (
                    <button
                      onClick={() => acceptMission(m._id)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg border border-slate-700 transition-colors"
                    >
                      ACCEPT ASSIGNMENT
                    </button>
                  )}

                  {isMine && (
                    <button
                      onClick={() => submitForReview(m._id)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all"
                    >
                      SUBMIT FOR REVIEW
                    </button>
                  )}

                  {m.status === "PENDING_REVIEW" && (
                    <button
                      disabled
                      className="w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-lg border border-slate-700 cursor-not-allowed"
                    >
                      UNDER REVIEW...
                    </button>
                  )}
                </div>
              </div>
            );
          })}

        {/* ---------------- COMPLETED MISSIONS ---------------- */}
        {activeTab === "completed" &&
          completedMissions.map((m) => (
            <div
              key={m._id}
              className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 shadow-lg relative overflow-hidden group"
            >
              {/* Watermark */}
              <div className="absolute -right-6 -bottom-6 text-9xl text-emerald-500/5 rotate-[-15deg] group-hover:text-emerald-500/10 transition-colors">
                ✓
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">{m.title}</h3>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></span>
                  <span className="text-xs font-bold text-emerald-400 tracking-wider">
                    SUCCESS
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-4">{m.description}</p>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800/50 text-xs font-mono text-slate-500">
                <span>LOC: {m.location}</span>
                <span>
                  COMPLETED: {new Date(m.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
