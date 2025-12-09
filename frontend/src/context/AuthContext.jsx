// src/context/AuthContext.jsx
import { createContext, useEffect, useMemo, useState } from "react";
import axios from "../api/axios";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("auth_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const res = await axios.get("/user/me");
        if (res.data?.user) {
          persistUser(res.data.user);
        }
      } catch {
        // ignore: likely not logged in yet
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("auth_user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("auth_user");
    }
  };

  const login = async (payload) => {
    const res = await axios.post("/user/login", payload);
    persistUser(res.data.user);
    return res.data;
  };

  const register = async (payload) => {
    const res = await axios.post("/user/register", payload);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.get("/user/logout");
    } finally {
      persistUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser: persistUser,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
