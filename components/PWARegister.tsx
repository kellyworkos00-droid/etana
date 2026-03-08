"use client";

import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures are non-fatal for browsing.
      });
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isIos && !isStandalone) {
      setShowFallback(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  if (!installPrompt && !showFallback) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-[60] md:bottom-6">
      {installPrompt ? (
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-xl transition hover:bg-primary-700"
          aria-label="Install Eterna app"
        >
          <FiDownload /> Install App
        </button>
      ) : (
        <div className="max-w-[220px] rounded-2xl border border-rose-200 bg-white/95 px-3 py-2 text-xs text-gray-700 shadow-xl backdrop-blur">
          On iPhone, tap Share then &quot;Add to Home Screen&quot; to install.
        </div>
      )}
    </div>
  );
}
