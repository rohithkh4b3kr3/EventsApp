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
  const [userType, setUserType] = useState("user");
  const [clubName, setClubName] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registerData = {
        name,
        username,
        email,
        password,
        userType,
      };
      
      if (userType === "club") {
        if (!clubName.trim()) {
          setError("Club name is required");
          setLoading(false);
          return;
        }
        registerData.clubName = clubName;
        registerData.name = clubName;
      }

      await register(registerData);
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h1>
          <p className="text-slate-600 dark:text-slate-400 text-[15px]">Join Events Hub today</p>
        </div>

        <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          {/* User Type Toggle */}
          <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setUserType("user");
                setClubName("");
              }}
              className={`flex-1 py-2 rounded-md font-semibold text-[15px] transition-all ${
                userType === "user"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setUserType("club")}
              className={`flex-1 py-2 rounded-md font-semibold text-[15px] transition-all ${
                userType === "club"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Club
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {userType === "club" ? (
              <div>
                <input
                  required
                  type="text"
                  placeholder="Club Name"
                  className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 text-[15px]"
                  value={clubName}
                  onChange={(e) => {
                    setClubName(e.target.value);
                    setName(e.target.value);
                  }}
                />
              </div>
            ) : (
              <div>
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 text-[15px]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <input
                required
                type="text"
                placeholder="Username"
                className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 text-[15px]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <input
                required
                type="email"
                placeholder={userType === "club" ? "Club email" : "Email"}
                className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 text-[15px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 text-[15px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 py-3 rounded-full font-bold text-[15px] transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[15px] text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
