
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

export default function CitizenRegister() {
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
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
      if (!/^[6-9]\d{0,9}$/.test(value)) {
        setPhoneError("Enter a valid 10-digit mobile number.");
      } else if (value.length === 10) {
        setPhoneError("");
      } else {
        setPhoneError("Mobile number must be 10 digits.");
      }
    }

    if (name === "password") {
      if (value.length < 8) {
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
      return setMsg("Please enter email address first.");
    }

    if (phoneError || form.phone.length !== 10) {
      return setMsg("Please enter a valid mobile number.");
    }

    if (passwordError || form.password.length < 8) {
      return setMsg("Please enter a valid password.");
    }

    setMsg("Sending Code...");

    try {
      const email = form.email.trim().toLowerCase();
      const response = await api.post("/citizen/otp/send", {
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
      await api.post("/citizen/auth/register", form);

      setMsg("✓ Success! Redirecting...");

      setTimeout(() => navigate("/citizen/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[150px] -top-24 -left-24 pointer-events-none"></div>

      <div className="w-full max-w-md p-10 bg-slate-900 border border-white/5 rounded-2xl shadow-xl shadow-black/30 mx-4 relative z-10">

        <div className="text-center mb-10">
          <div className="w-12 h-1 bg-red-600 mb-5 opacity-80 mx-auto"></div>

          <h1 className="text-3xl font-black text-white mb-1">
            Join the Network
          </h1>

          <p className="text-slate-400 text-sm">
            Citizen Registration
          </p>
        </div>

        {msg && (
          <div className="p-3 mb-6 rounded text-center text-sm font-bold bg-red-500/10 text-red-400 shadow-sm shadow-red-900/10">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />

          <div>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              maxLength="10"
              placeholder="Phone Number"
              className={`w-full bg-slate-950 border rounded-lg px-4 py-3 text-white text-sm outline-none transition-all ${
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

          <div className="flex gap-2">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />

            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
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
                placeholder="Enter 6-digit OTP"
                className="w-full bg-slate-950 border border-red-500/40 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-red-500 transition-all"
              />
            </>
          )}

          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className={`w-full bg-slate-950 border rounded-lg px-4 py-3 text-white text-sm outline-none transition-all ${
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
          </div>

          <p className="text-slate-500 text-xs">
            Password must contain at least 8 characters, one uppercase letter,
            one lowercase letter and one number.
          </p>

          <button
            type="submit"
            disabled={!otpSent || phoneError || passwordError}
            className={`w-full py-3.5 rounded-lg font-bold text-sm shadow-lg transition-all ${
              otpSent && !phoneError && !passwordError
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {otpSent ? "CREATE ACCOUNT" : "VERIFY EMAIL FIRST"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already registered?

          <Link
            to="/citizen/login"
            className="text-red-400 hover:text-white ml-1 font-bold transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
