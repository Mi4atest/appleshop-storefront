export const THEME_STORAGE_KEY = "appleshop-theme";

export type ThemeChoice = "system" | "light" | "dark";

export const themeBootScript = `(function(){try{var desktop=matchMedia("(min-width: 768px)").matches;var stored=desktop?localStorage.getItem("${THEME_STORAGE_KEY}"):null;var systemDark=matchMedia("(prefers-color-scheme: dark)").matches;var dark=stored==="dark"||(stored!=="light"&&systemDark);document.documentElement.classList.toggle("dark",dark);document.documentElement.dataset.theme=desktop&&(stored==="light"||stored==="dark"||stored==="system")?stored:"system";}catch(e){}})();`;

export function readThemeChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  if (!desktop) return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function applyTheme(choice?: ThemeChoice | null) {
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  const stored =
    choice ??
    (desktop ? (localStorage.getItem(THEME_STORAGE_KEY) as ThemeChoice | null) : null);
  const valid =
    stored === "light" || stored === "dark" || stored === "system" ? stored : null;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = valid === "dark" || (valid !== "light" && systemDark);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.dataset.theme = desktop && valid ? valid : "system";
}

export function cycleTheme(): ThemeChoice {
  const order: ThemeChoice[] = ["system", "dark", "light"];
  const current = readThemeChoice();
  const next = order[(order.indexOf(current) + 1) % order.length] ?? "system";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
  return next;
}
