import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar />

            <div className="pt-6 pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:id?" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
            <Footer/>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
