import { useEffect, useState, useRef } from "react";
import api from "../../api";
import LocationMap from "../../components/LocationMap";
import ConfirmBroadcastModal from "../../components/ConfirmBroadcastModal";

// Incident type to backend type mapping
const INCIDENT_TYPE_MAPPING = {
  "Flood": "WEATHER",
  "Fire": "REGION_WARNING",
  "Earthquake": "REGION_WARNING",
  "Landslide": "REGION_WARNING",
  "Storm": "WEATHER",
  "Cyclone": "WEATHER",
  "Tsunami": "EVACUATION",
  "Hurricane": "WEATHER",
  "Tornado": "WEATHER",
  "Volcanic Eruption": "EVACUATION"
};

export default function BroadcastCenter() {
  const [activeTab, setActiveTab] = useState("broadcast"); // "broadcast" or "reports"
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [isUpdatingAlertStatus, setIsUpdatingAlertStatus] = useState(false);

  // FIX: Track if initial load has happened to prevent duplicate API calls
  // React StrictMode in development causes useEffect to run twice
  const hasLoadedRef = useRef(false);

  // FIX: Submission lock to prevent duplicate broadcasts
  // Guards against: double-clicks, concurrent submissions, React re-renders
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters for reports tab
  const [filters, setFilters] = useState({
    severity: "ALL",
    dateRange: "ALL",
    searchQuery: ""
  });

  const [form, setForm] = useState({
    title: "",
    message: "",
    incidentType: "Flood",
    region: "",
    severity: "LOW",
    target: "CITIZEN",
    instructions: ""
  });

  const loadHistory = async () => {
    try {
      // FIX: Fetch ONLY admin broadcasts (Unified View)
      const res = await api.get("/admin/alerts?type=BROADCAST");
      // FIX: Ensure we're setting alerts only once per API call
      // Use the response data directly without duplicating
      setAlerts(res.data);
      setFilteredAlerts(res.data);
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  // FIX: Load history only once on mount, preventing duplicate renders
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadHistory();
    }
  }, []);

  // Apply filters to alerts
  useEffect(() => {
    let filtered = [...alerts];

    // Severity filter
    if (filters.severity !== "ALL") {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    // Date range filter
    if (filters.dateRange !== "ALL") {
      const now = new Date();
      filtered = filtered.filter(alert => {
        const alertDate = new Date(alert.createdAt);
        const hoursDiff = (now - alertDate) / (1000 * 60 * 60);

        switch (filters.dateRange) {
          case "24H":
            return hoursDiff <= 24;
          case "7D":
            return hoursDiff <= 168; // 24 * 7
          case "30D":
            return hoursDiff <= 720; // 24 * 30
          default:
            return true;
        }
      });
    }

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.title?.toLowerCase().includes(query) ||
        alert.message?.toLowerCase().includes(query) ||
        alert.region?.toLowerCase().includes(query) ||
        alert.type?.toLowerCase().includes(query)
      );
    }

    setFilteredAlerts(filtered);
  }, [filters, alerts]);

  // FIX: Auto-dismiss success feedback after 4 seconds
  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => {
        setStatus({ type: "", msg: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status.msg]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocationSelect = (coords) => {
    setForm((prev) => ({ ...prev, region: coords }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // FIX: Form submission handler - ONLY opens confirmation modal
  // Does NOT call any broadcast APIs directly
  // This ensures the user must explicitly confirm before any API call
  const handleSubmitAttempt = (e) => {
    e.preventDefault();

    // Prevent opening modal if already submitting
    if (isSubmitting) return;

    setShowConfirmModal(true);
  };

  const confirmAlertStatusChange = async () => {
    if (!pendingStatusChange || isUpdatingAlertStatus) return;

    const { alert, newStatus } = pendingStatusChange;
    setIsUpdatingAlertStatus(true);
    setStatus({ type: "", msg: "" });

    try {
      const res = await api.put(`/admin/alerts/${alert._id}/status`, {
        status: newStatus
      });

      setAlerts((prev) =>
        prev.map((item) =>
          item._id === alert._id ? { ...item, status: res.data.status } : item
        )
      );
      setPendingStatusChange(null);
      setStatus({
        type: "success",
        msg: `Alert status updated to ${newStatus}`
      });
    } catch (err) {
      console.error("Status Update Failed", err);
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to update alert status."
      });
    } finally {
      setIsUpdatingAlertStatus(false);
    }
  };

  // FIX: CENTRALIZED BROADCAST FUNCTION - The ONLY function that creates broadcasts
  // This is the single point of truth for broadcast creation
  // Called ONLY when user explicitly confirms in the modal
  const handleConfirmBroadcast = async () => {
    // FIX: Guard against concurrent submissions
    if (isSubmitting) {
      console.warn("Broadcast already in progress, ignoring duplicate request");
      return;
    }

    // Set submission lock immediately
    setIsSubmitting(true);
    setShowConfirmModal(false);
    setStatus({ type: "", msg: "" });

    try {
      const payload = {
        title: form.title,
        message: form.instructions
          ? `${form.message}\n\nINSTRUCTIONS: ${form.instructions}`
          : form.message,
        // FIX: Enforce Unified "BROADCAST" type
        // The specific incident type (Flood/Fire) is stored in 'category'
        type: "BROADCAST",
        category: form.incidentType,
        region: form.region,
        severity: form.severity,
        // FIX: Always target ALL (Global Broadcast)
        audience: "ALL",
        target: "ALL", // Kept for legacy compatibility
        // FIX: Explicitly set source
        sourceType: "ADMIN"
      };

      // FIX: Strict Single Action -> Single Record Policy
      // Always call Citizen endpoint to preserve location data (region)
      // This is the chosen Source of Truth for global broadcasts
      await api.post("/admin/alerts/citizen", payload);

      setStatus({
        type: "success",
        msg: "Alert successfully broadcast to all users."
      });

      // Reset form
      setForm({
        ...form,
        title: "",
        message: "",
        region: "",
        instructions: ""
      });

      // Refresh broadcast history
      await loadHistory();

      // Auto-switch to reports tab after 2 seconds
      setTimeout(() => {
        setActiveTab("reports");
      }, 2000);

    } catch (err) {
      console.error("Broadcast Logic Error:", err);
      setStatus({
        type: "error",
        msg: "Broadcast Failed. Check System Logs."
      });
    } finally {
      // FIX: Always release submission lock in finally block
      // Ensures lock is released even if there's an error
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Broadcast Center
        </h1>
        <p className="text-slate-400 font-medium">
          Issue public safety warnings & emergency protocols
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="mb-8">
        <div className="flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider transition-all relative ${activeTab === "broadcast"
              ? "text-white bg-slate-900/50"
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/30"
              }`}
          >
            <span className="flex items-center gap-2">
              Broadcast New Incident
            </span>
            {activeTab === "broadcast" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider transition-all relative ${activeTab === "reports"
              ? "text-white bg-slate-900/50"
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/30"
              }`}
          >
            <span className="flex items-center gap-2">
              Broadcast Reports
            </span>
            {activeTab === "reports" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* STATUS MESSAGE */}
      {status.msg && (
        <div
          className={`p-4 mb-8 rounded-xl border flex items-center gap-3 shadow-lg ${status.type === "error"
            ? "bg-red-500/10 border-red-500/50 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
            }`}
        >
          <span className="uppercase font-bold tracking-wider mr-2">
            {status.type === "error" ? "Error:" : "Success:"}
          </span>
          <span className="font-medium text-sm">
            {status.msg}
          </span>
        </div>
      )}

      {/* TAB CONTENT */}
      {activeTab === "broadcast" ? (
        /* ========== TAB 1: BROADCAST NEW INCIDENT ========== */
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmitAttempt}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN: FORM FIELDS */}
              <div className="space-y-6">
                {/* Alert Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Alert Headline
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={change}
                    required
                    placeholder="Ex: Severe Flood Warning Zone 7"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-slate-600 font-bold"
                  />
                </div>

                {/* Incident Type & Severity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Incident Type
                    </label>
                    <select
                      name="incidentType"
                      value={form.incidentType}
                      onChange={change}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-red-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="Flood">Flood</option>
                      <option value="Fire">Fire</option>
                      <option value="Earthquake">Earthquake</option>
                      <option value="Landslide">Landslide</option>
                      <option value="Storm">Storm</option>
                      <option value="Cyclone">Cyclone</option>
                      <option value="Tsunami">Tsunami</option>
                      <option value="Hurricane">Hurricane</option>
                      <option value="Tornado">Tornado</option>
                      <option value="Volcanic Eruption">Volcanic Eruption</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Severity Level
                    </label>
                    <select
                      name="severity"
                      value={form.severity}
                      onChange={change}
                      className={`w-full bg-slate-950 border rounded-lg px-4 py-3 text-sm font-bold outline-none transition-all cursor-pointer ${form.severity === "CRITICAL"
                        ? "border-red-500 text-red-500 animate-pulse"
                        : form.severity === "HIGH"
                          ? "border-orange-500 text-orange-500"
                          : form.severity === "MEDIUM"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-slate-700 text-white"
                        }`}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                </div>

                {/* Target Audience REMOVED from UI - Defaults to GLOBAL */}
                <input type="hidden" name="target" value="ALL" />

                {/* Target Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Target Location
                  </label>
                  <input
                    name="region"
                    value={form.region}
                    onChange={change}
                    placeholder="Type a place or coordinates, or select on the map..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-red-500 outline-none transition-all font-mono"
                  />
                </div>

                {/* Incident Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Incident Description
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={form.message}
                    onChange={change}
                    required
                    placeholder="Enter detailed incident description..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-red-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Public Instructions (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Public Instructions
                    <span className="text-slate-600 ml-2 normal-case">(Optional)</span>
                  </label>
                  <textarea
                    name="instructions"
                    rows="3"
                    value={form.instructions}
                    onChange={change}
                    placeholder="Enter safety instructions for the public..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-red-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: MAP & SUBMIT */}
              <div className="flex flex-col">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Location Designator
                </label>

                <div className="relative h-[min(60vh,550px)] min-h-[450px] w-full overflow-hidden rounded-xl border border-slate-700 shadow-2xl">
                  <LocationMap
                    onSelect={handleLocationSelect}
                    searchQuery={form.region}
                    severity={form.severity}
                  />
                </div>

                {/* FIX: Disable button during submission to prevent double-click */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-6 font-black py-4 rounded-xl shadow-lg transition-all transform tracking-widest text-sm ${isSubmitting
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-red-900/30 hover:scale-[1.02]"
                    }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      BROADCASTING...
                    </span>
                  ) : (
                    "BROADCAST ALERT"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ========== TAB 2: BROADCAST REPORTS ========== */
        <div className="space-y-6">
          {/* FILTERS BAR */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Severity Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Filter by Severity
                </label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange("severity", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="ALL">All Severities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Filter by Date
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="ALL">All Time</option>
                  <option value="24H">Last 24 Hours</option>
                  <option value="7D">Last 7 Days</option>
                  <option value="30D">Last 30 Days</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                  placeholder="Search by location, type..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-blue-500 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                Showing <span className="font-bold text-white">{filteredAlerts.length}</span> of{" "}
                <span className="font-bold text-white">{alerts.length}</span> broadcasts
              </p>
            </div>
          </div>

          {/* REPORTS LIST */}
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
              <p className="text-slate-500 italic text-lg">
                {alerts.length === 0
                  ? "No broadcasts recorded in the system"
                  : "No broadcasts match your filters"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {/* FIX: Using stable unique key (alert._id) to prevent duplicate rendering */}
              {/* Each alert renders exactly once based on filteredAlerts array */}
              {filteredAlerts.map((alert) => {
                // CHANGE: Removed time-based expiry calculation
                // All broadcasts are considered Active unless backend provides explicit status
                // This ensures broadcasts remain visible and actionable indefinitely
                const broadcastStatus = alert.status || "ACTIVE";
                const isActive = broadcastStatus === "ACTIVE";

                // Map 'category' to display type, fallback to 'GENERAL' or 'BROADCAST'
                // This fixes Issue 1: Alert Type Not Displaying
                const displayType = alert.category || alert.type || "GENERAL";

                const handleStatusToggle = () => {
                  if (activeTab !== "reports") return; // Safety check

                  const newStatus = isActive ? "EXPIRED" : "ACTIVE";
                  setStatus({ type: "", msg: "" });
                  setPendingStatusChange({ alert, newStatus });
                };

                return (
                  <div
                    key={alert._id}
                    className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:bg-slate-800/50 transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left: Main Content */}
                      <div className="flex-1 space-y-3">
                        {/* Title & Badges */}
                        <div className="flex flex-wrap items-start gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex-1 min-w-[200px]">
                            {alert.title}
                          </h3>

                          {/* Status Badge */}
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isActive
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                              : "bg-slate-700/50 text-slate-400 border border-slate-700"
                              }`}
                          >
                            {broadcastStatus}
                          </span>

                          {/* Severity Badge */}
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded uppercase tracking-wider ${alert.severity === "CRITICAL"
                              ? "bg-red-500 text-white"
                              : alert.severity === "HIGH"
                                ? "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                                : alert.severity === "MEDIUM"
                                  ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                                  : "bg-slate-700 text-slate-300"
                              }`}
                          >
                            {alert.severity}
                          </span>
                        </div>

                        {/* Message */}
                        <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                          {alert.message}
                        </p>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-400">Type:</span>
                            <span className="uppercase font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                              {displayType}
                            </span>
                          </span>

                          {alert.region && (
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-slate-400">Location:</span>
                              <span className="font-mono">{alert.region}</span>
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-400">Target:</span>
                            <span className="text-blue-400 font-semibold">
                              {alert.audience || "BROADCAST"}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions & Time */}
                      <div className="flex flex-col items-end gap-3 min-w-[140px]">
                        <div className="text-right">
                          <p className="text-xs text-slate-600 font-mono">
                            {new Date(alert.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </p>
                          <p className="text-xs text-slate-600 font-mono">
                            {new Date(alert.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>

                        {/* STATUS TOGGLE BUTTON - FIX ISSUE 2 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle();
                          }}
                          disabled={isUpdatingAlertStatus}
                          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${isActive
                            ? "bg-transparent text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white"
                            : "bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {isActive ? "Mark as Expired" : "Reactivate Alert"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )
      }

      {/* CONFIRMATION MODAL */}
      <ConfirmBroadcastModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmBroadcast}
        broadcastData={{
          ...form,
          incidentType: form.incidentType
        }}
      />

      {pendingStatusChange && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-status-confirm-title"
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <h3 id="alert-status-confirm-title" className="text-lg font-bold text-white">
              {pendingStatusChange.newStatus === "EXPIRED" ? "Expire this alert?" : "Reactivate this alert?"}
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              {pendingStatusChange.newStatus === "EXPIRED"
                ? "This alert will be marked inactive."
                : "This alert will become active again."}
            </p>
            {status.type === "error" && (
              <p role="alert" className="mt-4 text-sm text-red-400">{status.msg}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingStatusChange(null)}
                disabled={isUpdatingAlertStatus}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAlertStatusChange}
                disabled={isUpdatingAlertStatus}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isUpdatingAlertStatus ? "Updating..." : pendingStatusChange.newStatus === "EXPIRED" ? "Mark as expired" : "Reactivate alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}
