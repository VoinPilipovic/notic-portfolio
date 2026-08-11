"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

import { createLenis } from "@/animations/lenis";
import { gsap, ScrollTrigger } from "@/animations/gsap";

let activeLenis: Lenis | null = null;

/** Smooth-scrolls to a target using the live Lenis instance so programmatic
 * navigation (floating nav, menu overlay) stays in the same smoothing system
 * as wheel/touch scroll, instead of fighting it with a native scrollIntoView. */
export function scrollTo(
  target: string | number | HTMLElement,
  options?: Parameters<Lenis["scrollTo"]>[1]
) {
  if (activeLenis) {
    activeLenis.scrollTo(target, { duration: 1.4, ...options });
    return;
  }
  if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

/** Stops/resumes the live Lenis instance - used while a full-screen overlay
 * (the Projects window) is open, so its wheel/touch input can't also drive
 * the main page underneath it. Paired with locking `body` overflow as a
 * native-scroll fallback for input Lenis doesn't intercept. */
export function stopScroll() {
  activeLenis?.stop();
}

export function startScroll() {
  activeLenis?.start();
}

export function useLenis() {
  useEffect(() => {
    const lenis = createLenis();
    activeLenis = lenis;
    const syncToGsap = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(syncToGsap);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(syncToGsap);
      lenis.destroy();
      activeLenis = null;
    };
  }, []);
}
