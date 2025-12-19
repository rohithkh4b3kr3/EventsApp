import { useState, useEffect, useContext, useRef } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { user } = useContext(AuthContext);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await axios.get(`/user/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data.users || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          className="w-full pl-12 pr-4 py-2.5 md:py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-black focus:border-emerald-500 rounded-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none text-sm md:text-[15px] transition-all touch-manipulation"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <svg
              className="animate-spin h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {showResults && searchQuery && (
        <div
          ref={resultsRef}
          className="absolute z-[60] w-full mt-2 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-[70vh] md:max-h-[400px] overflow-y-auto"
        >
          {searchResults.length > 0 ? (
            <div className="p-1">
              {searchResults.map((result) => (
                <div key={result._id} onClick={handleResultClick}>
                  <Link to={`/profile/${result._id}`} className="block">
                    <div className="flex items-center gap-3 p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white text-sm flex-shrink-0">
                        {result.name?.[0] || result.username?.[0] || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-[15px] truncate">
                          {result.name}
                        </p>
                        <p className="text-[15px] text-slate-500 dark:text-slate-400 truncate">
                          @{result.username}
                        </p>
                      </div>
                      {result.userType === "club" && (
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                          Club
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-[15px]">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
