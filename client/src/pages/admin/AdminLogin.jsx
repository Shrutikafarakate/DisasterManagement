import { useState } from "react";
import api from "../../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch {
      setMsg("Invalid credentials. Access Denied.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft Red Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-10 w-full max-w-md border border-slate-800 shadow-2xl shadow-red-900/20">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Command Center</h1>
        <p className="text-sm text-slate-500 mb-8 text-center">Secure Access Required</p>

        <form onSubmit={submit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:border-red-500 transition-all"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:border-red-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {msg && <p className="text-sm text-red-500 text-center">{msg}</p>}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 
                       text-white font-bold py-3.5 rounded-lg shadow-lg shadow-red-600/20 
                       transition-all transform hover:scale-[1.02]"
          >
            Login to Dashboard
          </button>
        </form>

        {/* Return */}
        <div className="mt-8 text-center">
          <a href="/" className="text-slate-500 text-xs hover:text-white transition-colors">
            ← Return to Public Portal
          </a>
        </div>
      </div>
    </div>
  );
}