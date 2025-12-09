import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import IITMLogo from "../assets/iitm.png"; // update if your path differs

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-full px-6 md:px-10 py-3 flex items-center justify-between bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-slate-200">
      
      {/* Left Section with Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src={IITMLogo}
          alt="IITM Logo"
          className="h-9 w-9 rounded-md object-cover shadow-sm"
        />
        <div>
          <p className="text-xl font-extrabold text-slate-900">Events Hub</p>
          <p className="text-xs text-slate-500 -mt-1 tracking-wide">IIT Madras</p>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-slate-700 hover:text-emerald-600 transition">Home</Link>

        {user ? (
          <>
            <Link
              to={`/profile/${user._id}`}
              className="text-slate-700 hover:text-emerald-600 transition"
            >
              Profile
            </Link>

            {/* Avatar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <span className="h-8 w-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-semibold uppercase">
                {user.name?.[0] || user.username?.[0] || "U"}
              </span>
              <div className="leading-tight text-sm">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">@{user.username}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-4 py-1.5 rounded-lg transition shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-700 hover:text-emerald-600 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg shadow-sm"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-slate-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-xl rounded-xl border border-slate-200 px-6 py-4 flex flex-col gap-3 w-48 md:hidden z-40">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-emerald-600">Home</Link>

          {user ? (
            <>
              <Link to={`/profile/${user._id}`} onClick={() => setMenuOpen(false)} className="hover:text-emerald-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-left border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
