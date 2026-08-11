/**
 * Shared tuning for the Hero's particle-construction intro - the one place
 * both Hero.tsx (which plays the sequence) and FloatingNav.tsx (which waits
 * for it to land before revealing site chrome) read timing from, so the two
 * can never drift out of sync. Replaces the old fog-era `atmosphere.config`;
 * nothing here describes fog, since the Hero no longer has any.
 */
export const heroIntroConfig = {
  timing: {
    /** Held black before the first particles appear, seconds. */
    intro: 0.12,
    /** Scattered points attract into the NOTIC silhouette, seconds. */
    construction: 1.45,
    /** Brief hold, brightness build, the one clean flash, and the crossfade
     * into the razor-sharp DOM wordmark, seconds. */
    lock: 0.35,
    /** Pause once NOTIC has locked, before the descriptor arrives, seconds. */
    hold: 0.2,
    /** Descriptor line reveal, seconds. */
    descriptor: 0.35,
    /** Microcopy + scroll cue reveal, seconds. */
    reveal: 0.35,
  },
  particles: {
    desktopCount: 2200,
    mobileCount: 700,
    reducedMotionCount: 0,
  },
} as const;

/** Total time from black to the wordmark being fully locked (sharp, not yet
 * including the descriptor/microcopy beat that follows it) - the metric the
 * brief's "1.8-2.5s" target is measured against. */
export const HERO_LOCK_SECONDS =
  heroIntroConfig.timing.intro + heroIntroConfig.timing.construction + heroIntroConfig.timing.lock;

/** Total time from black through the descriptor settling - what
 * FloatingNav waits for before revealing site chrome, so the nav never
 * appears while the identity moment is still resolving. */
export const HERO_SETTLE_SECONDS = HERO_LOCK_SECONDS + heroIntroConfig.timing.hold + heroIntroConfig.timing.descriptor;
