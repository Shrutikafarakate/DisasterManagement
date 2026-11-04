import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden text-center px-4 font-sans selection:bg-red-500/30">

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] opacity-80 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[128px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        
        {/* Large Background Number */}
        <h1 className="text-[12rem] md:text-[20rem] font-black text-slate-800/20 leading-none select-none tracking-tighter mix-blend-overlay">
          404
        </h1>

        {/* Foreground Message (Centered over the number) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4">
          
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8 backdrop-blur-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
            <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs">Signal Lost</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            Coordinates Not Found
          </h2>
          
          <p className="text-slate-400 mb-10 text-sm md:text-base font-medium leading-relaxed">
            The sector you are trying to access does not exist or has been moved. 
            Please return to command base immediately.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 transform hover:scale-105 uppercase tracking-wider text-sm"
          >
            <span>🏠</span> Return to Base
          </Link>
        </div>
      </div>

      {/* Footer Technical Detail */}
      <div className="absolute bottom-10 text-slate-700 text-[10px] font-mono tracking-[0.2em] uppercase">
        System_Error: Route_Undefined // Connection_Terminated
      </div>
    </div>
  );
}