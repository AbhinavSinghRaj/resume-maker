import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false during SSR and hydration, true afterwards — guards UI that depends on localStorage-persisted state. */
export function useMounted(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
