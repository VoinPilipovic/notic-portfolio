"use client";

import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  // InertiaPlugin drives the NOTIC PAY payment card's release-and-settle
  // rotation (src/components/card/PaymentCard.tsx) - registered here,
  // alongside ScrollTrigger, since both share this one global gsap
  // instance across the whole app.
  gsap.registerPlugin(ScrollTrigger, InertiaPlugin);
}

export { gsap, ScrollTrigger };
