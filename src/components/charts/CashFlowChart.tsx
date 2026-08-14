"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { gsap } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatCurrency } from "@/lib/utils";
import type { AnalyticsPoint } from "@/types/banking";

interface CashFlowChartProps {
  points: AnalyticsPoint[];
}

const WIDTH = 400;
const HEIGHT = 130;

/**
 * A lightweight custom SVG chart, not a charting library - the whole thing
 * is two path strings computed once from `points` (pure math against a
 * fixed viewBox, no layout reads), animated in with a single stroke-draw
 * tween rather than any per-frame redraw. Mount this with `key={period}`
 * from the parent so a period change gets a clean remount instead of a
 * manual path morph.
 */
export function CashFlowChart({ points }: CashFlowChartProps) {
  const spendPathRef = useRef<SVGPathElement>(null);
  const spendAreaRef = useRef<SVGPathElement>(null);
  const incomePathRef = useRef<SVGPathElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { spendLine, spendArea, incomeLine, coords } = useMemo(() => {
    // Spend and income get independent scales - income (a monthly salary
    // spike) is often 5-10x a weekly spend figure, and sharing one scale
    // would flatten the spend line (the series the summary stats and
    // category breakdown are actually about) into near-invisibility.
    const maxSpend = Math.max(1, ...points.map((p) => p.spend)) * 1.15;
    const maxIncome = Math.max(1, ...points.map((p) => p.income)) * 1.15;
    const stepX = points.length > 1 ? WIDTH / (points.length - 1) : 0;
    const coords = points.map((p, i) => ({
      x: stepX * i,
      spendY: HEIGHT - (p.spend / maxSpend) * HEIGHT,
      incomeY: HEIGHT - (p.income / maxIncome) * HEIGHT,
    }));
    const spendLine = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.spendY}`).join(" ");
    const spendArea = `${spendLine} L${coords[coords.length - 1].x},${HEIGHT} L${coords[0].x},${HEIGHT} Z`;
    const incomeLine = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.incomeY}`).join(" ");
    return { spendLine, spendArea, incomeLine, coords };
  }, [points]);

  useEffect(() => {
    const line = spendPathRef.current;
    const area = spendAreaRef.current;
    const income = incomePathRef.current;
    if (!line || !area || !income) return;

    if (prefersReducedMotion) {
      gsap.set([line, income], { strokeDashoffset: 0 });
      gsap.set(area, { opacity: 1 });
      return;
    }

    const lineLength = line.getTotalLength();
    const incomeLength = income.getTotalLength();
    gsap.set(line, { strokeDasharray: lineLength, strokeDashoffset: lineLength });
    gsap.set(income, { strokeDasharray: incomeLength, strokeDashoffset: incomeLength });
    gsap.set(area, { opacity: 0 });

    const tl = gsap.timeline();
    tl.to(line, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, 0)
      .to(income, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, 0.05)
      .to(area, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0.15);

    return () => {
      tl.kill();
    };
    // Runs once per mount - the parent remounts this component (via a
    // `key`) whenever `points` actually changes, so there's no stale
    // in-flight tween to fight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateActive = (clientX: number) => {
    const rect = boundsRef.current;
    if (!rect || !coords.length) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const index = Math.round(ratio * (coords.length - 1));
    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  const onPointerDown = (event: ReactPointerEvent<SVGRectElement>) => {
    boundsRef.current = rectRef.current?.getBoundingClientRect() ?? null;
    updateActive(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<SVGRectElement>) => {
    if (!boundsRef.current) boundsRef.current = rectRef.current?.getBoundingClientRect() ?? null;
    updateActive(event.clientX);
  };

  const clearActive = () => {
    activeIndexRef.current = null;
    setActiveIndex(null);
  };

  const active = activeIndex !== null ? points[activeIndex] : null;
  const activeCoord = activeIndex !== null ? coords[activeIndex] : null;
  const tooltipLeft = activeCoord ? Math.min(88, Math.max(12, (activeCoord.x / WIDTH) * 100)) : 0;
  const tooltipTop = activeCoord ? (activeCoord.spendY / HEIGHT) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 font-mono text-caption uppercase tracking-widest text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          Spend
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
          Income
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="h-40 w-full overflow-visible"
          role="img"
          aria-label="Cash flow chart"
        >
          <defs>
            <linearGradient id="cashflow-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={0}
              x2={WIDTH}
              y1={HEIGHT * f}
              y2={HEIGHT * f}
              stroke="var(--color-border)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path ref={spendAreaRef} d={spendArea} fill="url(#cashflow-fill)" stroke="none" />
          <path
            ref={incomePathRef}
            d={incomeLine}
            fill="none"
            stroke="var(--color-foreground)"
            strokeOpacity={0.35}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={spendPathRef}
            d={spendLine}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {activeCoord && (
            <g aria-hidden>
              <line
                x1={activeCoord.x}
                x2={activeCoord.x}
                y1={0}
                y2={HEIGHT}
                stroke="var(--color-border)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={activeCoord.x}
                cy={activeCoord.spendY}
                r={3.5}
                fill="var(--color-accent-hover)"
                stroke="var(--color-background)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )}

          <rect
            ref={rectRef}
            x={0}
            y={0}
            width={WIDTH}
            height={HEIGHT}
            fill="transparent"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerLeave={clearActive}
            onPointerUp={clearActive}
            onPointerCancel={clearActive}
            style={{ touchAction: "pan-y", cursor: "crosshair" }}
          />
        </svg>

        {active && (
          <div
            aria-hidden
            className="pointer-events-none absolute flex flex-col gap-0.5 rounded-md border border-border bg-surface-raised px-2.5 py-1.5 shadow-elevated"
            style={{ left: `${tooltipLeft}%`, top: `${tooltipTop}%`, transform: "translate(-50%, calc(-100% - 10px))" }}
          >
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">{active.label}</span>
            <span className="font-mono text-caption tabular text-accent-hover">{formatCurrency(active.spend)}</span>
            <span className="font-mono text-[0.65rem] tabular text-muted">Income {formatCurrency(active.income)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between font-mono text-[0.65rem] uppercase tracking-widest text-muted">
        {points.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}
