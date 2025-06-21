export function bindOnEndScroll(func: () => void) {
  function handler() {
    const windowInnerHeight = window.innerHeight;
    const docElement = document.documentElement;

    if (
      windowInnerHeight + docElement.scrollTop >=
      docElement.offsetHeight - 50
    ) {
      func();
    }
  }

  window.removeEventListener("scroll", handler);
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}
