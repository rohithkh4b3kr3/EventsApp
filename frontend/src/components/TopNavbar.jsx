import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";

export default function TopNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="lg:hidden fixed top-0 left-0 right-0 w-full z-[60] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        {/* Search Bar Section - Only show when user is logged in */}
        {user && (
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
            <SearchBar />
          </div>
        )}
        
        {/* Header with Logo and Menu */}
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Events Hub
            </p>
          </Link>

          <button
            className="p-2 rounded-full text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 active:bg-slate-200 dark:active:bg-slate-800 transition-colors touch-manipulation"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 right-0 mx-4 mt-2 p-2 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-[70]">
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)} 
              className="block px-4 py-3 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-[15px] font-medium"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link 
                  to="/following" 
                  onClick={() => setMenuOpen(false)} 
                  className="block px-4 py-3 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-[15px] font-medium"
                >
                  Following
                </Link>
                <Link 
                  to="/favorites" 
                  onClick={() => setMenuOpen(false)} 
                  className="block px-4 py-3 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-[15px] font-medium"
                >
                  Favorites
                </Link>
                <Link 
                  to={`/profile/${user._id}`} 
                  onClick={() => setMenuOpen(false)} 
                  className="block px-4 py-3 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-[15px] font-medium"
                >
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  onClick={() => setMenuOpen(false)} 
                  className="block px-4 py-3 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-[15px] font-medium"
                >
                  Settings
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-[15px] font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)} 
                  className="block px-4 py-3 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-[15px] font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMenuOpen(false)} 
                  className="block px-4 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors text-[15px] font-semibold text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
    </nav>
  );
}
