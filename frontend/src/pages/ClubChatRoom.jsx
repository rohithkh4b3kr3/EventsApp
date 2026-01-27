import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io as createSocket } from "socket.io-client";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContextContext";

const getAvatarUrl = (photoPath) => {
  if (!photoPath) return "";
  if (photoPath.startsWith("http")) return photoPath;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api$/, "");
  return `${base}${photoPath}`;
};

export default function ClubChatRoom() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [club, setClub] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [isJoined, setIsJoined] = useState(true);

  const socketRef = useRef(null);
  const listRef = useRef(null);

  const apiBase = useMemo(() => (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api$/, ""), []);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const loadClub = useCallback(async () => {
    try {
      const res = await axios.get(`/user/profile/${clubId}`);
      setClub(res.data.user);
    } catch {
      // ignore
    }
  }, [clubId]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/chat/club/${clubId}/messages?limit=100`);
      setMessages(res.data.messages || []);
      setIsJoined(true);
    } catch (err) {
      const msg = err?.friendlyMessage || "Could not load messages";
      setError(msg);
      if (String(msg).toLowerCase().includes("join")) {
        setIsJoined(false);
      }
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    if (user?.userType === "club" && String(user._id) === String(clubId)) {
      setIsJoined(true);
    }
  }, [user?._id, user?.userType, clubId]);

  const joinChat = useCallback(async () => {
    await axios.post(`/chat/club/${clubId}/join`);
    setIsJoined(true);
    await loadMessages();
  }, [clubId, loadMessages]);

  const leaveChat = useCallback(async () => {
    await axios.post(`/chat/club/${clubId}/leave`);
    setIsJoined(false);
    navigate("/chats");
  }, [clubId, navigate]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user || !clubId) return;
    loadClub();
    loadMessages();
  }, [user, clubId, loadClub, loadMessages]);

  useEffect(() => {
    if (!user || !clubId) return;

    const socket = createSocket(apiBase, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_club_chat", { clubId });
    });

    socket.on("message_new", (msg) => {
      if (msg?.clubId !== clubId) return;
      setMessages((prev) => [...prev, msg]);
      setTimeout(scrollToBottom, 50);
    });

    return () => {
      try {
        socket.emit("leave_club_chat", { clubId });
      } catch {
        // ignore
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [apiBase, clubId, user, scrollToBottom]);

  useEffect(() => {
    setTimeout(scrollToBottom, 80);
  }, [messages, scrollToBottom]);

  const onSend = async (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;

    setText("");

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("send_message", { clubId, text: clean });
      return;
    }

    // fallback: if socket isn't connected, just reload
    await loadMessages();
  };

  return (
    <div className="max-w-[650px] mx-auto border-x border-slate-100 dark:border-slate-900 min-h-screen bg-white dark:bg-black flex flex-col">
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-4 py-4 flex items-center gap-3">
        <Link to="/chats" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          {club?.profilePhoto ? (
            <img
              src={getAvatarUrl(club.profilePhoto)}
              alt={club?.name}
              className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white">
              {club?.name?.[0] || club?.username?.[0] || "C"}
            </div>
          )}

          <div className="min-w-0">
            <div className="font-black text-slate-900 dark:text-white truncate">
              {club?.clubName || club?.name || "Club Chat"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">@{club?.username || clubId}</div>
          </div>
        </div>

        {isJoined ? (
          <button
            onClick={leaveChat}
            className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold text-sm transition-colors"
          >
            Leave
          </button>
        ) : (
          <button
            onClick={joinChat}
            className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
          >
            Join
          </button>
        )}
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 text-center">
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🗨️</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No messages yet</p>
            <p className="text-slate-400 text-sm">Say hi to start the conversation.</p>
          </div>
        )}

        {!loading && messages.map((m) => {
          const mine = m?.sender?._id ? String(m.sender._id) === String(user?._id) : String(m.senderId?._id || m.senderId) === String(user?._id);
          const sender = m.sender || m.senderId;
          const isClubOwnerMessage = sender?.userType === "club" && String(sender?._id) === String(clubId);
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                  mine
                    ? "bg-emerald-500 text-white"
                    : isClubOwnerMessage
                      ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-slate-900 dark:text-white"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white"
                }`}
              >
                {!mine && (
                  <div className="text-xs font-bold opacity-70 mb-1">
                    {sender?.clubName || sender?.name || sender?.username || "User"}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap break-words">{m.text}</div>
                <div className={`text-[10px] mt-1 opacity-70 ${mine ? "text-white" : "text-slate-500 dark:text-slate-400"}`}>
                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={onSend} className="border-t border-slate-100 dark:border-slate-900 p-3">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isJoined ? "Message..." : "Join this club chat to message"}
            disabled={!isJoined}
            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!isJoined || !text.trim()}
            className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-[15px] transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
