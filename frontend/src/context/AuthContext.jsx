// src/context/AuthContext.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "./AuthContextContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("auth_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("auth_user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, []);

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
  }, [persistUser]);

  const login = useCallback(async (payload) => {
    const res = await axios.post("/user/login", payload);
    persistUser(res.data.user);
    return res.data;
  }, [persistUser]);

  const googleLogin = useCallback(async (payload) => {
    const res = await axios.post("/user/google-login", payload);
    if (res.data?.user) {
      persistUser(res.data.user);
    }
    return res.data;
  }, [persistUser]);

  const completeClubProfile = useCallback(async (payload) => {
    const res = await axios.post("/user/complete-club-profile", payload);
    if (res.data?.user) {
      persistUser(res.data.user);
    }
    return res.data;
  }, [persistUser]);

  const register = useCallback(async (payload) => {
    const res = await axios.post("/user/register", payload);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.get("/user/logout");
    } finally {
      persistUser(null);
    }
  }, [persistUser]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await axios.get("/user/me");
      if (res.data?.user) {
        persistUser(res.data.user);
      }
    } catch {
      // ignore: likely not logged in
    }
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser: persistUser,
      refreshUser,
      login,
      googleLogin,
      completeClubProfile,
      register,
      logout,
    }),
    [
      user,
      loading,
      persistUser,
      refreshUser,
      login,
      googleLogin,
      completeClubProfile,
      register,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
