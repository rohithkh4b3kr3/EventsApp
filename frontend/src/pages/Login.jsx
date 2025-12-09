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
    <div className="max-w-md mx-auto mt-16 bg-white p-8 shadow-sm rounded-2xl border border-slate-100">
      <h1 className="text-3xl font-bold mb-2 text-slate-900">Welcome back</h1>
      <p className="text-slate-600 mb-6">Login to post and bookmark upcoming events.</p>

      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label className="text-sm text-slate-600">Email</label>
          <input
            required
            type="email"
            placeholder="you@example.com"
            className="w-full border border-slate-200 p-3 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Password</label>
          <input
            required
            type="password"
            placeholder="••••••••"
            className="w-full border border-slate-200 p-3 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="bg-emerald-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4 text-center">
        New here?{" "}
        <Link to="/register" className="text-emerald-700 font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}
