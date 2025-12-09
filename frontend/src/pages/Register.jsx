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
    <div className="max-w-md mx-auto mt-16 bg-white p-8 shadow-sm rounded-2xl border border-slate-100">
      <h1 className="text-3xl font-bold mb-2 text-slate-900">Create your account</h1>
      <p className="text-slate-600 mb-6">Join the community and share upcoming events.</p>

      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label className="text-sm text-slate-600">Full name</label>
          <input
            required
            type="text"
            placeholder="Jane Doe"
            className="w-full border border-slate-200 p-3 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Username</label>
          <input
            required
            type="text"
            placeholder="jane_doe"
            className="w-full border border-slate-200 p-3 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

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
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-700 font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
}
