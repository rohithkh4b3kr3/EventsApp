import IITMLogo from "../assets/iitm.png";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-10">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-8">
          
          {/* Branding Section */}
          <div className="flex items-start gap-4">
            <img
              src={IITMLogo}
              alt="IIT Madras Logo"
              className="h-14 w-14 lg:h-16 lg:w-16 rounded-xl object-contain bg-white dark:bg-slate-900 shadow-sm flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Events Hub
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                IIT Madras — Discover & Share Campus Events
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
            <a
              href="mailto:support@eventshub.in"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Contact
            </a>
            <a
              href="/settings"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Settings
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright & Credits */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <p>
                © {new Date().getFullYear()} Events Hub. All rights reserved.
              </p>
            </div>

            {/* Credits */}
            <div className="flex flex-col md:items-end gap-1 text-xs text-slate-500 dark:text-slate-400">
              <p>
                Maintained by{' '}
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Institute WebOps & MobOps Team
                </span>
              </p>
              <p className="text-slate-400 dark:text-slate-500">
                Built by{' '}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  0xRedox
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
