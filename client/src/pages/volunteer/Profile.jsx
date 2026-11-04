import { useEffect, useState } from "react";
import api from "../../api";

export default function Profile() {
  const [volunteer, setVolunteer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    skills: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    api.get("/volunteer/me").then((res) => {
      setVolunteer(res.data);
      setForm({
        name: res.data.name,
        phone: res.data.phone,
        skills: res.data.skills.join(", "),
        status: res.data.status,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/volunteer/me", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      });
      setVolunteer(res.data);
      setIsEditing(false);
      setMsg("Profile Updated");
    } catch {
      setMsg("Update Failed");
    }
  };

  if (!volunteer)
    return (
      <div className="p-10 text-white animate-pulse">LOADING...</div>
    );

  const getStatusColor = (s) =>
    s === "AVAILABLE"
      ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/10"
      : s === "OFF_DUTY"
      ? "text-slate-400 border-slate-500/50 bg-slate-500/10"
      : "text-amber-400 border-amber-500/50 bg-amber-500/10";

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in-up">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Profile
        </h1>
        <p className="text-slate-400 font-medium">
          Service record and status configuration.
        </p>
      </div>

      {msg && (
        <div className="p-4 mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-bold text-center">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CARD 1: IDENTITY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center h-fit shadow-xl">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-6">
            {volunteer.name.charAt(0)}
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">
            {volunteer.name}
          </h2>
          <p className="text-slate-400 text-sm font-medium mb-6">
            {volunteer.email}
          </p>

          <div
            className={`py-3 px-4 rounded-xl border ${getStatusColor(
              volunteer.status
            )} flex items-center justify-center gap-3 mb-6`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                volunteer.status === "AVAILABLE"
                  ? "bg-emerald-400"
                  : "bg-slate-400"
              }`}
            ></span>
            <span className="font-bold text-sm tracking-wider">
              {volunteer.status.replace("_", " ")}
            </span>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="
                w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider
                bg-slate-800 text-slate-200
                border border-slate-700
                hover:bg-slate-700 hover:text-white
                transition-colors
              "
            >
              Edit Skills
            </button>
          )}
        </div>

        {/* CARD 2: DETAILS */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Service Data
            </h3>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white text-xs font-bold uppercase"
              >
                Cancel
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none select-none">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Name
                  </label>
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-400 text-sm">
                    {form.name}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Phone
                  </label>
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-400 text-sm">
                    {form.phone}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Skills (Comma Separated)
                </label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  className="
                    w-full bg-slate-950 border border-slate-700
                    rounded-lg px-4 py-3 text-white text-sm
                    focus:border-slate-500 outline-none
                  "
                />
                <p className="text-[10px] text-slate-400 mt-2">
                  You can update your skills.
                </p>
              </div>

              <button
                className="
                  w-full py-3 rounded-lg font-bold uppercase tracking-wider
                  bg-emerald-500/20 text-emerald-300
                  border border-emerald-500/30
                  hover:bg-emerald-500/30 hover:text-emerald-200
                  transition-all
                "
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Contact
                </label>
                <div className="text-xl text-white font-mono">
                  {volunteer.phone}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills?.map((s, i) => (
                    <span
                      key={i}
                      className="
                        px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        bg-slate-800/60 text-slate-300
                        border border-slate-700/50
                      "
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800">
                <p className="text-xs text-slate-600 font-mono">
                  OPERATIVE ID: {volunteer._id}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
