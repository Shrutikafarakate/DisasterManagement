import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/volunteer/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/volunteer");
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid credentials. Access denied.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden">

      {/* Tactical Background Grid */}
      <div
        className="absolute inset-0 
        bg-[linear-gradient(rgba(255,0,0,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.10)_1px,transparent_1px)] 
        bg-[size:40px_40px] opacity-10 pointer-events-none"
      ></div>

      {/* Soft Red Glow */}
      <div className="absolute top-[-20%] left-[-15%] w-[550px] h-[550px] bg-red-700/15 rounded-full blur-[160px] pointer-events-none"></div>

      {/* CARD CONTAINER */}
      <div className="w-full max-w-md p-10 relative z-10 
                      bg-slate-900 rounded-xl 
                      border border-white/5 
                      shadow-xl shadow-black/30 
                      mx-4">

        <Link to="/" className="mb-6 inline-flex text-sm font-semibold text-slate-400 transition-colors hover:text-white">
          &larr; Back to Home
        </Link>

        {/* HEADER */}
        <div className="mb-10">
          <div className="w-12 h-1 bg-red-600 mb-5 opacity-80"></div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            VOLUNTEER LOGIN
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Authorized Personnel – Disaster Response Force
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {msg && (
          <div className="p-3 mb-6 bg-red-500/10 border-l-4 border-red-500/40 text-red-400 text-xs font-bold rounded-md shadow-sm shadow-red-900/10">
            ⚠ {msg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit} className="space-y-6">
          
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Volunteer Email
            </label>
            <input
              type="email"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 
                         text-white text-sm 
                         focus:border-red-500 focus:ring-1 focus:ring-red-500 
                         outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="volunteer@rescueops.org"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Access Code
            </label>
            <input
              type="password"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 
                         text-white text-sm 
                         focus:border-red-500 focus:ring-1 focus:ring-red-500 
                         outline-none transition-all placeholder-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wider uppercase 
                       rounded-lg shadow-lg shadow-red-700/20 transition-all transform hover:translate-y-[-1px]"
          >
            Login
          </button>
        </form>

        {/* APPLY LINK */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-sm text-slate-500">
          New to the force?
          <Link
            to="/volunteer/register"
            className="text-red-400 hover:text-white font-bold ml-2 transition-colors"
          >
            Register as a Volunteer
          </Link>
        </p>
      </div>


      </div>
    </div>
  );
}
