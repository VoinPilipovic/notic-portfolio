// Centralized manifest for every BMW Experience asset - exact on-disk
// filenames (the images ship as .jpg.jpeg, not .jpg) so no component ever
// hardcodes a path. Runtime URLs are the public-relative form; `/public`
// itself is never part of the served path.
export const bmwImages = {
  interior: "/assets/bmw/images/01-interior.jpg.jpeg",
  launchStage: "/assets/bmw/images/02-launch-stage.jpg.jpeg",
  tunnel: "/assets/bmw/images/03-tunnel.jpg.jpeg",
  rear: "/assets/bmw/images/04-rear.jpg.jpeg",
  wheel: "/assets/bmw/images/05-wheel.jpg.jpeg",
  headlight: "/assets/bmw/images/06-headlight.jpg.jpeg",
  diffuser: "/assets/bmw/images/07-diffuser.jpg.jpeg",
  topView: "/assets/bmw/images/08-top-view.jpg.jpeg",
  studio: "/assets/bmw/images/09-studio.jpg.jpeg",
  fogHero: "/assets/bmw/images/10-fog-hero.jpg.jpeg",
} as const;

export const bmwVideos = {
  tunnel: "/assets/bmw/videos/01-tunnel.mp4",
  headlight: "/assets/bmw/videos/02-headlight.mp4",
  interior: "/assets/bmw/videos/03-interior.mp4",
  studio: "/assets/bmw/videos/04-studio.mp4",
} as const;
