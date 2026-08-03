"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ProductPlaceholder } from "@/components/product-placeholder";
import type { ProductBadgeTone } from "@/lib/labels";

const BADGE_TONE_CLASS: Record<ProductBadgeTone, string> = {
  available: "bg-black text-white",
  on_order: "border border-black bg-white/95 text-black",
  fresh: "bg-black text-white",
};

type ProductCardMediaProps = {
  title: string;
  badge: string | null;
  badgeTone?: ProductBadgeTone;
  images: string[];
  videoUrl: string | null;
  href: string;
  onAddToCart: () => void;
};

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
  const [hovered, setHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const addedTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current != null) window.clearTimeout(addedTimer.current);
    };
  }, []);

  const handleEnter = () => {
    setHovered(true);
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {
      /* ignore */
    });
  };

  const handleLeave = () => {
    setHovered(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
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

  const showCta = hovered || justAdded;
  const primaryIsRender = images[0]?.startsWith("/renders/") ?? false;
  // Square cutouts from storefronts fit a square frame; live photos stay 3:4.
  const frameClass = primaryIsRender ? "aspect-square" : "aspect-[3/4]";
  const fitClass = primaryIsRender ? "object-contain" : "object-cover";

  return (
    <div
      className={`relative w-full overflow-hidden bg-neutral-50 ${frameClass}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {badge ? (
        <span
          className={`absolute left-0 top-0 z-10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${BADGE_TONE_CLASS[badgeTone]}`}
        >
          {badge}
        </span>
      ) : null}

      <Link href={href} className="absolute inset-0 z-[1] block" aria-label={title}>
        {hasMedia ? (
          <>
            <Image
              src={images[0]}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`${fitClass} transition-opacity duration-300 ${
                hovered && (images[1] || videoUrl) ? "opacity-0" : "opacity-100"
              }`}
            />
            {images[1] && !videoUrl ? (
              <Image
                src={images[1]}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={`${
                  images[1].startsWith("/renders/")
                    ? "object-contain"
                    : "object-cover"
                } transition-opacity duration-300 ${
                  hovered ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null}
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  hovered ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null}
          </>
        ) : (
          <ProductPlaceholder title={title} />
        )}
      </Link>

      <button
        type="button"
        onClick={handleAdd}
        className={`absolute inset-x-0 bottom-0 z-20 px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 md:text-[11px] ${
          justAdded
            ? "bg-white text-black"
            : "bg-black text-white"
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
