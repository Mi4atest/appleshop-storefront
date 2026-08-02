"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ProductPlaceholder } from "@/components/product-placeholder";

type ProductCardMediaProps = {
  title: string;
  badge: string | null;
  images: string[];
  videoUrl: string | null;
};

export function ProductCardMedia({
  title,
  badge,
  images,
  videoUrl,
}: ProductCardMediaProps) {
  const hasMedia = images.length > 0;
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-50"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {badge ? (
        <span className="absolute left-0 top-0 z-10 bg-black px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
          {badge}
        </span>
      ) : null}

      {hasMedia ? (
        <>
          <Image
            src={images[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-300 ${
              hovered && (images[1] || videoUrl) ? "opacity-0" : "opacity-100"
            }`}
          />
          {images[1] && !videoUrl ? (
            <Image
              src={images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-300 ${
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
    </div>
  );
}
