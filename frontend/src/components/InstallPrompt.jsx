import { useEffect, useMemo, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const isIos = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  const isStandalone = useMemo(() => {
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true
    );
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed) return null;
  if (isStandalone) return null;

  const canPrompt = Boolean(deferredPrompt);
  const showIosHint = isIos && !canPrompt;

  if (!canPrompt && !showIosHint) return null;

  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,520px)]">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-xl px-4 py-3 flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-slate-900 dark:text-white">Install InstiEvents</div>
          {showIosHint ? (
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              On iPhone/iPad: tap Share, then Add to Home Screen.
            </div>
          ) : (
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Get the app-like experience with offline support.
            </div>
          )}

          <div className="mt-2 flex items-center gap-2">
            {canPrompt && (
              <button
                onClick={onInstall}
                className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
              >
                Install
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold text-sm transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
