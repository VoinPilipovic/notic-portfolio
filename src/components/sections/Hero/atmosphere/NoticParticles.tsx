"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { createParticleMaterial, type ParticleMaterial } from "./particleMaterial";
import { sampleTextPoints } from "./textPoints";

interface ParticleFieldProps {
  onReady: (material: ParticleMaterial) => void;
  particleCount: number;
  colorBase: string;
  colorSignal: string;
  fontFamilyVar: string;
}

const NARROW_BREAKPOINT = 640;

function ParticleField({ onReady, particleCount, colorBase, colorSignal, fontFamilyVar }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<ParticleMaterial | null>(null);
  const { size } = useThree();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const points = pointsRef.current;
      if (!points) return;

      await document.fonts.ready;
      if (cancelled) return;

      // Canvas text can't resolve a CSS custom property directly - read the
      // font next/font actually resolved to from a live, styled node.
      const probe = document.createElement("span");
      probe.style.fontFamily = fontFamilyVar;
      probe.style.position = "fixed";
      probe.style.top = "-9999px";
      probe.style.visibility = "hidden";
      document.body.appendChild(probe);
      const resolvedFamily = getComputedStyle(probe).fontFamily;
      document.body.removeChild(probe);

      const isNarrow = size.width < NARROW_BREAKPOINT;
      const canvasWidth = Math.round(Math.min(size.width * (isNarrow ? 0.82 : 0.56), isNarrow ? 480 : 860));
      const canvasHeight = Math.round(canvasWidth * 0.26);

      const rawPoints = sampleTextPoints({
        text: "NOTIC",
        fontFamily: resolvedFamily,
        fontWeight: 700,
        width: canvasWidth,
        height: canvasHeight,
        letterSpacingPx: canvasWidth * 0.02,
        sampleStep: isNarrow ? 3 : 2,
        maxPoints: particleCount,
      });
      if (cancelled || rawPoints.length === 0) return;

      const count = rawPoints.length;
      const starts = new Float32Array(count * 3);
      const targets = new Float32Array(count * 3);
      const delays = new Float32Array(count);
      const sizes = new Float32Array(count);
      const tints = new Float32Array(count);
      const scatterRadius = Math.max(canvasWidth, canvasHeight) * 0.85;

      rawPoints.forEach((p, i) => {
        const tx = p.x - canvasWidth / 2;
        const ty = -(p.y - canvasHeight / 2);
        targets[i * 3] = tx;
        targets[i * 3 + 1] = ty;
        targets[i * 3 + 2] = 0;

        // Scattered signal points, not a uniform cloud - drawn from a
        // rough sphere around the eventual target so the "gathering"
        // motion reads from many directions at once.
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = scatterRadius * (0.55 + Math.random() * 0.75);
        starts[i * 3] = tx + r * Math.sin(phi) * Math.cos(theta) * 0.55;
        starts[i * 3 + 1] = ty + r * Math.sin(phi) * Math.sin(theta) * 0.55;
        starts[i * 3 + 2] = r * Math.cos(phi) * 0.4;

        // Delay keyed to which letter this point belongs to, plus jitter -
        // all five letters begin forming with overlap, not in sequence.
        delays[i] = Math.min(0.68, (p.letterIndex / 5) * 0.6 + Math.random() * 0.14);
        sizes[i] = 0.6 + Math.random() * 0.85;
        tints[i] = Math.random() < 0.15 ? 1 : 0;
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(targets, 3));
      geometry.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));
      geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
      geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));

      const material = createParticleMaterial({
        colorBase,
        colorSignal,
        baseSize: isNarrow ? 2.0 : 2.5,
        span: 0.34,
      });
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);

      points.geometry.dispose();
      points.geometry = geometry;
      points.material = material;
      materialRef.current = material;

      onReady(material);
    }

    init();

    return () => {
      cancelled = true;
      materialRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return <points ref={pointsRef} />;
}

interface NoticParticlesProps {
  onReady: (material: ParticleMaterial) => void;
  particleCount: number;
  colorBase: string;
  colorSignal: string;
  /** The CSS `var(--font-x)` reference to resolve for canvas sampling -
   * must match the font applied to the DOM wordmark this crossfades into. */
  fontFamilyVar: string;
}

/**
 * The particle-construction intro: a field of points that gathers from
 * scattered positions into the NOTIC silhouette, sampled directly off the
 * real display face so the particles visibly build the letterforms rather
 * than a text fade standing in for one. An orthographic camera at zoom 1
 * maps one Three.js unit to one CSS pixel, so the sampled canvas
 * coordinates can be used directly as world positions with no extra scale
 * math - and so this layer lines up pixel-for-pixel with the DOM wordmark
 * it hands off to.
 */
export function NoticParticles({ onReady, particleCount, colorBase, colorSignal, fontFamilyVar }: NoticParticlesProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      className="h-full w-full"
    >
      <ParticleField
        onReady={onReady}
        particleCount={particleCount}
        colorBase={colorBase}
        colorSignal={colorSignal}
        fontFamilyVar={fontFamilyVar}
      />
    </Canvas>
  );
}
