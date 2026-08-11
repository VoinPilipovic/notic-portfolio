"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/** True once hydrated on the client - the sanctioned way to gate
 * client-only APIs (like a portal target) without calling setState inside
 * an effect, which just causes an extra render for the same result. */
export function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
