"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface BMWMediaProps {
  /** Omit for an image-only chapter (no video asset for that beat). */
  video?: string;
  poster: string;
  alt: string;
  /** The BMW experience's own internal scroll container - videos play/pause
   * based on intersection within it, not the page's own viewport. */
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Every moving or still frame in the BMW Experience goes through this one
 * component: a poster image that IS the content under reduced motion or
 * before/if autoplay ever succeeds, with the video crossfading in only once
 * it has actually started playing - so a blocked autoplay degrades to a
 * still frame instead of a blank box. Playback is section-aware: paused
 * whenever the chapter scrolls out of the experience's own scroll
 * container, never the page's.
 */
export function BMWMedia({
  video,
  poster,
  alt,
  scrollerRef,
  prefersReducedMotion,
  className,
  priority,
  sizes,
}: BMWMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const showVideo = Boolean(video) && !prefersReducedMotion;

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !showVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            videoEl.muted = true;
            const playPromise = videoEl.play();
            if (playPromise) playPromise.catch(() => {});
          } else {
            videoEl.pause();
          }
        }
      },
      { root: scrollerRef.current, rootMargin: "15% 0px", threshold: 0.15 }
    );
    observer.observe(videoEl);

    return () => {
      observer.disconnect();
      videoEl.pause();
    };
  }, [showVideo, scrollerRef]);

  return (
    <div className={cn("relative overflow-hidden bg-[#0c0c0d]", className)}>
      <Image
        src={poster}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={cn("object-cover transition-opacity duration-700 ease-out", playing ? "opacity-0" : "opacity-100")}
      />
      {showVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
