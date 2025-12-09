import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.friendlyMessage || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 mb-12 px-4 animate-slide-up">
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-10 relative">

        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-t-3xl"></div>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3">
          Welcome back
        </h1>
        <p className="text-slate-400 text-center font-medium mb-8">
          Login to post & bookmark events
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-1 block">
              Email
            </label>
            <input
              required
              type="email"
              placeholder="you@iitm.ac.in"
              className="w-full bg-slate-900/40 border border-slate-700 text-slate-200 p-3.5 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/30 outline-none transition-all placeholder:text-slate-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 mb-1 block">
              Password
            </label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-900/40 border border-slate-700 text-slate-200 p-3.5 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/30 outline-none transition-all placeholder:text-slate-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-rose-900/30 border border-rose-700 text-rose-300 text-center px-4 py-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white w-full py-3.5 rounded-xl font-bold shadow-xl hover:shadow-emerald-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "⏳ Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6 font-medium">
          New here?{" "}
          <Link
            to="/register"
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
          >
            Create account →
          </Link>
        </p>
      </div>
    </div>
  );
}
