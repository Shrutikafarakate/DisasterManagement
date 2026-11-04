import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function CitizenLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/citizen/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/citizen");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Server not reachable.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      
      {/* Soft Red Glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[150px] -top-24 -left-24 opacity-80 pointer-events-none"></div>

      {/* CARD CONTAINER */}
      <div className="w-full max-w-md p-10 relative z-10 
                      bg-slate-900 rounded-2xl 
                      shadow-xl shadow-black/30 
                      border border-white/5 mx-4">

        <Link to="/" className="mb-6 inline-flex text-sm font-semibold text-slate-400 transition-colors hover:text-white">
          &larr; Back to Home
        </Link>

        {/* HEADER */}
        <div className="text-center mb-10">

          {/* Top red line (global theme) */}
          <div className="w-12 h-1 bg-red-600 mb-5 opacity-80 mx-auto"></div>

          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Citizen Emergency Portal
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {msg && (
          <div className="p-4 mb-6 rounded-lg text-center text-sm font-bold 
                          bg-red-500/10 text-red-400 
                          shadow-md shadow-red-900/10">
            {msg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit} className="space-y-6">

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Email Address
            </label>
            <input 
              type="email"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm 
                         focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all
                         placeholder-slate-600"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="citizen@example.com"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Password
            </label>
            <input 
              type="password"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm 
                         focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all
                         placeholder-slate-600"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </div>

          {/* BUTTON */}
          <button className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold 
                             rounded-lg shadow-lg shadow-red-700/20 
                             transition-all transform hover:scale-[1.01] active:scale-95">
            Login
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-sm text-slate-500">
            First time reporting? 
            <Link to="/citizen/register" className="text-red-400 hover:text-white font-bold ml-2 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
