// Centralized manifest for every CASA 01 asset - mirrors the BMW/NOIR asset
// registries' discipline (one place, real on-disk filenames, no path ever
// hardcoded inside a component). Only `hero` is used in phase 1; the rest
// are registered now so later chapters never need to touch this file's
// shape, only add to it.
export const casaImages = {
  hero: "/assets/casa-01/hero.jpeg",
  night: "/assets/casa-01/night.jpeg",
  aerial: "/assets/casa-01/aerial.jpeg",
  bedroom: "/assets/casa-01/bedroom.jpeg",
  kitchen: "/assets/casa-01/kitchen.jpeg",
  concept: "/assets/casa-01/concept.png",
  frontDrone: "/assets/casa-01/front-drone.png",
} as const;
