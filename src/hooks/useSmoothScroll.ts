import { useEffect } from "react";

/**
 * Enables smooth scrolling for in-page anchor navigation.
 */
export const useSmoothScroll = (): void => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
};