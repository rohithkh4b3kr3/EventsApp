import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Calendar from "./pages/Calendar";
import Chats from "./pages/Chats";
import ClubChatRoom from "./pages/ClubChatRoom";
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import Footer from "./components/Footer";
import { AuthContext } from "./context/AuthContextContext";
import { useContext } from "react";

function HomeRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Home />;
}

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
                  <Route path="/" element={<HomeRoute />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile/:id?" element={<Profile />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/chats/:clubId" element={<ClubChatRoom />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="/calendar" element={<Calendar />} />
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
