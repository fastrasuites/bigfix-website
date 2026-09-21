import type { MouseEvent } from "react";

/**
 * Smoothly scrolls the viewport to the element carrying the given id.
 */
export const scrollToSection = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/**
 * Builds an anchor/button click handler that scrolls to a section instead of
 * letting the browser jump to it.
 */
export const createScrollHandler =
  (id: string) =>
  (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    scrollToSection(id);
  };