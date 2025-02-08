import { DEFAULT_LONG_CLICK_MS } from "../constants.d";

export function isLongClick(keyDownMillis: number): boolean {
  return Date.now() - keyDownMillis >= DEFAULT_LONG_CLICK_MS;
}

export function isNotLongClick(keyDownMillis: number): boolean {
  return !isLongClick(keyDownMillis);
}

export function onLongClick(keyDownMillis: number, then: () => void) {
  setTimeout(() => {
    if (isLongClick(keyDownMillis)) {
      then();
    }
  }, DEFAULT_LONG_CLICK_MS);
}
