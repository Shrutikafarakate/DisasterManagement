import { NavLink, useNavigate } from "react-router-dom";

export default function VolunteerNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getLinkClass = ({ isActive }) => {
    const base =
      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200";
    const active =
      "bg-red-600/10 text-red-500 border-l-4 border-red-500 shadow-lg shadow-red-900/20";
    const inactive =
      "text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent";

    return isActive ? `${base} ${active}` : `${base} ${inactive}`;
  };

  return (
    <aside className="h-screen w-72 bg-[#1a1e26] border-r border-slate-700 flex flex-col sticky top-0 z-50">

      {/* HEADER */}
      <div className="p-8 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
          <h2 className="text-2xl font-black text-white tracking-tighter">
            RESCUE<span className="text-red-500">OPS</span>
          </h2>
        </div>
        <p className="text-[10px] font-bold text-red-500/80 tracking-[0.25em] uppercase mt-2">
          VOLUNTEER OF DISASTER RESPONSE FORCE
        </p>
      </div>

      {/* NAVIGATION (scrollable) */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
        <NavLink to="/volunteer" end className={getLinkClass}>
          Current Assignment
        </NavLink>
        <NavLink to="/volunteer/training" className={getLinkClass}>
          Training & Readiness
        </NavLink>
        <NavLink to="/volunteer/broadcasts" className={getLinkClass}>
          Alerts
        </NavLink>
        <NavLink to="/volunteer/profile" className={getLinkClass}>
          Profile
        </NavLink>
        <NavLink to="/" className={getLinkClass}>
          Back to home
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="m-4 px-4 py-3 bg-red-600/90 text-white rounded-xl font-bold 
                   hover:bg-red-500 transition-all text-center shadow-lg shadow-red-900/30"
      >
        Logout
      </button>

    </aside>
  );
}
