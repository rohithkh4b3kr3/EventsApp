import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LeftSidebar from "./components/LeftSidebar";
import TopNavbar from "./components/TopNavbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Following from "./pages/Following";
import Settings from "./pages/Settings";
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-200 flex flex-col">
            <LeftSidebar />
            <TopNavbar />
            
            <main className="lg:pl-[275px] flex-1 flex flex-col">
              <div className="pt-[73px] lg:pt-0 flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile/:id?" element={<Profile />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
              <Footer />
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
