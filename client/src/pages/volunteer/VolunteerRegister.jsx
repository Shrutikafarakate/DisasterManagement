
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function VolunteerRegister() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
    location: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const emailChanged = name === "email" && value.trim().toLowerCase() !== otpEmail;
    setForm({
      ...form,
      [name]: value,
      ...(emailChanged ? { otp: "" } : {}),
    });

    if (emailChanged) {
      setOtpSent(false);
      setOtpEmail("");
      setMsg("");
    }

    if (name === "phone") {
      if (value === "") {
        setPhoneError("");
      } else if (!/^[6-9]\d{0,9}$/.test(value)) {
        setPhoneError("Enter a valid 10-digit mobile number.");
      } else if (value.length < 10) {
        setPhoneError("Mobile number must be 10 digits.");
      } else {
        setPhoneError("");
      }
    }

    if (name === "password") {
      if (value === "") {
        setPasswordError("");
      } else if (value.length < 8) {
        setPasswordError("Password must contain at least 8 characters.");
      } else if (!/[A-Z]/.test(value)) {
        setPasswordError("Password must contain at least one uppercase letter.");
      } else if (!/[a-z]/.test(value)) {
        setPasswordError("Password must contain at least one lowercase letter.");
      } else if (!/[0-9]/.test(value)) {
        setPasswordError("Password must contain at least one number.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSendOtp = async () => {
    if (!form.email) {
      return setMsg("Enter email first.");
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      return setMsg("Please enter a valid 10-digit mobile number.");
    }

    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    ) {
      return setMsg(
        "Password must have 8+ characters, uppercase, lowercase and number."
      );
    }

    setMsg("Sending verification code...");

    try {
      const email = form.email.trim().toLowerCase();
      const response = await api.post("/volunteer/auth/send-otp", {
        email,
      });

      setOtpSent(true);
      setOtpEmail(email);

      setMsg(response.data.message || `OTP sent to ${email}. Check your inbox.`);
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
          "Failed to send OTP. Check the server connection and SMTP settings."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setPhoneError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    ) {
      setPasswordError(
        "Password must have 8+ characters, uppercase, lowercase and number."
      );
      return;
    }

    if (!form.otp) {
      setMsg("Please enter the OTP.");
      return;
    }

    try {
      await api.post("/volunteer/auth/register", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      });

      setMsg("✓ Registration Successful. Awaiting Approval...");

      setTimeout(() => navigate("/volunteer/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden">

      <div className="absolute w-[550px] h-[550px] bg-red-700/15 rounded-full blur-[150px] -top-24 -left-24 pointer-events-none"></div>

      <div className="w-full max-w-2xl p-10 bg-slate-900 border border-white/5 rounded-2xl shadow-xl shadow-black/30 relative z-10 mx-4">

        <div className="mb-10">
          <div className="w-12 h-1 bg-red-600 mb-5 opacity-80"></div>

          <h1 className="text-2xl font-black text-white uppercase tracking-wide">
            Volunteer Registration
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Disaster Response Force – Onboarding
          </p>
        </div>

        {msg && (
          <div className="p-3 mb-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs font-bold shadow-sm shadow-red-900/10">
            {msg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Identity
            </h4>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />

            <div>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength="10"
                placeholder="Contact Number"
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-white text-sm outline-none ${
                  phoneError
                    ? "border-red-500"
                    : "border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                }`}
              />

              {phoneError && (
                <p className="text-red-400 text-xs mt-1">
                  {phoneError}
                </p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Set Password"
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-white text-sm outline-none ${
                  passwordError
                    ? "border-red-500"
                    : "border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                }`}
              />

              {passwordError && (
                <p className="text-red-400 text-xs mt-1">
                  {passwordError}
                </p>
              )}

              <p className="text-slate-500 text-xs mt-1">
                8+ characters, uppercase, lowercase and number.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Logistics & Verification
            </h4>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="City / Region"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />

            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              required
              placeholder="Skills (Medic, Driver, etc.)"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />

            <div className="flex gap-2">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              />

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  GET OTP
                </button>
              )}
            </div>

            {otpSent && (
              <>
                <p className="text-slate-400 text-xs">
                  Verification code sent to <span className="text-white">{otpEmail}</span>
                </p>
                <input
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  maxLength="6"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter OTP Code"
                  className="w-full bg-slate-950 border border-red-500/50 rounded-lg px-3 py-2.5 text-white text-sm focus:border-red-500 outline-none"
                />
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!otpSent || phoneError || passwordError}
            className={`md:col-span-2 mt-4 py-3.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all shadow-lg ${
              otpSent && !phoneError && !passwordError
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            {otpSent ? "Submit Registration" : "Verify Email First"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?

          <Link
            to="/volunteer/login"
            className="text-red-400 hover:text-white ml-1 font-bold transition-colors"
          >
            Volunteer Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
