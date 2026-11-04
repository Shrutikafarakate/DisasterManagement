import { useEffect, useState } from "react";
import api from "../../api";

export default function CitizenIncidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    api.get("/citizen/incidents/my")
      .then((res) => setIncidents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      <div className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">My Reports</h1>
        <p className="text-slate-400 font-medium">Track status updates and official responses to your reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {incidents.length === 0 && (
          <div className="col-span-2 text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-600">
            No reports filed yet.
          </div>
        )}

        {incidents.map((inc) => (
          <div key={inc._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:bg-slate-800/50 transition-colors shadow-lg group">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${inc.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                  inc.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-700 text-slate-300'
                }`}>
                {inc.severity} Priority
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(inc.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{inc.title}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">{inc.description}</p>

            {/* Admin Reply Box */}
            {inc.adminReplies && inc.adminReplies.length > 0 && (
              <div className="bg-blue-900/10 border-l-2 border-blue-500 p-3 mb-6 rounded-r-lg">
                <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Official Response</span>
                <p className="text-sm text-blue-100">{inc.adminReplies[0].message}</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              Location: {inc.location && inc.location.address
                ? inc.location.address
                : "Location unavailable"}
              </span>

              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${inc.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' :
                  inc.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-yellow-500/10 text-yellow-500'
                }`}>
                {inc.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}