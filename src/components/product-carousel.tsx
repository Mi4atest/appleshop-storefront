"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type MediaSlide =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

type ProductCarouselProps = {
  slides: MediaSlide[];
  alt: string;
};

function ChevronLeft({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 6L9 12l6 6" />
    </svg>
  );
}

function ChevronRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ProductCarousel({ slides, alt }: ProductCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;
  const safeIndex = total === 0 ? 0 : Math.min(index, total - 1);

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex((next + total) % total);
    },
    [total],
  );

  if (total === 0) {
    return (
      <div className="flex aspect-square w-full max-w-full items-center justify-center bg-neutral-100 text-xs uppercase tracking-[0.18em] text-neutral-400">
        Нет фото
      </div>
    );
  }

  const current = slides[safeIndex];

  return (
    <div className="w-full min-w-0 max-w-full">
      <div
        className="relative aspect-square w-full max-w-full overflow-hidden bg-neutral-50"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current == null) return;
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 40) return;
          go(delta > 0 ? safeIndex - 1 : safeIndex + 1);
        }}
      >
        {current.type === "image" ? (
          <Image
            src={current.src}
            alt={`${alt} — ${safeIndex + 1}/${total}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            preload={safeIndex === 0}
          />
        ) : (
          <video
            key={current.src}
            src={current.src}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full bg-black object-contain"
          />
        )}

        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={() => go(safeIndex - 1)}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-black backdrop-blur-[2px] transition-colors hover:bg-white md:left-3 md:h-10 md:w-10"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={() => go(safeIndex + 1)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-black backdrop-blur-[2px] transition-colors hover:bg-white md:right-3 md:h-10 md:w-10"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, i) => (
            <button
              key={`${slide.type}-${slide.src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden border md:h-16 md:w-16 ${
                i === safeIndex ? "border-black" : "border-neutral-200"
              }`}
              aria-label={`Слайд ${i + 1}`}
            >
              {slide.type === "image" ? (
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-neutral-900 text-[10px] font-bold uppercase tracking-wider text-white">
                  Видео
                </span>
              )}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-2 text-center text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        {safeIndex + 1} / {total}
        {current.type === "video" ? " · видео" : ""}
      </p>
    </div>
  );
}
