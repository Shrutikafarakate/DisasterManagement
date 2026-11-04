import { Link } from "react-router-dom";

export default function Donate() {
  return (
    <div className="min-h-screen bg-[#151720] text-white flex flex-col">

      {/* HEADER */}
      <header className="px-10 py-6 border-b border-white/5 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-widest">
          RESCUE<span className="text-red-600">OPS</span>
        </Link>

        <Link
          to="/"
          className="text-sm text-slate-400 hover:text-red-500 transition"
        >
          ← Back to Home
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full text-center">

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Support Emergency{" "}
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">
              Response
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-slate-300 text-lg mb-10">
            Your contribution helps us maintain emergency infrastructure,
            support volunteers, and deliver rapid assistance to people in
            distress during disasters.
          </p>

          {/* DONATION ADDRESS CARD */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-8 mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-white mb-2">
              Official Donation Address
            </p>

            <div className="bg-[#0b0b0b] border border-red-800/30 rounded-lg p-4">
              <p className="text-red-400 font-bold font-mono text-sm break-all">
              Disaster Management System<br />Kolhapur, 416208
              </p>
            </div>

            <p className="text-xs font-bold text-white mt-3">
              Please send donations only to this verified address.
            </p>
          </div>

          {/* HOW IT HELPS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mb-12">
            {[
              ["Emergency Aid", "Funds immediate disaster response operations."],
              ["Volunteer Support", "Helps equip and train volunteers."],
              ["Infrastructure", "Maintains alert and response systems."],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="bg-black/40 border border-white/10 rounded-xl p-5"
              >
                <h4 className="font-semibold mb-2 text-white">{title}</h4>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>

          {/* DISCLAIMER */}
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            RescueOps is a disaster response coordination platform. Donations are
            voluntary and used strictly for operational and emergency support
            purposes.
          </p>
        </div>
      </main>

      {/* FOOTER STRIP */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
       
      </footer>
    </div>
  );
}
