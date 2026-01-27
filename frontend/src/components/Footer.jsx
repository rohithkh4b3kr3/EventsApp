import IITMLogo from "../assets/iitm.png";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black">
      <div className="w-full px-6 sm:px-8 lg:px-14 py-6 lg:py-8">

        {/* TOP: Branding */}
        <div className="flex items-start gap-4 mb-6">
          <img
            src={IITMLogo}
            alt="IIT Madras Logo"
            className="h-12 w-12 lg:h-14 lg:w-14 rounded-xl object-contain bg-white dark:bg-slate-900 shadow-sm"
          />

          <div className="max-w-md">
            <h2 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-white">
              InstiEvents
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              IIT Madras — Discover & Share Campus Events
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        {/* <div className="h-px w-full bg-slate-00 dark:bg-slate-800 mb-5" /> */}

        {/* BOTTOM: Meta */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">

          {/* Left */}
          <p>
            © {new Date().getFullYear()} InstiEvents. All rights reserved.
          </p>

          {/* Right */}
          <div className="md:text-right space-y-1">
            <p>
              Maintained by{" "}
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Institute WebOps & MobOps Team
              </span>
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}
