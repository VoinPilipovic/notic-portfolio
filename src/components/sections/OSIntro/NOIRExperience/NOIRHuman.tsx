"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";

import { gsap } from "@/animations/gsap";

import { BMWMedia as SceneMedia } from "../BMWExperience/BMWMedia";
import { noirImages, noirVideos } from "./noirAssets";
import { noirChapters } from "./noirContent";
import { noirReveal, sceneVeilReveal } from "./noirMotion";

interface NOIRHumanProps {
  scrollerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

const content = noirChapters.human;

/**
 * Chapter 04 - the campaign's only human moment, kept a silhouette rather
 * than a face. Copy sits to one side in a narrow column; the figure and
 * the negative space around him carry the rest, so this never reads as a
 * fashion e-commerce layout.
 */
export function NOIRHuman({ scrollerRef, prefersReducedMotion }: NOIRHumanProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scroller = scrollerRef.current;

    const context = gsap.context(() => {
      sceneVeilReveal(section, veilRef.current, scroller);
      noirReveal(section, [labelRef.current, headingRef.current], scroller, { stagger: 0.18 });
      noirReveal(section, [detailRef.current], scroller, { start: "top 55%", y: 26 });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion, scrollerRef]);

  return (
    <section ref={sectionRef} className="relative flex h-screen min-h-screen w-full items-center overflow-hidden bg-black">
      <SceneMedia
        video={noirVideos.man}
        poster={noirImages.manProduct}
        alt="A man in a dark suit holding the NOIR N°01 bottle, his face out of frame."
        scrollerRef={scrollerRef}
        prefersReducedMotion={prefersReducedMotion}
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      {!prefersReducedMotion && <div ref={veilRef} aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-black" />}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, transparent 45%, transparent 100%)" }}
      />

      <div className="relative z-10 flex w-full max-w-content flex-col gap-16 px-gutter sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-xs flex-col gap-3.5">
          <span ref={labelRef} className="font-mono text-caption uppercase tracking-[0.32em] text-muted">
            {content.label}
          </span>
          <h2 ref={headingRef} className="text-balance text-h2 font-bold leading-[1.15] text-foreground">
            {content.headingLine1}
            <br />
            {content.headingLine2}
          </h2>
        </div>

        <div
          ref={detailRef}
          className="relative aspect-[4/3] w-full max-w-[16rem] shrink-0 overflow-hidden rounded-sm border border-white/10 shadow-elevated sm:mb-2"
        >
          <Image
            src={noirImages.handProduct}
            alt="A hand holding the NOIR N°01 bottle, lit by a narrow beam of light."
            fill
            sizes="(min-width: 640px) 16rem, 70vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
