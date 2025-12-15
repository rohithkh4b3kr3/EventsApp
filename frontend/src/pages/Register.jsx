import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register, login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
      await register({ name, username, email, password });
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.friendlyMessage || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 md:mt-20 mb-12 px-4 animate-slide-up">

      <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-10 relative">

        {/* Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-t-3xl"></div>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3">
          Create Account
        </h1>
        <p className="text-slate-400 text-center font-medium mb-8">
          Join Events Hub and share campus happenings
        </p>

        <form onSubmit={submit} className="space-y-6">

          <div>
            <label className="text-sm font-semibold text-slate-300">Full Name</label>
            <input
              required
              type="text"
              placeholder="Your Name"
              className="w-full bg-slate-900/40 border border-slate-700 text-slate-200 p-3.5 rounded-xl mt-1 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/30 outline-none transition-all"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300">Username</label>
            <input
              required
              type="text"
              placeholder="Redox08"
              className="w-full bg-slate-900/40 border border-slate-700 text-slate-200 p-3.5 rounded-xl mt-1 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/30 outline-none transition-all"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300">Email</label>
            <input
              required
              type="email"
              placeholder="you@iitm.ac.in"
              className="w-full bg-slate-900/40 border border-slate-700 text-slate-200 p-3.5 rounded-xl mt-1 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/30 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-900/40 border border-slate-700 text-slate-200 p-3.5 rounded-xl mt-1 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/30 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-900/30 border border-rose-700 text-rose-300 px-4 py-3 rounded-xl text-sm font-semibold text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 w-full py-3.5 rounded-xl text-white font-bold shadow-xl hover:shadow-emerald-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "⏳ Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
