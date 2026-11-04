import { useEffect, useState } from "react";
import api from "../../api";

export default function Broadcasts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch alerts intended for citizens (common broadcast channel)
        // Volunteers see the same global/citizen alerts
        api.get("/citizen/alerts")
            .then((res) => {
                setAlerts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load broadcasts", err);
                setLoading(false);
            });
    }, []);

    // Defensive check: Ensure alerts is an array
    const safeAlerts = Array.isArray(alerts) ? alerts : [];

    if (loading) return <div className="p-10 text-white font-mono animate-pulse">SCANNING COMM CHANNELS...</div>;

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">

            {/* HEADER */}
            <div className="mb-10 border-b border-slate-800 pb-6">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">System Broadcasts</h1>
                <p className="text-slate-400 font-medium">Live feed of global alerts and administrative directives.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* EMPTY STATE */}
                {safeAlerts.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                        <h3 className="text-lg font-bold text-white mb-2">All Quiet</h3>
                        <p className="text-slate-500 text-sm">No active system broadcasts at this time.</p>
                    </div>
                )}

                {/* ALERT CARDS */}
                {safeAlerts.map((a) => {
                    // Defensive Data Access with Fallbacks
                    const category = a.category || "GENERAL";
                    const severity = a.severity || "LOW";
                    const title = a.title || "System Alert";
                    const message = a.message || "No additional details provided.";
                    // Use category as Type
                    const displayType = String(category).replace("_", " ");
                    const status = a.status || "ACTIVE";

                    // Dynamic Styling based on Severity
                    const isCritical = severity === 'CRITICAL' || severity === 'HIGH';
                    const borderColor = isCritical ? 'border-red-500' : 'border-blue-500';
                    const bgColor = isCritical ? 'bg-red-500/5' : 'bg-blue-500/5';
                    const textColor = isCritical ? 'text-red-500' : 'text-blue-400';
                    const sideBarColor = isCritical ? 'bg-red-500' : 'bg-blue-500';

                    return (
                        <div key={a._id || Math.random()} className={`relative bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl overflow-hidden group hover:border-slate-700 transition-colors`}>

                            {/* Left Accent Bar */}
                            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${sideBarColor}`}></div>

                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">

                                {/* Main Content */}
                                <div className="flex-1 pl-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${borderColor} ${bgColor} ${textColor}`}>
                                            {displayType}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                                            <span>Time: </span> {a.createdAt ? new Date(a.createdAt).toLocaleString() : "Time N/A"}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                        {title}
                                    </h3>

                                    <p className="text-slate-300 leading-relaxed text-sm md:text-base border-l-2 border-slate-800 pl-4 py-1">
                                        {message}
                                    </p>
                                </div>

                                {/* Meta Data (Right Side) */}
                                <div className="w-full md:w-auto flex flex-row md:flex-col gap-4 md:gap-2 pl-4 md:pl-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:text-right min-w-[150px]">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Severity</label>
                                        <span className={`font-black text-sm uppercase ${isCritical ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                                            {severity}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Region</label>
                                        <span className="text-white font-mono text-xs block truncate max-w-[200px]">
                                            {a.region || "All Sectors"}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Status</label>
                                        <span className={`font-mono text-xs block ${status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
