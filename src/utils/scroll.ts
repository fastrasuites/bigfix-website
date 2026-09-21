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

/**
 * Builds a cross-page scroll handler:
 * - If already on the home page ("/"), prevents default and smooth-scrolls to the section.
 * - Otherwise, lets the browser navigate to "/#id" (which loads the home page and scrolls).
 */
export const createCrossPageScrollHandler =
  (id: string) =>
  (event: MouseEvent<HTMLElement>): void => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      scrollToSection(id);
    }
    // else: let default navigation to "/#id" happen
  };

/**
 * Builds a scroll handler for links pointing to a specific page:
 * - If already on the target page, prevents default and smooth-scrolls to the section.
 * - Otherwise, lets the router handle navigation to the target page.
 */
export const createPageScrollHandler =
  (pathname: string, id: string) =>
  (event: MouseEvent<HTMLElement>): void => {
    if (window.location.pathname === pathname) {
      event.preventDefault();
      scrollToSection(id);
    }
    // else: let the Link/router handle navigation
  };