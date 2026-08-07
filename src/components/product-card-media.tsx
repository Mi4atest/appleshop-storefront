"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type SyntheticEvent,
} from "react";
import { BagIcon } from "@/components/icons";
import { ProductPlaceholder } from "@/components/product-placeholder";
import type { ProductBadgeTone } from "@/lib/labels";

const BADGE_TONE_CLASS: Record<ProductBadgeTone, string> = {
  available: "bg-black text-white",
  on_order: "border border-black bg-white/95 text-black",
  fresh: "bg-black text-white",
};

const SWIPE_THRESHOLD_PX = 28;
const IMAGE_SIZES = "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw";

type ProductCardMediaProps = {
  title: string;
  badge: string | null;
  badgeTone?: ProductBadgeTone;
  images: string[];
  videoUrl: string | null;
  href: string;
  onAddToCart: () => void;
};

function imageFitClass(src: string) {
  return src.startsWith("/renders/") ? "object-contain" : "object-cover";
}

function VideoBadgeIcon({ progress }: { progress: number }) {
  const size = 28;
  const stroke = 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = c * (1 - clamped);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="rgba(0,0,0,0.55)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="white"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-[stroke-dashoffset] duration-200 ease-out"
      />
      <polygon points="11,9 11,19 20,14" fill="white" />
    </svg>
  );
}

export function ProductCardMedia({
  title,
  badge,
  badgeTone = "available",
  images,
  videoUrl,
  href,
  onAddToCart,
}: ProductCardMediaProps) {
  const hasMedia = images.length > 0;
  const imageCount = images.length;
  const canScrub = imageCount > 1;

  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryReady, setGalleryReady] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoWarm, setVideoWarm] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const addedTimer = useRef<number | null>(null);
  const touchStart = useRef<{ x: number; y: number; index: number } | null>(
    null,
  );
  const suppressClick = useRef(false);

  useEffect(() => {
    return () => {
      if (addedTimer.current != null) window.clearTimeout(addedTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!videoUrl) return;
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setVideoWarm(true);
        observer.disconnect();
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [videoUrl]);

  useEffect(() => {
    if (!videoWarm || !videoUrl) return;
    const el = videoRef.current;
    if (!el) return;

    const updateProgress = () => {
      if (!el.duration || !Number.isFinite(el.duration) || el.duration <= 0) {
        return;
      }
      if (el.buffered.length > 0) {
        const end = el.buffered.end(el.buffered.length - 1);
        setVideoProgress(Math.min(1, end / el.duration));
      }
    };

    const onCanPlay = () => setVideoProgress((p) => Math.max(p, 0.85));
    const onCanPlayThrough = () => setVideoProgress(1);

    el.addEventListener("progress", updateProgress);
    el.addEventListener("loadeddata", updateProgress);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("canplaythrough", onCanPlayThrough);

    return () => {
      el.removeEventListener("progress", updateProgress);
      el.removeEventListener("loadeddata", updateProgress);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, [videoWarm, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playingVideo) {
      void video.play().catch(() => {
        /* ignore autoplay failures */
      });
      return;
    }
    video.pause();
    video.currentTime = 0;
  }, [playingVideo]);

  const indexFromClientX = (clientX: number) => {
    const el = rootRef.current;
    if (!el || imageCount < 2) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.min(imageCount - 1, Math.floor(ratio * imageCount));
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (canScrub) setGalleryReady(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (!playingVideo) setActiveIndex(0);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!canScrub || playingVideo) return;
    setActiveIndex(indexFromClientX(event.clientX));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" || playingVideo) return;
    if (canScrub) setGalleryReady(true);
    touchStart.current = {
      x: event.clientX,
      y: event.clientY,
      index: activeIndex,
    };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !canScrub || playingVideo) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) {
      return;
    }

    suppressClick.current = true;
    const dir = dx < 0 ? 1 : -1;
    setActiveIndex((i) =>
      Math.min(imageCount - 1, Math.max(0, start.index + dir)),
    );
  };

  const handleLinkClick = (event: SyntheticEvent) => {
    if (suppressClick.current) {
      event.preventDefault();
      suppressClick.current = false;
      return;
    }
    if (playingVideo) {
      event.preventDefault();
      setPlayingVideo(false);
    }
  };

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToCart();
    setJustAdded(true);
    if (addedTimer.current != null) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => {
      setJustAdded(false);
      addedTimer.current = null;
    }, 2200);
  };

  const handleVideoToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setVideoWarm(true);
    setPlayingVideo((open) => !open);
  };

  const showCta = hovered || justAdded;
  const primaryIsRender = images[0]?.startsWith("/renders/") ?? false;
  const frameClass = primaryIsRender ? "aspect-square" : "aspect-[3/4]";
  const visibleIndexes = galleryReady
    ? images.map((_, i) => i)
    : Array.from(new Set([0, activeIndex]));

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden bg-neutral-50 ${frameClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        touchStart.current = null;
      }}
    >
      {badge ? (
        <span
          className={`absolute left-0 top-0 z-10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${BADGE_TONE_CLASS[badgeTone]}`}
        >
          {badge}
        </span>
      ) : null}

      {videoUrl ? (
        <button
          type="button"
          onClick={handleVideoToggle}
          className="absolute right-1.5 top-1.5 z-30 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          aria-label={playingVideo ? "Скрыть видео" : "Смотреть видео"}
          aria-pressed={playingVideo}
        >
          <VideoBadgeIcon progress={playingVideo ? 1 : videoProgress} />
        </button>
      ) : null}

      <Link
        href={href}
        className="absolute inset-0 z-[1] block"
        aria-label={title}
        onClick={handleLinkClick}
        draggable={false}
      >
        {hasMedia ? (
          <>
            {visibleIndexes.map((i) => {
              const src = images[i];
              if (!src) return null;
              const show = !playingVideo && i === activeIndex;
              return (
                <Image
                  key={`${src}-${i}`}
                  src={src}
                  alt={i === 0 ? title : ""}
                  fill
                  sizes={IMAGE_SIZES}
                  className={`${imageFitClass(src)} transition-opacity duration-150 ${
                    show ? "opacity-100" : "opacity-0"
                  }`}
                  priority={i === 0}
                />
              );
            })}
          </>
        ) : (
          <ProductPlaceholder title={title} />
        )}
      </Link>

      {videoUrl && videoWarm ? (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="auto"
          className={`pointer-events-none absolute inset-0 z-[2] h-full w-full object-cover transition-opacity duration-200 ${
            playingVideo ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!playingVideo}
        />
      ) : null}

      {canScrub && !playingVideo ? (
        <div
          className={`pointer-events-none absolute inset-x-0 z-10 flex items-center justify-center gap-1 ${
            showCta ? "bottom-10" : "bottom-3"
          }`}
          aria-hidden="true"
        >
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-150 ${
                i === activeIndex
                  ? "w-3 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
                  : "w-1 bg-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
              }`}
            />
          ))}
        </div>
      ) : null}

      {/* Mobile: compact bag affordance (bottom-right — away from badge/video/dots). */}
      <button
        type="button"
        onClick={handleAdd}
        className={`absolute bottom-1.5 right-1.5 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-colors md:hidden ${
          justAdded ? "bg-white text-black" : "bg-black text-white"
        }`}
        aria-label={justAdded ? "Добавлено в корзину" : "В корзину"}
      >
        {justAdded ? (
          <span className="text-[11px] font-bold leading-none">✓</span>
        ) : (
          <BagIcon className="h-4 w-4" />
        )}
      </button>

      {/* Desktop: full-width bar on hover. */}
      <button
        type="button"
        onClick={handleAdd}
        className={`absolute inset-x-0 bottom-0 z-20 hidden px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 md:block ${
          justAdded ? "bg-white text-black" : "bg-black text-white"
        } ${
          showCta
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        {justAdded ? "Добавлено" : "В корзину"}
      </button>
    </div>
  );
}
