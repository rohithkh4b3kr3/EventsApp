import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    }
    // Default to light mode
    return "light";
  });

  // Initialize theme on mount - sync DOM with state
  useEffect(() => {
    const root = document.documentElement;
    // Sync DOM with current theme state on initial mount
    root.classList.remove("dark");
    if (theme === "dark") {
      root.classList.add("dark");
    }
  }, []);

  // Update theme when it changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Always remove dark class first to ensure clean state
    root.classList.remove("dark");
    
    // Add dark class only if theme is explicitly "dark"
    if (theme === "dark") {
      root.classList.add("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

