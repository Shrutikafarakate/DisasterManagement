import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden text-center px-4">

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] opacity-80 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        
        {/* Large Background Number */}
        <h1 className="text-[10rem] md:text-[18rem] font-black text-slate-800/30 leading-none select-none tracking-tighter">
          404
        </h1>

        {/* Foreground Message (Centered over the number) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6 backdrop-blur-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-red-500 font-bold tracking-widest uppercase text-xs">Signal Lost</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Coordinates Not Found
          </h2>
          
          <p className="text-slate-400 max-w-lg mx-auto mb-8 text-sm md:text-base font-medium">
            The sector you are trying to access does not exist or has been moved. Return to safety immediately.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 transform hover:scale-105"
          >
            <span>🏠</span> RETURN TO BASE
          </Link>
        </div>
      </div>

      {/* Footer Technical Detail */}
      <div className="absolute bottom-8 text-slate-600 text-[10px] font-mono tracking-widest">
        SYSTEM_ERROR: ROUTE_UNDEFINED // CONNECTION_TERMINATED
      </div>
    </div>
  );
}