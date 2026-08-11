export interface TextPoint {
  x: number;
  y: number;
  letterIndex: number;
}

interface SampleTextPointsOptions {
  text: string;
  /** A resolved, canvas-safe font-family string - read via
   * `getComputedStyle` from a live DOM node, never a CSS custom property
   * (canvas's 2D context can't resolve `var(--font-x)` itself). */
  fontFamily: string;
  fontWeight?: string | number;
  width: number;
  height: number;
  letterSpacingPx?: number;
  /** Pixel stride between sampled positions - lower is denser/slower. */
  sampleStep?: number;
  maxPoints: number;
}

/**
 * Draws `text` to an offscreen canvas and returns a randomly-sampled set of
 * points sitting on the glyphs' own ink - the raw material the particle
 * field animates toward, so particles visibly assemble the letterforms'
 * geometry rather than fading in as flat text.
 */
export function sampleTextPoints({
  text,
  fontFamily,
  fontWeight = 700,
  width,
  height,
  letterSpacingPx = 0,
  sampleStep = 2,
  maxPoints,
}: SampleTextPointsOptions): TextPoint[] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";

  const fontSize = Math.floor(height * 0.72);
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  // Canvas has no native letter-spacing control, so each character is
  // advanced manually - the only way to make the sampled silhouette match
  // the wordmark's own deliberately wide tracking.
  const chars = text.split("");
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth = widths.reduce((a, b) => a + b, 0) + letterSpacingPx * (chars.length - 1);

  let cursorX = (width - totalWidth) / 2;
  const baselineY = height / 2 + fontSize * 0.36;
  const letterRanges: { start: number; end: number }[] = [];

  chars.forEach((ch, i) => {
    const start = cursorX;
    ctx.fillText(ch, cursorX, baselineY);
    cursorX += widths[i] + letterSpacingPx;
    letterRanges.push({ start, end: cursorX });
  });

  const { data } = ctx.getImageData(0, 0, width, height);
  const candidates: TextPoint[] = [];

  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha <= 140) continue;
      let letterIndex = letterRanges.findIndex((r) => x >= r.start && x < r.end);
      if (letterIndex === -1) letterIndex = chars.length - 1;
      candidates.push({ x, y, letterIndex });
    }
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return candidates.slice(0, maxPoints);
}
