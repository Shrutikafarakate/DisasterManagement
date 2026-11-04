// import { useState, useEffect } from "react";
// import api from "../../api";

// export default function UserManagement() {
//   const [activeTab, setActiveTab] = useState("citizens");
//   const [citizens, setCitizens] = useState([]);
//   const [volunteers, setVolunteers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       // Fetch both lists in parallel
//       const [cRes, vRes] = await Promise.all([
//         api.get("/admin/citizens"),
//         api.get("/admin/volunteers")
//       ]);

//       setCitizens(cRes.data);
//       setVolunteers(vRes.data);
//     } catch (err) {
//       console.error("Failed to load users", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleStatus = async (volunteer) => {
//     const newStatus = !volunteer.approved;
//     const action = newStatus ? "REINSTATE" : "SUSPEND";

//     if (!window.confirm(`Are you sure you want to ${action} this volunteer?`)) return;

//     try {
//       // Optimistic update
//       setVolunteers(prev => prev.map(v =>
//         v._id === volunteer._id ? { ...v, approved: newStatus } : v
//       ));

//       await api.put(`/admin/volunteers/${volunteer._id}/status`, {
//         approved: newStatus
//       });

//     } catch (err) {
//       alert("Status update failed");
//       loadData(); // Revert on failure
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto pb-12 animate-fade-in-up">
//       {/* Header */}
//       <div className="mb-8 border-b border-slate-800 pb-6">
//         <h1 className="text-4xl font-black text-white tracking-tight mb-2">User Management</h1>
//         <p className="text-slate-400 font-medium">Manage citizen accounts and volunteer access permissions.</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("citizens")}
//           className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "citizens"
//               ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
//               : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
//             }`}
//         >
//           CITIZENS ({citizens.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("volunteers")}
//           className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "volunteers"
//               ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
//               : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
//             }`}
//         >
//           VOLUNTEERS ({volunteers.length})
//         </button>
//       </div>

//       {/* Content Area */}
//       <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
//         {loading ? (
//           <div className="text-center py-20 text-slate-500 animate-pulse">Loading users...</div>
//         ) : (
//           <>
//             {/* CITIZENS VIEW */}
//             {activeTab === "citizens" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {citizens.length === 0 && <p className="text-slate-500 col-span-3">No citizens found.</p>}
//                 {citizens.map(user => (
//                   <div key={user._id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-white font-bold">{user.name}</h3>
//                         <p className="text-xs text-slate-400 font-mono">{user.email}</p>
//                       </div>
//                       <span className="bg-blue-900/30 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">
//                         CITIZEN
//                       </span>
//                     </div>
//                     {user.phone && <p className="text-xs text-slate-500">📞 {user.phone}</p>}
//                     <div className="mt-2 text-[10px] text-slate-600 font-mono">
//                       Joined: {new Date(user.createdAt).toLocaleDateString()}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* VOLUNTEERS VIEW */}
//             {activeTab === "volunteers" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {volunteers.length === 0 && <p className="text-slate-500 col-span-3">No volunteers found.</p>}
//                 {volunteers.map(user => (
//                   <div key={user._id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-3 group hover:border-slate-600 transition-colors">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-white font-bold">{user.name}</h3>
//                         <p className="text-xs text-slate-400 font-mono">{user.email}</p>
//                       </div>
//                       <span className={`text-[10px] font-bold px-2 py-1 rounded ${user.approved
//                           ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
//                           : "bg-red-900/30 text-red-400 border border-red-500/30"
//                         }`}>
//                         {user.approved ? "ACTIVE" : "SUSPENDED"}
//                       </span>
//                     </div>

//                     <div className="text-xs text-slate-500 space-y-1">
//                       {user.skills && <p>🛠 {user.skills.join(", ")}</p>}
//                       {user.phone && <p>📞 {user.phone}</p>}
//                     </div>

//                     <button
//                       onClick={() => handleToggleStatus(user)}
//                       className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${user.approved
//                           ? "bg-slate-700 text-red-400 hover:bg-red-900/50 hover:text-red-200"
//                           : "bg-emerald-600 text-white hover:bg-emerald-500"
//                         }`}
//                     >
//                       {user.approved ? "SUSPEND ACCOUNT" : "REINSTATE ACCOUNT"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import api from "../../api";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("citizens");
  const [citizens, setCitizens] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingVolunteer, setPendingVolunteer] = useState(null);
  const [updatingVolunteerId, setUpdatingVolunteerId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cRes, vRes] = await Promise.all([
        api.get("/admin/citizens"),
        api.get("/admin/volunteers"),
      ]);

      setCitizens(cRes.data || []);
      setVolunteers(vRes.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!pendingVolunteer || updatingVolunteerId) return;
    const newStatus = !pendingVolunteer.approved;
    setUpdatingVolunteerId(pendingVolunteer._id);
    setStatusMessage("");

    try {
      await api.put(`/admin/volunteers/${pendingVolunteer._id}/status`, {
        approved: newStatus,
      });
      setVolunteers((prev) =>
        prev.map((v) =>
          v._id === pendingVolunteer._id
            ? {
                ...v,
                approved: newStatus,
                ...(newStatus ? { status: "AVAILABLE" } : {}),
              }
            : v
        )
      );
      setPendingVolunteer(null);
      setStatusError(false);
      setStatusMessage(`${pendingVolunteer.name} ${newStatus ? "has been reinstated" : "has been suspended"}.`);
    } catch (err) {
      console.error("Volunteer status update failed", err);
      setStatusError(true);
      setStatusMessage(err.response?.data?.message || "Status update failed. Please try again.");
    } finally {
      setUpdatingVolunteerId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white mb-2">
          User Management
        </h1>
        <p className="text-slate-400">
          Manage citizen accounts and volunteer access permissions.
        </p>
      </div>

      {statusMessage && (
        <p
          role={statusError ? "alert" : "status"}
          className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
            statusError
              ? "border-red-500/30 bg-red-950/30 text-red-300"
              : "border-emerald-500/30 bg-emerald-950/30 text-emerald-300"
          }`}
        >
          {statusMessage}
        </p>
      )}

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
            onClick={() => setActiveTab("citizens")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all
              ${
                activeTab === "citizens"
                  ? "bg-slate-700 text-white border border-sky-500/30 shadow-sm shadow-sky-900/20"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
          >
            Citizens
          </button>

        <button
          onClick={() => setActiveTab("volunteers")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all
            ${
              activeTab === "volunteers"
                ? "bg-slate-700 text-white border border-sky-500/30 shadow-sm shadow-sky-900/20"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
        >
          Volunteers
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading users...
          </div>
        ) : (
          <>
            {/* CITIZENS TABLE */}
            {activeTab === "citizens" && (
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Phone</th>
                    <th className="px-6 py-4 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No citizens found.
                      </td>
                    </tr>
                  ) : (
                    citizens.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {user.phone || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* VOLUNTEERS TABLE */}
            {activeTab === "volunteers" && (
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Skills</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Account Access</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No volunteers found.
                      </td>
                    </tr>
                  ) : (
                    volunteers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {user.skills?.length
                            ? user.skills.join(", ")
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "AVAILABLE"
                                ? "bg-emerald-900/30 text-emerald-400"
                                : user.status === "OFF_DUTY"
                                ? "bg-slate-800 text-slate-400"
                                : user.status === "DEPLOYED" || user.status === "BUSY"
                                ? "bg-amber-900/30 text-amber-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {user.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                user.approved
                                  ? "bg-emerald-900/30 text-emerald-400"
                                  : "bg-red-900/30 text-red-400"
                              }`}
                          >
                            {user.approved ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setPendingVolunteer(user)}
                            disabled={updatingVolunteerId !== null}
                            className={`px-4 py-2 rounded-md text-xs font-semibold transition
                              ${
                                user.approved
                                  ? "bg-slate-700 text-red-400 hover:bg-red-900/40"
                                  : "bg-emerald-600/80 text-white hover:bg-emerald-600"
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            {user.approved
                              ? "Suspend"
                              : "Reinstate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {pendingVolunteer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="volunteer-status-title"
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <h2 id="volunteer-status-title" className="text-lg font-bold text-white">
              {pendingVolunteer.approved ? "Suspend volunteer?" : "Reinstate volunteer?"}
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              {pendingVolunteer.approved
                ? `Suspend ${pendingVolunteer.name}? They will no longer be able to access their account.`
                : `Restore ${pendingVolunteer.name}'s account access?`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingVolunteer(null)}
                disabled={updatingVolunteerId !== null}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={updatingVolunteerId !== null}
                className={`rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-50 ${
                  pendingVolunteer.approved
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {updatingVolunteerId
                  ? "Updating..."
                  : pendingVolunteer.approved
                    ? "Suspend volunteer"
                    : "Reinstate volunteer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
