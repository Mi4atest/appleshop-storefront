"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

export type FilterOption = {
  id: string;
  label: string;
};

type FilterDropdownProps = {
  label: string;
  value: string | null;
  options: FilterOption[];
  onChange: (value: string | null) => void;
  align?: "left" | "center";
};

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  align = "center",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const selected = options.find((option) => option.id === value) ?? null;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    // Capture phase: close this menu when starting a tap elsewhere,
    // without swallowing the other control's own click.
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={`inline-flex w-full touch-manipulation items-center justify-center gap-1.5 px-1 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
          selected ? "text-black" : "text-neutral-600"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((state) => !state)}
      >
        <span className="truncate">
          {selected ? selected.label : label}
        </span>
        <ChevronDownIcon
          className={`h-3 w-3 shrink-0 opacity-70 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="listbox"
          className={`absolute top-[calc(100%+0.35rem)] z-30 max-h-64 min-w-[11rem] overflow-y-auto overscroll-contain border border-neutral-200 bg-white py-1 shadow-sm ${
            align === "left" ? "left-0" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <button
            type="button"
            role="option"
            aria-selected={!selected}
            className="block w-full touch-manipulation px-3 py-2.5 text-left text-xs uppercase tracking-[0.12em] text-neutral-500 active:bg-neutral-100"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Все
          </button>
          {options.map((option) => {
            const active = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                className={`block w-full touch-manipulation px-3 py-2.5 text-left text-xs tracking-[0.04em] active:bg-neutral-100 ${
                  active ? "bg-neutral-100 font-bold" : ""
                }`}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
