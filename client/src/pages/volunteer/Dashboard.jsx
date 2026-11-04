import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({
    activeIncidents: [],
    assignedIncidents: [],
    completedIncidents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/volunteer/dashboard");
        setData({
          activeIncidents: res.data.activeIncidents || [],
          assignedIncidents: res.data.assignedIncidents || [],
          completedIncidents: res.data.completedIncidents || [],
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);



  if (loading) {
    return (
      <div className="p-10 text-white font-mono animate-pulse">
        CONNECTING TO COMMAND GRID...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Mission Control
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time dashboard for incident response and deployment.
          </p>
        </div>
        <div className="text-right">
          
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {/* ONGOING OPERATIONS */}
        <section className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Ongoing Operations
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {data.assignedIncidents.length} ASSIGNED
            </span>
          </div>

          {data.assignedIncidents.length === 0 ? (
            <div className="text-center py-12 text-slate-600 text-sm italic border border-dashed border-slate-800 rounded-xl">
              No active operations assigned. Stand by for deployment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.assignedIncidents.map((c) => (
                <div
                  key={c._id}
                  className="bg-slate-800/20 border border-slate-700/50 p-5 rounded-xl
                             hover:bg-slate-800/40 transition-all group flex flex-col"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase
                      border text-blue-400 bg-blue-500/10 border-blue-500/20">
                      IN PROGRESS
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      ID: {c._id.slice(-4)}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h5 className="font-bold text-slate-300 text-sm mb-1 truncate group-hover:text-white">
                    {c.title}
                  </h5>

                  {/* DESCRIPTION */}
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {c.description}
                  </p>

                  {/* LOCATION */}
                  <div className="text-[10px] text-slate-500 font-mono mb-4 truncate">
                    {c.location?.address || "Location unavailable"}
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-auto flex flex-col gap-2">


                    {/* VIEW INCIDENT */}
                    <Link to={`/volunteer/incidents/${c._id}`}>
                      <button
                        className="
                          w-full py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider
                          bg-slate-700/40 text-slate-200
                          border border-slate-600/40
                          hover:bg-slate-700/60 hover:text-white
                          transition-all
                        "
                      >
                        View Incident
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MISSION HISTORY */}
        <section className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Mission History
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {data.completedIncidents.length} COMPLETED
            </span>
          </div>

          {data.completedIncidents.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-sm italic">
              No completed missions on record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Completed On</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-400">
                  {data.completedIncidents.map((inc) => (
                    <tr
                      key={inc._id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20"
                    >
                      <td className="py-3 px-4 font-mono text-xs">
                        {inc._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300">
                        {inc.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded
                          text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">
                          {inc.severity || "NORMAL"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono truncate max-w-[150px]">
                        {inc.location?.address || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">
                        {new Date(inc.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[10px] font-bold text-emerald-500
                          bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
