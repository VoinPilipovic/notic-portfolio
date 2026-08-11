// Centralized manifest for every NOIR N°01 asset - mirrors the BMW asset
// registry's discipline (one place, real on-disk filenames, no path ever
// hardcoded inside a component).
export const noirImages = {
  lightBeam: "/assets/noir/images/01-light-beam.jpg",
  diagonalShadow: "/assets/noir/images/02-diagonal-shadow.jpg",
  handProduct: "/assets/noir/images/03-hand-product.jpg",
  manProduct: "/assets/noir/images/04-man-product.jpg",
  liquidDetail: "/assets/noir/images/05-liquid-detail.jpg",
  macroGlass: "/assets/noir/images/06-macro-glass.jpg",
  productLight: "/assets/noir/images/07-product-light.jpg",
  heroSmoke: "/assets/noir/images/08-hero-smoke.jpg",
  wetStone: "/assets/noir/images/09-wet-stone.jpg",
  architecture: "/assets/noir/images/10-architecture.jpg",
} as const;

export const noirVideos = {
  architecture: "/assets/noir/videos/01-architecture.mp4",
  hero: "/assets/noir/videos/02-hero.mp4",
  macro: "/assets/noir/videos/03-macro.mp4",
  man: "/assets/noir/videos/04-man.mp4",
} as const;
