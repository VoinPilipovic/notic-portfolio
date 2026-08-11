import * as THREE from "three";

// Each particle travels from a scattered `aStart` to its `aTarget` position
// on the NOTIC silhouette, staggered by `aDelay` so letters overlap rather
// than arriving as five separate scenes. `uFlash` is the one brightness
// event at the end - blending every particle toward white - standing in
// for a controlled "signal acquired" flash without any post-processing
// bloom pass.
const vertexShader = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aTarget;
  attribute float aDelay;
  attribute float aSize;
  attribute float aTint;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBaseSize;
  uniform float uSpan;

  varying float vTint;
  varying float vAlpha;
  varying float vTwinkle;

  float easeOutCubic(float t) {
    float f = t - 1.0;
    return f * f * f + 1.0;
  }

  void main() {
    float local = clamp((uProgress - aDelay) / uSpan, 0.0, 1.0);
    float eased = easeOutCubic(local);

    vec3 pos = mix(aStart, aTarget, eased);

    // A small decaying arc so the arrival reads as controlled motion -
    // attraction, not a flat straight-line slide.
    float arc = sin(local * 3.14159265) * (1.0 - eased);
    pos.z += arc * 14.0;
    pos.y += arc * 5.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeBoost = 1.0 + (1.0 - eased) * 0.7;
    gl_PointSize = aSize * uBaseSize * uPixelRatio * sizeBoost;

    vTint = aTint;
    vAlpha = 0.3 + eased * 0.7;
    vTwinkle = sin(uTime * 2.1 + aDelay * 46.0) * 0.5 + 0.5;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying float vTint;
  varying float vAlpha;
  varying float vTwinkle;

  uniform vec3 uColorBase;
  uniform vec3 uColorSignal;
  uniform float uFlash;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    if (alpha <= 0.001) discard;

    vec3 color = mix(uColorBase, uColorSignal, vTint);
    color = mix(color, vec3(1.0), uFlash);

    float twinkle = mix(1.0, vTwinkle, 0.22);
    gl_FragColor = vec4(color, alpha * vAlpha * twinkle);
  }
`;

export interface ParticleMaterialOptions {
  colorBase: string;
  colorSignal: string;
  baseSize: number;
  /** Fraction of the 0-1 progress range each individual particle's own
   * travel takes - smaller means a snappier per-particle arrival within
   * the overall construction window. */
  span: number;
}

export function createParticleMaterial({ colorBase, colorSignal, baseSize, span }: ParticleMaterialOptions) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uBaseSize: { value: baseSize },
      uSpan: { value: span },
      uFlash: { value: 0 },
      uColorBase: { value: new THREE.Color(colorBase) },
      uColorSignal: { value: new THREE.Color(colorSignal) },
    },
  });
}

export type ParticleMaterial = THREE.ShaderMaterial;
