import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const pad2 = (n) => String(n).padStart(2, "0");

const toLocalDateKey = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const monthLabel = (d) =>
  d.toLocaleString(undefined, { month: "long", year: "numeric" });

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState(toLocalDateKey(new Date()));

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/post/club-events");
      const posts = res.data?.posts || [];
      setEvents(Array.isArray(posts) ? posts : []);
    } catch (err) {
      setError("Could not load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const key = toLocalDateKey(ev.eventDate);
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return map;
  }, [events]);

  const days = useMemo(() => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const start = new Date(firstDayOfMonth);
    start.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
    
    const out = [];
    for (let i = 0; i < 42; i++) {
      out.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return out;
  }, [currentMonth]);

  const selectedEvents = useMemo(() => {
    return eventsByDay.get(selectedDateKey) || [];
  }, [eventsByDay, selectedDateKey]);

  const todayKey = toLocalDateKey(new Date());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-20 lg:pb-10">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="hidden sm:block">
            <h1 className="text-xl font-black dark:text-white">Calendar</h1>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <h2 className="text-lg font-bold dark:text-white min-w-[140px] text-center">
              {monthLabel(currentMonth)}
            </h2>

            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        
        {/* --- CALENDAR GRID --- */}
        <div className="bg-white dark:bg-zinc-950 rounded-[2rem] shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-7 text-center border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/50">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 relative">
            {days.map((d, i) => {
              const key = toLocalDateKey(d);
              const isCurrentMonth = d.getMonth() === currentMonth.getMonth();
              const isSelected = selectedDateKey === key;
              const isToday = key === todayKey;
              const hasEvents = (eventsByDay.get(key) || []).length > 0;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDateKey(key)}
                  className={`relative h-14 sm:h-24 flex flex-col items-center justify-center border-b border-r border-slate-50 dark:border-zinc-900 transition-all
                    ${isSelected ? 'bg-emerald-500 text-white shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-zinc-900'}
                    ${!isCurrentMonth && !isSelected ? 'opacity-20' : ''}
                  `}
                >
                  <span className={`text-sm sm:text-base font-bold ${isToday && !isSelected ? 'text-emerald-500' : ''}`}>
                    {d.getDate()}
                  </span>
                  
                  {/* Event Indicator Dot */}
                  {hasEvents && (
                    <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- EVENTS LIST --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black dark:text-white">
              {selectedDateKey === todayKey ? "Today's Events" : "Events"}
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-slate-200 dark:bg-zinc-800 rounded-full dark:text-slate-400">
              {selectedDateKey}
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {selectedEvents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white dark:bg-zinc-950 p-10 rounded-[2rem] border border-dashed border-slate-300 dark:border-zinc-800 text-center"
                >
                  <p className="text-slate-400 font-medium">No events scheduled</p>
                </motion.div>
              ) : (
                selectedEvents.map((ev, idx) => (
                  <motion.div
                    key={ev._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-zinc-950 p-5 rounded-[2rem] border border-slate-100 dark:border-zinc-900 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold">
                        {ev.eventTime?.slice(0, 2) || "EV"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black dark:text-white truncate">
                          {ev.userId?.clubName || ev.userId?.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1">
                          {ev.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded text-slate-500">
                            {ev.eventTime}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 truncate">
                            {ev.venue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}