import IITMLogo from "../assets/iitm.png"; // adjust path if needed

export default function Footer() {
  return (
    <footer className="mt-16 py-10 border-t border-slate-800 bg-slate-900/40 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Branding with logo */}
        <div className="flex items-center gap-3">
          <img
            src={IITMLogo}
            alt="IIT Madras Logo"
            className="h-10 w-10 rounded-xl object-cover shadow-md"
          />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Events Hub
            </h2>
            <p className="text-sm text-slate-400 mt-1 tracking-wide">
              IIT Madras — Discover & Share Campus Events
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <a
            href="mailto:support@eventshub.in"
            className="text-slate-400 hover:text-emerald-400 transition-all"
          >
            Contact
          </a>
          <a
            href="/settings"
            className="text-slate-400 hover:text-emerald-400 transition-all"
          >
            Settings
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-500 tracking-wide">
          © {new Date().getFullYear()} Events Hub — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
