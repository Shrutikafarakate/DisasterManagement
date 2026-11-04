import { Link } from "react-router-dom";
import { getRoleFromToken } from "../utils/jwt";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Home() {

  // Detect login
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const userRole = getRoleFromToken(token);

  const dashboardRoutes = {
    admin: "/admin",
    volunteer: "/volunteer",
    citizen: "/citizen",
  };

  const dashboardLink = dashboardRoutes[userRole] || "/";

  // Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);


  return (
    <div className="min-h-screen flex flex-col text-white font-sans relative">

      {/* NAVBAR */}
      <header className="absolute top-0 left-0 w-full z-50 px-10 py-6 flex justify-between items-center">

        {/* LOGO LEFT */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
          <h1 className="text-2xl font-black tracking-widest text-white">
            RESCUE<span className="text-red-600">OPS</span>
          </h1>
        </div>

        {/* RIGHT BUTTON GROUP */}
        <div className="flex items-center gap-4">

          {/* SHOW Admin Access & Login ONLY when user is NOT logged in */}
          {!isLoggedIn && (
            <>
              {/* ADMIN ACCESS BUTTON */}
              <Link
                to="/admin/login"
                className="px-5 py-2 text-sm bg-white/10 border border-white/20 
                      text-white rounded-full hover:bg-white/20 transition"
              >
                Admin Access
              </Link>

              {/* LOGIN DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                  className="px-5 py-2 text-sm bg-white/10 border border-white/20 
                        text-white rounded-full hover:bg-white/20 transition"
                >
                  Login
                </button>

                {/* DROPDOWN MENU */}
                {showLoginMenu && (
                  <div
                    className="absolute right-0 mt-2 w-40 bg-[#0f0f0f] border border-white/10 
                          rounded-lg shadow-xl shadow-black/40 overflow-hidden animate-fade-slide"
                  >
                    <Link
                      to="/citizen/login"
                      className="block px-4 py-3 text-sm text-slate-300 hover:bg-white/10 transition"
                      onClick={() => setShowLoginMenu(false)}
                    >
                      Citizen Login
                    </Link>

                    <Link
                      to="/volunteer/login"
                      className="block px-4 py-3 text-sm text-slate-300 hover:bg-white/10 transition"
                      onClick={() => setShowLoginMenu(false)}
                    >
                      Volunteer Login
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* SHOW LOGOUT WHEN LOGGED IN */}
          {isLoggedIn && (
            <>
              <Link
                to={dashboardLink}
                className="px-5 py-2 text-sm bg-white/10 border border-white/20 
                      text-white rounded-full hover:bg-white/20 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="px-5 py-2 text-sm bg-red-600/20 border border-red-600/30 
                      text-white font-bold rounded-full hover:bg-red-600/30 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative w-full min-h-screen flex items-center px-16 py-32 overflow-hidden">

        {/* VIDEO BACKGROUND */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        >
          <source src="/videos/bg.mp4" type="video/mp4" />
        </video>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* LEFT HERO CONTENT */}
        <div className="relative z-10 w-full md:w-1/2 mt-4 text-left">

          {/* UPPER TAG */}
          <p className="uppercase tracking-[0.3em] text-red-400 text-xs mb-4 font-bold">
            Disaster Management System
          </p>

          {/* MAIN TITLE */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Where Every Second
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-orange-300">
              Saves Lives
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-slate-300 text-lg max-w-lg mb-8">
            Be part of a real-time platform where citizens and volunteers unite
            for rapid, coordinated disaster response.
          </p>

          {/* REGISTER BUTTON */}
          {/* SHOW "Register Now" ONLY when user is NOT logged in */}
          {!isLoggedIn && (
            <button
              className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full 
                        text-lg shadow-lg shadow-red-900/30 transition"
              onClick={() => setShowRegisterModal(true)}
            >
              Register Now
            </button>
          )}


        </div>

      </main>

      {/* SAFETY INTRO */}
      <section className="relative bg-[#101118] py-20 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-red-900/20 to-transparent blur-3xl" />
        </div>

        <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 leading-tight">
          Know What To Do In An{" "}
          <span className="block md:inline text-red-500 text-4xl md:text-5xl lg:text-6xl drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">
            Emergency
          </span>
        </h2>

        <p className="relative text-slate-300 text-base md:text-lg max-w-2xl mx-auto opacity-90">
          Simple safety measures can save lives before professional help arrives.
        </p>
      </section>

      {/* DISASTER SAFETY CARDS */}
      <section id="safety-guidelines" className="bg-[#151720] py-14 px-8">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-14 text-white">
          Disaster Safety Guidelines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* FIRE */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-400" />

            <h4 className="text-lg font-bold mb-4 text-orange-400">Fire</h4>
            <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
              <p>Stay low to avoid smoke</p>
              <p>Use stairs, not elevators</p>
              <p>Stop, Drop & Roll if clothes catch fire</p>
            </div>
          </div>

          {/* FLOOD */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-400" />

            <h4 className="text-lg font-bold mb-4 text-orange-400">Flood</h4>
            <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
              <p>Move to higher ground immediately</p>
              <p>Avoid walking or driving through flood water</p>
              <p>Switch off electricity and gas</p>
            </div>
          </div>

          {/* EARTHQUAKE */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-400" />

            <h4 className="text-lg font-bold mb-4 text-orange-400">Earthquake</h4>
            <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
              <p>Drop, Cover & Hold On</p>
              <p>Stay away from windows and heavy objects</p>
              <p>Do not rush outside during shaking</p>
            </div>
          </div>

          {/* CYCLONE */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-400" />

            <h4 className="text-lg font-bold mb-4 text-orange-400">Cyclone</h4>
            <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
              <p>Stay indoors away from windows</p>
              <p>Secure loose outdoor items</p>
              <p>Follow official alerts and warnings</p>
            </div>
          </div>

          {/* LANDSLIDE */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-400" />

            <h4 className="text-lg font-bold mb-4 text-orange-400">Landslide</h4>
            <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
              <p>Move away from slopes quickly</p>
              <p>Watch for sudden water flow or debris</p>
              <p>Evacuate early if warned</p>
            </div>
          </div>

          {/* HEALTH */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-400" />

            <h4 className="text-lg font-bold mb-4 text-orange-400">Health Emergency</h4>
            <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
              <p>Maintain personal hygiene</p>
              <p>Avoid crowded areas if possible</p>
              <p>Follow health advisories</p>
            </div>
          </div>
        </div>
      </section>

      {/* PREPAREDNESS CHECKLIST */}
      <section className="bg-[#101118] py-20 px-8">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
          Be Prepared Before{" "}
          <span className="text-red-500 text-3xl md:text-4xl drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">
            Disaster
          </span>{" "}
          Strikes
        </h3>

        <div className="max-w-2xl mx-auto grid gap-4">
          {[
            "Emergency contacts saved",
            "First aid kit ready",
            "Torch and spare batteries",
            "Clean drinking water stored",
            "Important documents secured"
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-lg p-4 transition-all duration-300 ${i % 2 === 0
                  ? "bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 hover:border-red-500/30"
                  : "bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 hover:border-red-500/20"
                }`}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/20 border-2 border-red-500/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <p className="text-sm md:text-base text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM OVERVIEW - RescueOps Cards */}
      <section className="bg-[#151720] py-20 px-8 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-12 text-white">
          How RescueOps Helps
        </h3>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            ["Report Incidents", "Citizens can report emergencies instantly."],
            ["SOS Alerts", "Critical SOS requests reach authorities immediately."],
            ["Volunteer Support", "Trained volunteers are deployed rapidly."],
            ["Live Monitoring", "Incidents are tracked in real time."]
          ].map(([title, desc], i) => (
            <div
              key={title}
              className={`relative rounded-xl p-6 transition-all duration-400 hover:-translate-y-2 ${i % 2 === 0
                  ? "bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm border border-white/20 hover:border-red-500/30"
                  : "bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/15 hover:border-red-500/25"
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-xl" />
              <div className="relative">
                <h4 className="text-lg font-bold mb-2 text-white">{title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMERGENCY HELPLINES - MOVED AFTER RESCUEOPS */}
      <section className="bg-[#101118] py-28 px-8">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
          Emergency Helpline Numbers
        </h3>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ["Police", "100"],
              ["Fire", "101"],
              ["Ambulance", "108"],
              ["Disaster Helpline", "112"]
            ].map(([label, number], i) => (
              <div
                key={label}
                className={`flex items-center justify-between rounded-lg px-6 py-4 transition-all duration-300 ${i % 2 === 0
                    ? "bg-black/50 backdrop-blur-sm border border-white/20 hover:border-red-500/30"
                    : "bg-black/30 backdrop-blur-sm border border-white/10 hover:border-red-500/20"
                  }`}
              >
                <p className="text-slate-300 text-base">{label}</p>
                <p className="text-3xl font-extrabold text-red-500">{number}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* REGISTER MODAL */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[9999]"
          onClick={() => setShowRegisterModal(false)}
        >
          <div
            className="relative bg-[#0c0c0c] text-white p-6 rounded-xl w-full max-w-sm 
                    shadow-xl shadow-black/50 border border-white/5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-[-20px] left-[-20px] w-[320px] h-[320px] 
                          bg-red-400/40 blur-[160px] rounded-full pointer-events-none"></div>

            <div className="w-12 h-1 bg-red-600 opacity-90 mx-auto mb-4 relative z-10"></div>

            {/* HEADING */}
            <h1 className="text-xl font-bold mb-5 text-center text-white tracking-wide relative z-10">
              How would you like to register?
            </h1>

            <div className="flex flex-col gap-3 relative z-10">

              {/* CITIZEN */}
              <div className="bg-slate-900 p-4 rounded-lg shadow-sm shadow-black/20 border border-white/10">
                <p className="text-sm font-bold text-white mb-1 text-center">
                  I Need Help
                </p>
                <p className="text-xs text-slate-300 mb-3 text-center">
                  Request assistance during an emergency.
                </p>

                <Link to="/citizen/register">
                  <button className="w-full px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold 
                                  text-sm transition shadow-sm shadow-red-900/20">
                    Register as Citizen
                  </button>
                </Link>
              </div>

              {/* VOLUNTEER */}
              <div className="bg-slate-900 p-4 rounded-lg shadow-sm shadow-black/20 border border-white/10">
                <p className="text-sm font-bold text-white mb-1 text-center">
                  Join The Force
                </p>
                <p className="text-xs text-slate-300 mb-3 text-center">
                  Volunteer to help others during emergencies.
                </p>

                <Link to="/volunteer/register">
                  <button className="w-full px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold 
                                  text-sm transition shadow-sm shadow-red-900/20">
                    Register as Volunteer
                  </button>
                </Link>
              </div>

            </div>

            {/* CLOSE */}
            <button
              className="mt-4 text-xs text-slate-400 hover:text-white w-full text-center relative z-10 transition"
              onClick={() => setShowRegisterModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
