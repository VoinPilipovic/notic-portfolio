import Lenis from "lenis";

export function createLenis(): Lenis {
  return new Lenis({
    duration: 1.45,
    easing: (t: number) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
  });
}
