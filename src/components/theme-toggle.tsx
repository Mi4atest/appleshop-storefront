"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  cycleTheme,
  readThemeChoice,
  type ThemeChoice,
} from "@/lib/theme";

export function ThemeSync() {
  useEffect(() => {
    const apply = () => applyTheme();
    apply();
    const color = window.matchMedia("(prefers-color-scheme: dark)");
    const desktop = window.matchMedia("(min-width: 768px)");
    color.addEventListener("change", apply);
    desktop.addEventListener("change", apply);
    window.addEventListener("storage", apply);
    return () => {
      color.removeEventListener("change", apply);
      desktop.removeEventListener("change", apply);
      window.removeEventListener("storage", apply);
    };
  }, []);

  return null;
}

const LABEL: Record<ThemeChoice, string> = {
  system: "Тема: как в системе",
  dark: "Тема: тёмная",
  light: "Тема: светлая",
};

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    const sync = () => setChoice(readThemeChoice());
    sync();
    const desktop = window.matchMedia("(min-width: 768px)");
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);

  return (
    <button
      type="button"
      className="hidden h-10 w-10 items-center justify-center text-black transition-opacity hover:opacity-60 md:inline-flex dark:text-white"
      aria-label={LABEL[choice]}
      title={LABEL[choice]}
      onClick={() => setChoice(cycleTheme())}
    >
      {choice === "light" ? <SunIcon /> : choice === "dark" ? <MoonIcon /> : <SystemIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path strokeLinecap="round" d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M18.2 5.8l-1.4 1.4M7.2 16.8l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinejoin="round" d="M15.5 3.5a7.5 7.5 0 1 0 5 12.5A8 8 0 0 1 15.5 3.5Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path strokeLinecap="round" d="M9 19.5h6M12 16v3.5" />
    </svg>
  );
}
