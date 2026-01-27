import { useEffect, useMemo, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContextContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Login() {
  const { login, googleLogin, completeClubProfile } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("user");
  const [clubNamePromptOpen, setClubNamePromptOpen] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubNameLoading, setClubNameLoading] = useState(false);
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasGoogle = useMemo(() => Boolean(googleClientId), [googleClientId]);

  useEffect(() => {
    if (!hasGoogle) return;
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        try {
          setError("");
          const data = await googleLogin({
            credential: response.credential,
            userType,
          });
          if (data?.needsClubName) {
            setClubNamePromptOpen(true);
          } else {
            navigate("/");
          }
        } catch (err) {
          setError(err?.response?.data?.message || err?.friendlyMessage || "Google login failed");
        }
      },
    });

    const el = document.getElementById("googleSignInButton");
    if (el) {
      el.innerHTML = "";
      window.google.accounts.id.renderButton(el, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 360,
      });
    }
  }, [googleLogin, googleClientId, hasGoogle, navigate, userType]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const submitClubName = async (e) => {
    e.preventDefault();
    if (!clubName.trim()) return;
    setClubNameLoading(true);
    setError("");
    try {
      await completeClubProfile({ clubName: clubName.trim() });
      setClubNamePromptOpen(false);
      setClubName("");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.friendlyMessage || "Could not save club name");
    } finally {
      setClubNameLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-600 dark:text-slate-400 text-[15px]">Sign in to your account</p>
        </div>

        <Card className="p-8">
          {/* User Type Toggle */}
          <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <button
              type="button"
              onClick={() => setUserType("user")}
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

          <form className="space-y-4" onSubmit={submit}>
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

            <Button type="submit" variant="secondary" disabled={loading} className="w-full" size="lg">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {hasGoogle && (
            <div className="mt-5">
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">OR</div>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <div id="googleSignInButton" className="flex justify-center" />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                Google sign-in uses the selected User/Club toggle above.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-[15px] text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {clubNamePromptOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setClubNamePromptOpen(false)}
        >
          <div
            className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Set club name</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter your club name once to finish creating your club account.
            </p>

            <form className="mt-4 space-y-3" onSubmit={submitClubName}>
              <input
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Club name"
                className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 text-[15px]"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={clubNameLoading || !clubName.trim()}
                className="w-full"
                size="lg"
              >
                {clubNameLoading ? "Saving..." : "Save"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
